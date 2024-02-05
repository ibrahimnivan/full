"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

const SearchForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Search Term:", searchTerm);
    console.log("Selected Category:", selectedCategory);
  };

  return (
    <div className="bg-gray-500 py-8">
      <h2 className="text-center text-white font-semibold text-xl mb-3">Search Events</h2>
      <form onSubmit={handleSubmit} className="flex items-center justify-center ">
        <label className="mr-2">
          <select value={selectedCategory} onChange={handleCategoryChange} className="border p-2 bg-gray-400 bg-opacity-40 rounded h-10">
            <option value="">All Category</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            {/* Add more categories as needed */}
          </select>
        </label>

        <label className="mr-2">
          <select value={selectedCategory} onChange={handleCategoryChange} className="border p-2 bg-gray-400 bg-opacity-40 rounded h-10">
            <option value="">All Cities</option>
            <option value="technology">Technology</option>
            <option value="sports">Sports</option>
            <option value="entertainment">Entertainment</option>
            {/* Add more categories as needed */}
          </select>
        </label>

        <label className="mr-2">
          <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search" className="border p-2 bg-gray-400 placeholder-black bg-opacity-40 rounded h-10" />
        </label>
      </form>

     
    </div>
  );
};

export default SearchForm