"use cient";
import React from "react";

const CategoriesTab = () => {
  return (
    <div className="w-full min-h-[100vh] mt-12 flex flex-col gap-[30px]">
      <div className="w-full flex justify-end">
        <button className="bg-whiteAlpha-100 px-3 py-2 rounded-full flex items-center text-white">
          + Thêm danh mục
        </button>
      </div>
      <div className="w-full min-h-[500px]">
        <table class="table-auto border-collapse border border-gray-300 w-full text-center text-white">
          <thead>
            <tr class="bg-whiteAlpha-100">
              <th class="border border-[#5B5B5B] px-4 py-2">ID</th>
              <th class="border border-[#5B5B5B] px-4 py-2">Tên danh mục</th>
              <th class="border border-[#5B5B5B] px-4 py-2">Số bài viết</th>
              <th class="border border-[#5B5B5B] px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-whiteAlpha-50">
              <td class="border border-[#5B5B5B] px-4 py-2">Dữ liệu 1</td>
              <td class="border border-[#5B5B5B] px-4 py-2">Dữ liệu 2</td>
              <td class="border border-[#5B5B5B] px-4 py-2">Dữ liệu 3</td>
              <td class="border border-[#5B5B5B] px-4 py-2 text-cyan-400 cursor-pointer">Dữ liệu 4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTab;
