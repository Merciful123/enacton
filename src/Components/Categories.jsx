import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Categories = ({ className, selectedCategory, setSelectedCategory }) => {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // fetching categories list

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3001/categories");
        setCategories(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  
  // navigatting to selected category store

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    navigate({
      pathname: "/stores",
      search: `?cats=${categoryId}`,
    });
  };

  return (
    <div
      className={`${className}  max-h-screen overflow-y-auto rounded-scrollbar`}
    >
      <h2 className="text-xl mb-2 font-bold">Categories</h2>

      {loading ? (
        
        // Skeleton Loading UI

        <ul>
          {Array.from({ length: 5 }).map((_, index) => (
            <li
              key={index}
              className="w-full h-6 bg-gray-300 rounded-md animate-pulse my-2"
            ></li>
          ))}
        </ul>
      ) : error ? (
        <div className={`${className} my-[50px] text-red-500`}>
          Error: {error.message}
        </div>
      ) : (
        <ul className="max-md:h-[15vh] overflow-y-auto">
          {categories.map((category) => (
            <li
              key={category.id}
              className={`cursor-pointer p-2 hover:bg-slate-200 rounded-lg ${
                selectedCategory === category.id
                  ? "bg-slate-200 rounded-lg "
                  : "" // Highlighting selected category
              }`}
              onClick={() => handleCategorySelect(category.id)}
            >
              {category.name}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Categories;
