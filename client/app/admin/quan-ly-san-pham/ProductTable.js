"use client";

import { fetchProducts } from "@/app/_lib/products/productsSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading";
import { fetchParentCategory } from "@/app/_lib/features/categories/categoriesSlice";
import { TreeSelect } from "antd";

function ProductTable() {
  const dispatch = useDispatch();

  const {
    products,
    pagination,
    isFetchingProducts,
    isFetchingProductsError,
    error,
  } = useSelector((store) => store.products);
  const {
    categories,
    isFetchingParentCategory,
    isFetchingParentCategoryError,
  } = useSelector((store) => store.categories);

  const [category, setCategory] = React.useState(undefined);

  const onChangeCategory = (newCategory) => {
    setCategory(newCategory);
  };

  const onPopupScroll = (e) => {
    console.log("onPopupScroll", e);
  };

  const modifiedCategories = React.useMemo(() => {
    return categories.map((category) => {
      return {
        value: category.id,
        title: category.name,
        children: category.childrens.map((child) => {
          return {
            value: child.id,
            title: child.name,
          };
        }),
      };
    });
  }, [categories]);

  console.log(modifiedCategories);

  React.useEffect(() => {
    const fetchData = async () => {
      const params = {};

      const products = await dispatch(fetchProducts({ params })).unwrap();
      const categories = await dispatch(
        fetchParentCategory({
          params,
        })
      ).unwrap();
    };

    fetchData();

    return () => {};
  }, []);

  if (isFetchingProducts) {
    return <Loading />;
  } else {
    if (isFetchingProductsError) {
      console.log(error);
      return <div className="text-white">Error fetching products</div>;
    }
  }

  return (
    <div className="text-white mt-8">
      <div className="flex justify-between items-center">
        <label htmlFor="category text-gray-400">
          <TreeSelect
            showSearch
            style={{ width: "100%" }}
            value={category}
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            placeholder="Chọn danh mục"
            allowClear
            treeDefaultExpandAll
            onChange={onChangeCategory}
            treeData={modifiedCategories}
            onPopupScroll={onPopupScroll}
          />
        </label>
      </div>
    </div>
  );
}

export default ProductTable;
