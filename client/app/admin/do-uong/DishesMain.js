"use client";

import DishesSection from "./DishesSection";

function DishesMain() {
  const dishesType = ["Nước suối", "Đồ uống có ga", "Đồ uống có cồn"];

  return (
    <div className="w-full mt-8">
      {dishesType.map((type, index) => (
        <DishesSection key={index} dishesType={type} />
      ))}
    </div>
  );
}

export default DishesMain;
