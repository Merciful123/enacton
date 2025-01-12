// Categories.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Categories = ({ className, selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category

  const navigate = useNavigate();


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

  if (loading) {
    return (
      <div className={`${className} my-[50px]`}>Loading categories...</div>
    );
  }

  if (error) {
    return (
      <div className={`${className} my-[50px]`}>Error: {error.message}</div>
    );
  }

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // This is where we will trigger filtering in the AllStores component
    navigate({
      pathname: "/stores", // Or wherever the stores page is
      search: `?cats=${categoryId}`, // Append category to the URL as a query parameter
    });
  };

  console.log(selectedCategory);
  return (
    <div className={`${className} my-[10px] `}>
      <h2 className="text-xl mb-4 font-bold">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`cursor-pointer p-2 ${
              selectedCategory === category.id ? "bg-slate-200 rounded-lg" : "" // Highlight selected category
            }`}
            onClick={() => handleCategorySelect(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
