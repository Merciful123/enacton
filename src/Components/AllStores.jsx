import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

const AllStores = ({ className, selectedCategory }) => {
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

  // sorting, searching and flitering  logic

  const fetchStores = async ({ pageParam = 1 }) => {
    let url = `http://localhost:3001/stores?_limit=20&_page=${pageParam}`;

    if (selectedCategory) {
      url += `&cats=${selectedCategory}`;
    }
    if (searchQuery.trim()) {
      url += `&name_like=${searchQuery}`;
    }
    searchParams.forEach((value, key) => {
      if (key !== "search") {
        url += `&${key}=${value}`;
      }
    });

    const sortParam = searchParams.get("sort");

    if (sortParam) {
      switch (sortParam) {
        case "name":
          url += `&_sort=name`;
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

    const response = await axios.get(url);
    return {
      data: response.data,
      nextPage: response.data.length === 20 ? pageParam + 1 : undefined,
    };
  };

  // infinite scroll and data fetching using react-query

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      "stores",
      selectedCategory,
      searchParams.toString(),
      searchQuery,
    ],
    queryFn: fetchStores,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    keepPreviousData: true,
  });

  const observer = useRef();
  const lastStoreElementRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  const stores = data?.pages.flatMap((page) => page.data) || [];

  // Handling  search input query

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
  }, [searchQuery]);

  // Reset filter and sort logic
  const handleResetFilters = () => {
    setSearchParams({
      ...(selectedCategory && { cats: selectedCategory }),
    });
  };

  return (
    <>
      <div className="grid md:grid-rows-[auto_1fr]">
        <div className="flex justify-between bg-slate-100 p-4 rounded-lg">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">
              Filter and Sort Stores
            </h2>

            <div className="grid grid-cols-1">
              <div className="grid md:grid-cols-2 gap-2">
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

              {/* Reset button */}
              <button
                className="px-4 py-2 bg-slate-200 mb-4 mt-4  hover:bg-slate-300 text-black rounded-md"
                onClick={handleResetFilters}
              >
                Reset Filters & Sorts
              </button>

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

        {/* rendering UI */}

        <div className="text-center text-2xl font-bold">Stores</div>
        <div
          className={`h-fit grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-2 mt-4 ${className}`}
        >
          {stores?.map((store, index) => {
            if (stores.length === index + 1) {
              return (
                <div
                  key={store.id}
                  ref={lastStoreElementRef}
                  className="border h-fit p-4 py-4 mb-4 relative rounded-lg hover:shadow-xl bg-slate-200"
                >
                  <Link to={store.homepage} className="flex flex-col gap-4 ">
                    <h3 className="truncate ">{store.name}</h3>
                    <div className="h-fit">
                      <img
                        src={store.logo}
                        alt=""
                        className="h-[5rem] w-[10rem] max-sm:w-full"
                      />
                    </div>
                    <div className="cashback">{renderCashback(store)}</div>
                  </Link>
                  <button
                    className="absolute top-1 right-1 text-red-500"
                    onClick={() => handleFavoriteClick(store.id)}
                  >
                    {favoriteStores.includes(store.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              );
            } else {
              return (
                <div
                  key={store.id}
                  className="  border h-fit py-4 p-4 mb-4 relative rounded-lg hover:shadow-xl bg-slate-200"
                >
                  <Link to={store.homepage} className=" flex flex-col gap-4">
                    <h3 className="truncate ">{store.name}</h3>
                    <div className="h-fit">
                      <img
                        src={store.logo}
                        alt=""
                        className="h-[5rem] w-[10rem] max-sm:w-full"
                      />
                    </div>
                    <div className="cashback">{renderCashback(store)}</div>
                  </Link>
                  <button
                    className="absolute top-1 right-1 text-red-500"
                    onClick={() => handleFavoriteClick(store.id)}
                  >
                    {favoriteStores.includes(store.id) ? "❤️" : "🤍"}
                  </button>
                </div>
              );
            }
          })}

          {/* no more data UI */}

          {stores.length === 0 && !isLoading && (
            <div className="h-fit text-red-500">Store not found!!</div>
          )}

          {/* error message */}

          {error && (
            <div className="h-fit text-red-500">Error: {error.message}</div>
          )}

          {/* skeleton UI, if data not found */}

          {isLoading && (
            <div className={` my-[50px] grid grid-cols-4 ${className} flex`}>
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="border  p-4 mb-4 relative rounded-lg animate-pulse bg-gray-200"
                >
                  <div className="h-6 bg-gray-300 rounded-md mb-2"></div>{" "}
                  {/* Placeholder for title */}
                  <div className="h-24 bg-gray-300 rounded-md"></div>{" "}
                  {/* Placeholder for image */}
                  <div className="h-4 bg-gray-300 rounded-md mt-2"></div>{" "}
                  {/* Placeholder for cashback */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllStores;
