"use client";

import Error from "@/app/_components/Error";
import useApiServices from "@/app/_hooks/useApiServices";
import useRoleGuard from "@/app/_hooks/useRoleGuard";
import {
  fetchParentCategory,
  fetchingCategories,
  fetchingCategoriesFailure,
  fetchingCategoriesSuccess,
} from "@/app/_lib/features/categories/categoriesSlice";
import {
  fetchingCategoryDishes,
  fetchingCategoryDishesSuccess,
} from "@/app/_lib/features/dishes/dishesSlice";
import { API_CONFIG, makeAuthorizedRequest } from "@/app/_utils/api.config";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import DishesSection from "./DishesSection";
import DishesTable from "./DishesTable";
import { fetchCategories } from "@/app/_services/productsServices";


function DishesMain() {
  const { isLoading } = useRoleGuard();
  const dispatch = useDispatch();

  const [selectedCategory, setSelectedCategory] = useState([]);
  const [dataCategory, setDataCategory] = useState([]);

  const {
    categories
  } = useSelector((store) => store.categories);

  
  
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
  }, [dispatch, categories,selectedCategory]);
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
            onClick={() =>
              dispatch(
                fetchCategories()
              )
            }
          >
          </button>
        </div>
      )}

      {/* Dropdown for selecting category */}
      <div className="mb-4">
        <select className="select" onChange={handleCategoryChange} value={selectedCategory?.id || ""}>
          {dataCategory && dataCategory.length > 0 ? (
            dataCategory.map((category) => (
              <option className="option" key={category.id} value={category.id}>
                {category.name}
              </option>
            ))
          ) : null}
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
