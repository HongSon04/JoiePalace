import { Image } from "@chakra-ui/react";
import Link from "next/link";
import Footer from "@/app/_components/FooterClient";

const news = [
    {
        id: 1,
        name: "hoàng văn thụ",
        img: "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg",
        descriptoin: "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU",
    },
    {
        id: 2,
        name: "hoàng văn thụ",
        img: "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg",
        descriptoin: "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU",
    },
    {
        id: 2,
        name: "hoàng văn thụ",
        img: "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg",
        descriptoin: "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU",
    },
]


function News() {


    return (
        <div className="">
            <section className="md:min-h-screen bg-image-tintuc flex flex-col justify-center max-md:h-[415px]">
                <div className="">
                    <h1 className="text-5xl text-center font-bold mb-10 font-gilroy max-sm:text-xl ">Tin Tức Mới Nhất</h1>
                    <div>
                        <div className="select-none flex justify-center gap-4">
                            <div className="div-children-banner cursor-pointer relative w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="absolute bottom-[20px]  z-20 w-full">
                                    <p className="w-[90%] font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl max-sm:left-0 m-auto">WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU</p>
                                </div>
                            </div>
                            <div className="div-children-banner cursor-pointer relative w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="absolute bottom-[20px]  z-20 w-full">
                                    <p className="w-[90%] font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl max-sm:left-0 m-auto">WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU</p>
                                </div>
                            </div>
                            <div className="div-children-banner cursor-pointer relative w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="absolute bottom-[20px]  z-20 w-full">
                                    <p className="w-[90%] font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl max-sm:left-0 m-auto">WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="min-h-screen w-fit m-auto">
                <div className="grid grid-cols-3 m-auto mt-20">
                    <div className="flex flex-col justify-start items-center px-6">
                        <div className=" w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                            <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <p className="max-md:text-base max-sm:text-[5px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
                            </p>
                        </div>
                        <div className=" w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                            <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <p className="max-md:text-base max-sm:text-[5px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-center border-l border-r pt-20">
                        <div className=" w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                            <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <p className="max-md:text-base max-sm:text-[5px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
                            </p>
                        </div>
                        <div className=" w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                            <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <p className="max-md:text-base max-sm:text-[5px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-center">
                        <div className=" w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                            <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <p className="max-md:text-base max-sm:text-[5px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
                            </p>
                        </div>
                        <div className=" w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                            <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70 ">
                                <Link href=''>
                                    <Image
                                        src="https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <p className="max-md:text-base max-sm:text-[5px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
                            </p>
                        </div>
                    </div>
                </div>
                <>
                    {/* Pagination */}
                    <nav className="flex items-center ml-4 mt-2 " aria-label="Pagination">
                        <button
                            type="button"
                            className="bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm  border mr-1"
                            aria-label="Previous"
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
                        <button
                            type="button"
                            className="bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] flex justify-center items-center mr-1 focus:bg-gold focus:text-white"
                        >
                            1
                        </button>
                        <button
                            type="button"
                            className="bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] flex justify-center items-center border mr-1"
                        >
                            2
                        </button>
                        <button
                            type="button"
                            className="bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] flex justify-center items-center border mr-1"
                        >
                            3
                        </button>
                        <button
                            type="button"
                            className="bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] flex justify-center items-center border mr-1"
                        >
                            8
                        </button>
                        <button
                            type="button"
                            className="bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm   mr-1"
                            aria-label="Next"
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