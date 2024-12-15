"use cient";
import Loading from "@/app/loading";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CategoriesTab = () => {
  const [categories, setCategories] = useState(null);
  const [blogs, setBlogs] = useState(null);
  useEffect(() => {
    const fecthData = async () => {
      const blogCategories = await axios.get("http://joieplace.live/api/categories/get/10");
      const blogs = await axios.get("http://joieplace.live/api/blogs/get-all");
      const listCategoriesBlog = blogCategories?.data?.data[0]?.childrens;
      const listBlogs = blogs?.data?.data;
      setBlogs(listBlogs)
      setCategories(listCategoriesBlog)
    }
    fecthData()
  }, []);
  if(!categories || !blogs) return <Loading/>
  console.log("categories", categories);
  console.log("blogs", blogs);
  
  const getNumberBlog = (category) => {
    let totalBlogCount = 0;
    blogs.filter((blog) => {
      if(blog.category_id == category) totalBlogCount++;
    })
    return totalBlogCount;
  }
  return (
    <div className="w-full min-h-[100vh] mt-12 flex flex-col gap-[30px]">
      <div className="w-full flex justify-end">
        <button className="bg-whiteAlpha-100 px-3 py-2 rounded-full flex items-center text-white">
          + Thêm danh mục
        </button>
      </div>
      <div className="w-full min-h-[500px]">
        <table className="table-auto border-collapse border border-gray-300 w-full text-center text-white">
          <thead>
            <tr className="bg-whiteAlpha-100">
              <th className="border border-[#5B5B5B] px-4 py-2">ID</th>
              <th className="border border-[#5B5B5B] px-4 py-2">Tên danh mục</th>
              <th className="border border-[#5B5B5B] px-4 py-2">Số bài viết</th>
              <th className="border border-[#5B5B5B] px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr className="bg-whiteAlpha-50">
                <td className="border border-[#5B5B5B] px-4 py-2 uppercase">{category.id}</td>
                <td className="border border-[#5B5B5B] px-4 py-2">{category.name}</td>
                <td className="border border-[#5B5B5B] px-4 py-2">{
                  getNumberBlog(category.id)
                }</td>
                <td className="border border-[#5B5B5B] px-4 py-2 text-cyan-400 cursor-pointer">Hành động</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTab;
