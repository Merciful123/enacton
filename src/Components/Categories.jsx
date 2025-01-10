// Categories.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Categories = ({ className }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // Track the selected category

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

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    // This is where we will trigger filtering in the AllStores component
  };

  return (
    <div className={`${className} my-[50px]`}>
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category.id}
            className={`cursor-pointer p-2 ${
              selectedCategory === category.id ? "bg-gray-200" : "" // Highlight selected category
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
