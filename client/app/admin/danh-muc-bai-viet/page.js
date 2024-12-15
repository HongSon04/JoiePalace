"use client";
import React from "react";
import AdminHeader from "@/app/_components/AdminHeader";
import CategoriesBlogBreadCrumbs from "./CategoriesBlogBreadCrumbs";
import CategoriesTab from "./CategoriesTab";

const BlogCategories = () => {
  return (
    <div className="relative">
      <AdminHeader title="Danh mục bài viết" />
      <CategoriesBlogBreadCrumbs />
      <CategoriesTab />
    </div>
  );
};
export default BlogCategories;
