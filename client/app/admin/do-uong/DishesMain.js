"use client";

import { beverageCategories } from "@/app/_utils/config";
import DishesSection from "./DishesSection";

function DishesMain() {
  return (
    <div className="w-full mt-8">
      {beverageCategories.map((category, index) => (
        <DishesSection key={index} dishesType={category.label} />
      ))}
    </div>
  );
}

export default DishesMain;
