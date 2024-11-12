"use client";

import { Image } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchBlogDataBySlug, fecthAllBlog } from "@/app/_services/blogServices";
import { useEffect, useState } from "react";

const Blog = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  // xem them
  const [newBlog, setNewBlog] = useState([]);
  const [new3Blog, setNew3Blog] = useState([]);
  const [numberpage, setNumberPage] = useState(1);
  const [countNumberPage, setCountNumberPage] = useState(0);
  const [parentDiv1, setparentDiv1] = useState([]);
  const [parentDiv2, setparentDiv2] = useState([]);
  const [parentDiv3, setparentDiv3] = useState([]);

  useEffect(() => {
    const getBlog = async (slug) => {
      const blogDataSlug = await fetchBlogDataBySlug(slug);
      setBlog(blogDataSlug);
    };
    getBlog(slug);
  }, [slug]);
  const contentBanner = blog ? [
    {
      id: blog.id,
      title: blog.title,
      banner: blog.images[0],
      descriptions1: blog.short_description,
      descriptions2: blog.description,
      descriptions3: blog.content,
      arrayImage1 : blog.images.slice(0, 1),
      arrayImage2 : blog.images.slice(1, 3),
      arrayImage3 : blog.images.slice(3, 4),
    },
  ]
    : [];
  // xem them
  useEffect(() => {
    const fetchData = async () => {
      const DataBlog = await fecthAllBlog();
      const newBlog = DataBlog.reverse().filter((blog) => blog.slug !== slug);
      const new3Blog = DataBlog.reverse().slice(0, 3);
      setNew3Blog(new3Blog);
      setCountNumberPage(Math.ceil(DataBlog.length / 6));
      setNewBlog(newBlog);
      pagination(newBlog, numberpage);
    };
    fetchData();
  }, [numberpage, slug]);

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

  return (
    <>
      <section className="h-[80vh] bg-cover relative">
        <div className="absolute w-full">
          <div className="relative top-[250px] min-h-[100px] w-4/6 m-auto max-xl:w-5/6">
            <div className="w-[550px] max-sm:w-full">
              <h1 className="text-4xl uppercase max-sm:text-xl">
                {contentBanner[0]?.title}
              </h1>
              <p className="text-xl max-sm:text-base">
                {contentBanner[0]?.descriptions1}
              </p>
            </div>
          </div>
        </div>
        <Image
          src={`${contentBanner[0]?.banner}`}
          alt=""
          className="w-full h-full object-cover"
        />
      </section>

      <section className="min-h-screen w-4/6 m-auto pt-[72px] max-xl:w-5/6 ">
        <p className="text-base text-center py-[10px]  max-sm:text-base">
          {contentBanner[0]?.descriptions2}
        </p>
        <div className="">
          {contentBanner[0]?.arrayImage1.map((image, index) => (
            <Image
              key={index}
              src={`${image}`}
              alt={`image-${index}`}
              className="w-fit m-auto h-full object-cover py-[10px]"
            />
          ))}
        </div>
        <p className="text-base text-center py-[10px]  max-sm:text-base">
          {contentBanner[0]?.descriptions3}
        </p>
        <div className="">
          {contentBanner[0]?.arrayImage2.map((image, index) => (
            <Image
              key={index}
              src={`${image}`}
              alt={`image-${index}`}
              className="w-full h-full object-cover py-[10px]"
            />
          ))}
        </div>
      </section>
      <section className="min-h-screen w-fit m-auto">
        <div>
          <h2 className="before:block before:absolute before:-left-full before:bottom-0 before:bg-gold before:h-1 relative before:w-full ml-[50px] text-4xl text-gold max-sm:text-xl">
            Xem thêm
          </h2>
        </div>
        <div className="grid grid-cols-3 m-auto mt-20">
          <div className="flex flex-col justify-start items-center px-6">
            {parentDiv1.map((blog, index) => (
              <Link
                className="hover:text-white"
                href={`${blog.slug}`}
                key={index}
              >
                <div className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                  <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                    <Image
                      src={
                        blog.images ||
                        "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                      }
                      alt={blog.title || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="max-md:text-base max-sm:text-[5px] ">
                    Tin Tức Mới Nhất \{" "}
                    {formatDate(blog.created_at) || "2024-06-20"}
                  </p>
                  <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                    {blog.title ||
                      "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col justify-between items-center border-l border-r pt-20">
            {parentDiv2.map((blog, index) => (
              <Link
                className="hover:text-white"
                href={`${blog.slug}`}
                key={index}
              >
                <div className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                  <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                    <Image
                      src={
                        blog.images ||
                        "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                      }
                      alt={blog.title || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="max-md:text-base max-sm:text-[5px] ">
                    Tin Tức Mới Nhất \{" "}
                    {formatDate(blog.created_at) || "2024-06-20"}
                  </p>
                  <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                    {blog.title ||
                      "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex flex-col justify-start items-center">
            {parentDiv3.map((blog, index) => (
              <Link className="hover:text-white" href={`${blog.slug}`}>
                <div
                  key={index}
                  className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20"
                >
                  <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                    <Image
                      src={
                        blog.images ||
                        "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                      }
                      alt={blog.title || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="max-md:text-base max-sm:text-[5px] ">
                    Tin Tức Mới Nhất \{" "}
                    {formatDate(blog.created_at) || "2024-06-20"}
                  </p>
                  <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                    {blog.title ||
                      "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <>
          {/* Pagination */}
          <nav
            className="flex items-center justify-start mt-4"
            aria-label="Pagination"
          >
            <button
              onClick={handlePreviousPage}
              disabled={numberpage === 1}
              className={`bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${numberpage === 1 ? "opacity-50 cursor-not-allowed" : ""
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
                className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${item === numberpage
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
              className={`bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${numberpage === countNumberPage
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
    </>
  );
};

export default Blog;
