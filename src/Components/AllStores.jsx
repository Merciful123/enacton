import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const AllStores = ({ className }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false); // Loading is false initially
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favoriteStores, setFavoriteStores] = useState(() => {
    const storedFavorites = localStorage.getItem("favoriteStores");
    return storedFavorites ? JSON.parse(storedFavorites) : [];
  });
  const { categoryId } = useParams();
  // console.log(categoryId)
  const observer = useRef();

  const lastStoreElementRef = useCallback(
    (node) => {
      if (loading) return; // Don't observe while loading
      if (observer.current) observer.current.disconnect(); // Disconnect previous observer
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  ); // Crucial: Include loading and hasMore in the dependency array

  useEffect(() => {
    localStorage.setItem("favoriteStores", JSON.stringify(favoriteStores));
  }, [favoriteStores]);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      setError(null); // Reset error on new fetch
      try {
        let url = `http://localhost:3001/stores?_page=${page}&_limit=20`;
        if (categoryId) {
          url += `&cats=${categoryId}`;
        }
        
        console.log(page)
        const response = await axios.get(url);
        if (response.data.length === 0 || response.data.length < 20) {
          setHasMore(false);
        }
        // Key Fix: Use a unique identifier for keys
        setStores((prevStores) => {
          const newStores = response.data.filter(
            (newStore) =>
              !prevStores.find((prevStore) => prevStore.id === newStore.id)
          );
          return [...prevStores, ...newStores];
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (loading) return; // Prevent multiple fetches while still loading
    fetchStores();
  }, [categoryId, page]);

  const handleFavoriteClick = (storeId) => {
    setFavoriteStores((prevFavorites) => {
      if (prevFavorites.includes(storeId)) {
        return prevFavorites.filter((id) => id !== storeId);
      } else {
        return [...prevFavorites, storeId];
      }
    });
  };

  if (loading && page === 1) {
    return <div className={`${className} my-[50px]`}>Loading stores...</div>;
  }

  if (error) {
    return (
      <div className={`${className} my-[50px]`}>Error: {error.message}</div>
    );
  }

  return (
    <div className={`my-[50px] ${className}`}>
      {stores.map((store, index) => {
        if (stores.length === index + 1) {
          return (
            <div
              ref={lastStoreElementRef}
              key={store.id}
              className="border p-4 mb-4 relative"
            >
              <h3>{store.name}</h3>
              <p>Category: {store.category}</p>
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={() => handleFavoriteClick(store.id)}
              >
                {favoriteStores.includes(store.id) ? "❤️" : "🤍"}
              </button>
            </div>
          );
        } else {
          return (
            <div key={store.id} className="border p-4 mb-4 relative">
              <h3>{store.name}</h3>
              <p>Category: {store.category}</p>
              <button
                className="absolute top-2 right-2 text-red-500"
                onClick={() => handleFavoriteClick(store.id)}
              >
                {favoriteStores.includes(store.id) ? "❤️" : "🤍"}
              </button>
            </div>
          );
        }
      })}
      {loading && <div>Loading...</div>}
      {!hasMore && <div>No more stores to show.</div>}
    </div>
  );
};

export default AllStores;
