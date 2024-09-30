"use client";

import { dishCategories } from "@/app/_utils/config";
import DishesSection from "./DishesSection";

function DishesMain() {
  return (
    <div className="w-full mt-8">
      {dishCategories.map((category, index) => (
        <DishesSection key={index} dishCategory={category} />
      ))}
    </div>
  );
}

export default DishesMain;
