import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";

const AllStores = ({ className, selectedCategory }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  // mark as favorite state

  const [favoriteStores, setFavoriteStores] = useState(() => {
    const storedFavorites = localStorage.getItem("favoriteStores");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });

  // Status options

  const statusOptions = ["", "publish", "draft", "trash"];
  
  // Boolean filter options

  const booleanFilters = [
    { name: "cashback_enabled", label: "Cashback Enabled" },
    { name: "is_promoted", label: "Promoted" },
    { name: "is_sharable", label: "Share & Earn Enabled" },
  ];

  // Alphabet options (A-Z)

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Handle alphabet filtering

  const handleAlphabetFilter = (letter) => {
    const params = new URLSearchParams(searchParams);

    if (letter) {
      params.set("name_like", letter);
    } else {
      params.delete("name_like");
    }
    setSearchParams(params);
  };

  // logic for managing infinite scroll

  const observer = useRef();

  const lastStoreElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // handling mark as favorite

  const handleFavoriteClick = (storeId) => {
    setFavoriteStores((prevFavorites) => {
      if (prevFavorites.includes(storeId)) {
        return prevFavorites.filter((id) => id !== storeId); // Remove from favorites
      } else {
        return [...prevFavorites, storeId]; // Add to favorites
      }
    });
  };

  // handling render cashback logic

  const renderCashback = (store) => {
    if (!store.cashback_enabled) return "No cashback available";
    const cashbackString =
      store.amount_type === "fixed"
        ? `$${store.cashback_amount.toFixed(2)}`
        : `${store.cashback_amount.toFixed(2)}%`;
    return `${
      store.rate_type === "upto" ? "Upto" : "Flat"
    } ${cashbackString} cashback`;
  };


  // Handling status selection
  
  const handleStatusChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value === "") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    setSearchParams(params);
  };

  // Handling sorting change

  const handleSortChange = (e) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams);

    if (value === "") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    setSearchParams(params);
    setPage(1); // Reset page when sorting
  };

  // Handling filtering through checkbox

  const handleCheckboxChange = (filterName, checked) => {
    const params = new URLSearchParams(searchParams);

    if (checked) {
      params.set(filterName, "1");
    } else {
      params.delete(filterName);
    }

    setSearchParams(params);
  };


  // handling mark as favorite  render

  useEffect(() => {
    localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));
  }, [favoriteStores]);


  // flitering and sorting logic
  
  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `http://localhost:3001/stores?_page=${page}&_limit=20`;

        // Add selected category

        if (selectedCategory) {
          url += `&cats=${selectedCategory}`;
        }

        // Add search query

        if (searchQuery.trim()) {
          url += `&name_like=${searchQuery}`;
        }

        // Add sorting

        const sortParam = searchParams.get("sort");
        if (sortParam) {
          switch (sortParam) {
            case "name":
              url += `&_sort=name&_order=asc`;
              break;
            case "featured":
              url += `&_sort=featured&_order=desc`;
              break;
            case "popularity":
              url += `&_sort=clicks&_order=desc`;
              break;
            case "cashback":
              url += `&_sort=amount_type,cashback_amount&_order=asc,desc`;
              break;
            default:
              break;
          }
        }

        // Add  filters

        searchParams.forEach((value, key) => {
          url += `&${key}=${value}`;
        });

        // console.log("Fetching from:", url);

        const response = await axios.get(url);
        if (response.data.length === 0 || response.data.length < 20) {
          setHasMore(false);
        }

        setStores((prevStores) => {
          if (page === 1) return response.data; // Reset data on filter change
          const newStores = response.data.filter(
            (newStore) =>
              !prevStores.find((prevStore) => prevStore.id === newStore.id)
          );
          return [...prevStores, ...newStores];
        });

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [page, searchParams.toString(), searchQuery, selectedCategory]); 



  // Handling  search input

  useEffect(() => {

    const delaySearch = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (searchQuery.trim()) {
        params.set("search", searchQuery);
      } else {
        params.delete("search");
      }

      setSearchParams(params);
    }, 500); // Delay to reduce API calls

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);


  return (
    <div className="flex flex-col">
      <div className="flex justify-between bg-slate-100 p-4 rounded-lg">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Filter and Sort Stores</h2>

          <div className="grid grid-cols-1">
            <div className="grid grid-cols-2">
              {/* Alphabet Filtering */}
              <div>
                <div className="mb-4 flex flex-col">
                  <label className="block text-sm font-medium mb-1">
                    Filter by Alphabet
                  </label>
                  <div className="flex flex-wrap">
                    {alphabet.map((letter) => (
                      <button
                        key={letter}
                        className={`p-2 border rounded-md text-sm ${
                          searchParams.get("name_like") === letter
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100"
                        }`}
                        onClick={() => handleAlphabetFilter(letter)}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Boolean Filters as Checkboxes */}
                <div className="mb-4 flex gap-2">
                  {booleanFilters.map((filter) => (
                    <div
                      key={filter.name}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={filter.name}
                        checked={searchParams.get(filter.name) === "1"}
                        onChange={(e) =>
                          handleCheckboxChange(filter.name, e.target.checked)
                        }
                      />
                      <label htmlFor={filter.name} className="text-sm">
                        {filter.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              
              {/* sort by name, feature, popularity and cashback */}

              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium">Sort By</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    onChange={handleSortChange}
                    value={searchParams.get("sort") || ""}
                  >
                    <option value="">Default</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="featured">Featured</option>
                    <option value="popularity">Popularity</option>
                    <option value="cashback">Cashback</option>
                  </select>
                </div>

                {/* Status Filter Dropdown */}

                <div className="mb-4">
                  <label className="block text-sm font-medium">
                    Filter by Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    onChange={handleStatusChange}
                    value={searchParams.get("status") || ""}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status === ""
                          ? "All"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* Search Filter */}

            <div className="mb-4">
              <label className="block text-sm font-medium">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store..."
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-4 gap-2 my-[50px] ${className}`}>

        {stores.map((store, index) => {

          // cheching last store
          
          if (stores.length === index + 1) {
            return (
              <div
                ref={lastStoreElementRef}
                key={store.id}
                className="border p-4 mb-4 relative rounded-lg hover:shadow-lg"
              >
                <Link to={store.homepage}>
                  <h3>{store.name}</h3>
                  <div>
                    <img src={store.logo} alt="" />
                  </div>
                  <div className="cashback">{renderCashback(store)}</div>
                </Link>
                <button
                  className="absolute top-1 right-1 text-red-500"
                  onClick={() => handleFavoriteClick(store.id)}
                >
                  {favoriteStores.includes(store.id) ? "❤️" : "🤍"}{" "}

                  {/* Conditional heart icon */}
                
                </button>
              </div>
            );

          } else {
            return (
              <div
                key={store.id}
                className="border p-4 mb-4 relative rounded-lg hover:shadow-lg"
              >
                <Link to={store.homepage}>
                  <h3>{store.name}</h3>
                  <div>
                    <img src={store.logo} alt="" />
                  </div>
                  <div className="cashback">{renderCashback(store)}</div>
                </Link>
                <button
                  className="absolute top-1 right-1 text-red-500"
                  onClick={() => handleFavoriteClick(store.id)}
                >
                  {favoriteStores.includes(store.id) ? "❤️" : "🤍"}{" "}

                  {/* Conditional heart icon */}
                
                </button>
              </div>
            );
          }
        })}
        {loading && <div>Loading...</div>}
        {!hasMore && <div>No more stores to show.</div>}
      </div>
    </div>
  );
};

export default AllStores;
