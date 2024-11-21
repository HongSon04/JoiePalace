"use client";

import useRoleGuard from "@/app/_hooks/useRoleGuard";
import { fetchCategories } from "@/app/_services/productsServices";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DishesSection from "./DishesSection";

function DishesMain() {
  const { isLoading } = useRoleGuard();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);

  const { categories } = useSelector((store) => store.categories);

  useEffect(() => {
    const fetchProductsOrCategoryDishes = async () => {
      try {
        const categoriesData = await fetchCategories();
        const dataCategory = categoriesData.data;
        setDataCategory(dataCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductsOrCategoryDishes();
  }, [dispatch, categories, selectedCategory]);
  const handleCategoryChange = (e) => {
    const selectedId = parseInt(e.target.value, 10);

    const selectedCategory = dataCategory.find(
      (category) => category.id === selectedId
    );

    if (selectedCategory) {
      setSelectedCategory(selectedCategory);
    } else {
      console.error("Invalid category selected");
    }
  };

  return (
    <div className="w-full mt-8">
      {!categories && (
        <div className="flex flex-col gap-3 justify-center items-center">
          <button
            className="text-gray-400 underline"
            onClick={() => dispatch(fetchCategories())}
          ></button>
        </div>
      )}

      {/* Dropdown for selecting category */}
      <div className="mb-4">
        <select
          className="select"
          onChange={handleCategoryChange}
          value={selectedCategory?.id || ""}
        >
          {dataCategory && dataCategory.length > 0
            ? dataCategory.map((category) => (
                <option
                  className="option"
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))
            : null}
        </select>
      </div>

      <div className="mt-6">
        {selectedCategory && (
          <DishesSection
            key={selectedCategory.id}
            dishCategory={selectedCategory}
            categories={dataCategory}
          />
        )}
      </div>
    </div>
  );
}

export default DishesMain;
