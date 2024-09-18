"use client";

import DishesSection from "./DishesSection";

function DishesMain() {
  const dishesType = ["Khai Vị", "Món chính", "Món tráng miệng"];

  return (
    <div className="w-full mt-8">
      {dishesType.map((type, index) => (
        <DishesSection key={index} dishesType={type} />
      ))}
    </div>
  );
}

export default DishesMain;
