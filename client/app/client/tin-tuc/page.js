"use client";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import Footer from "@/app/_components/FooterClient";
import { fecthAllBlog } from "@/app/_services/blogServices";
import { useEffect, useState } from "react";

function News() {
  const [newBlog, setNewBlog] = useState([]);
  const [new3Blog, setNew3Blog] = useState([]);
  const [numberpage, setNumberPage] = useState(1);
  const [countNumberPage, setCountNumberPage] = useState(0);
  const [parentDiv1, setparentDiv1] = useState([]);
  const [parentDiv2, setparentDiv2] = useState([]);
  const [parentDiv3, setparentDiv3] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const DataBlog = await fecthAllBlog();
      const datablogNew = DataBlog.reverse();
      const newBlog = DataBlog;
      const new3Blog = datablogNew.slice(0, 3);
      // console.log('new3Blog', new3Blog);

      setNew3Blog(new3Blog);
      setCountNumberPage(Math.ceil(DataBlog.length / 6));
      setNewBlog(newBlog);
      pagination(newBlog, numberpage);
      setLoading(false);
    };
    fetchData();
  }, [numberpage]);

  useEffect(() => {
    pagination(newBlog, numberpage);
  }, [newBlog, numberpage]);

  const pagination = (data, currentPage) => {
    const itemsPerPage = 2;

    const startIndex = (currentPage - 1) * itemsPerPage * 3;

    // Split data into parts
    const parentDiv1 = data.slice(startIndex, startIndex + itemsPerPage);
    const parentDiv2 = data.slice(
      startIndex + itemsPerPage,
      startIndex + itemsPerPage * 2
    );
    const parentDiv3 = data.slice(
      startIndex + itemsPerPage * 2,
      startIndex + itemsPerPage * 3
    );

    setparentDiv1(parentDiv1);
    setparentDiv2(parentDiv2);
    setparentDiv3(parentDiv3);
  };
  const handleNextPage = () => {
    if (numberpage < countNumberPage) {
      setNumberPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (numberpage > 1) {
      setNumberPage((prev) => prev - 1);
    }
  };

  const getPaginationItems = () => {
    const totalPages = countNumberPage;
    const currentPage = numberpage;
    const paginationItems = [];

    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(i);
      }
    } else {
      if (currentPage < 5) {
        for (let i = 1; i <= 7; i++) {
          paginationItems.push(i);
        }
        paginationItems.push("...");
        paginationItems.push(totalPages);
      } else if (currentPage > totalPages - 4) {
        paginationItems.push(1);
        paginationItems.push("...");
        for (let i = totalPages - 6; i <= totalPages; i++) {
          paginationItems.push(i);
        }
      } else {
        paginationItems.push(1);
        paginationItems.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          paginationItems.push(i);
        }
        paginationItems.push("...");
        paginationItems.push(totalPages);
      }
    }

    return paginationItems;
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${day} Tháng ${month} ${year}`;
  }
  const LazyLoading = () => {
    return<div
    role="status"
    className="max-w-[280px] p-2 border rounded shadow animate-pulse sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl md:p-4 dark:border-gray-700"
  >
    <div className="flex items-center justify-center h-20 sm:h-32 md:h-48 lg:h-56 mb-2 bg-gray-300 rounded dark:bg-gray-700">
      <svg
        className="w-5 h-5 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-200 dark:text-gray-600"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 20"
      >
        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
      </svg>
    </div>
    <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 w-20 sm:w-32 md:w-48 lg:w-56 mb-2" />
    <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2" />
    <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2" />
    <div className="h-1.5 bg-gray-200 rounded-full dark:bg-gray-700" />
  </div>
  
  }

  return (
    <div className="">
      <section className="md:min-h-screen bg-image-tintuc flex flex-col justify-center max-md:h-[415px]">
        <div className="">
          <h1 className="text-5xl text-center font-bold mb-10 font-gilroy max-sm:text-xl ">
            Tin Tức Mới Nhất
          </h1>
          <div>
            <div className="select-none flex justify-center gap-4">
              {loading ? (
                <>
                  <LazyLoading></LazyLoading>
                  <LazyLoading></LazyLoading>
                  <LazyLoading></LazyLoading>
                </>
              ) : (
                new3Blog.map((blog, index) => (
                  <Link
                    key={index}
                    className="hover:text-white"
                    href={`tin-tuc/${blog.slug}`}
                  >
                    <div className="div-children-banner cursor-pointer relative w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                      <Image
                        src={
                          (blog.images)[0] ||
                          "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                        }
                        alt={blog.title || ""}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-[20px] w-full">
                        <p className="w-[90%] font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl max-sm:left-0 m-auto">
                          {blog.title ||
                            "JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="min-h-screen w-fit m-auto">
        <div className="grid grid-cols-3 m-auto mt-20">
          <div className="flex flex-col justify-start items-center px-6">
            {loading ? (
              <>
                <LazyLoading></LazyLoading>
                <LazyLoading></LazyLoading>
              </>
            ) : (
              parentDiv1.map((blog, index) => (
                <Link
                  className="hover:text-white"
                  href={`tin-tuc/${blog.slug}`}
                  key={index}
                >
                  <div
                    key={index}
                    className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20"
                  >
                    <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                      <Image
                        src={
                          (blog.images)[0] ||
                          "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                        }
                        alt={blog.title || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="max-md:text-base max-sm:text-[10px] ">
                      Tin Tức Mới Nhất \{" "}
                      {formatDate(blog.created_at) || "2024-06-20"}
                    </p>
                    <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                      {blog.title ||
                        "JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                    </p>
                  </div>
                </Link>
              ))

            )}
          </div>
          <div className="flex flex-col justify-between items-center border-l border-r pt-20">
            {loading ? (
              <>
                <LazyLoading></LazyLoading>
                <LazyLoading></LazyLoading>
              </>
            ) : (
              parentDiv2.map((blog, index) => {
                // console.log(((blog.images)[0])[0]);

                return <Link
                  className="hover:text-white"
                  href={`tin-tuc/${blog.slug}`}
                  key={index}
                >
                  <div
                    key={index}
                    className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20"
                  >
                    <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                      <Image
                        src={
                          (blog.images)[0] ||
                          "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                        }
                        alt={blog.title || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="max-md:text-base max-sm:text-[10px] ">
                      Tin Tức Mới Nhất \{" "}
                      {formatDate(blog.created_at) || "2024-06-20"}
                    </p>
                    <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                      {blog.title ||
                        "JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                    </p>
                  </div>
                </Link>
              })

            )}
          </div>
          <div className="flex flex-col justify-start items-center">
            {loading ? (
              <>
                <LazyLoading></LazyLoading>
                <LazyLoading></LazyLoading>
              </>
            ) : (
              parentDiv3.map((blog, index) => (
                <Link
                  className="hover:text-white"
                  href={`tin-tuc/${blog.slug}`}
                  key={index}
                >
                  <div
                    key={index}
                    className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20"
                  >
                    <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                      <Image
                        src={
                          (blog.images)[0] ||
                          "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                        }
                        alt={blog.title || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="max-md:text-base max-sm:text-[10px] ">
                      Tin Tức Mới Nhất \{" "}
                      {formatDate(blog.created_at) || "2024-06-20"}
                    </p>
                    <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                      {blog.title ||
                        "JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                    </p>
                  </div>
                </Link>
              ))

            )}
          </div>
        </div>
        <>
          {/* Pagination */}
          <nav
            className="flex items-center justify-center mt-4"
            aria-label="Pagination"
          >
            <button
              onClick={handlePreviousPage}
              disabled={numberpage === 1}
              className={`bg-white rounded-md text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${numberpage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {getPaginationItems().map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (typeof item === "number") {
                    setNumberPage(item);
                  }
                }}
                className={`min-h-[38px] rounded-md min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${item === numberpage
                  ? "bg-gold text-white"
                  : "bg-white text-black hover:bg-gold hover:text-white"
                  }`}
                disabled={item === "..."}
              >
                {item}
              </button>
            ))}

            <button
              onClick={handleNextPage}
              disabled={numberpage === countNumberPage}
              className={`bg-white text-black rounded-md hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${numberpage === countNumberPage
                ? "opacity-50 cursor-not-allowed"
                : ""
                }`}
            >
              <svg
                className="shrink-0 size-3.5"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </nav>
        </>
      </section>
      <Footer />
    </div>
  );
}
export default News;
