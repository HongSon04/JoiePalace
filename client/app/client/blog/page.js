"use client";

import { Image } from "@chakra-ui/react";
import Link from "next/link";

const contentBanner = [
    {
        id: 1,
        title: 'MÀN CHÀO SÂN ĐẦY MẠNH MẼ VÀ ẤN TƯỢNG CỦA SUZUKI XL7 HYBRID',
        banner: 'cwe.jpg',
        descriptions1: 'SUZUKI XL7 HYBRID - Dòng xe đậm chất thể thao đa dụng với hàng loạt cải tiến nổi bật đã chính thức chào sân người yêu xe Việt Nam trong buổi họp báo tổ chức tại JOIE PALACE Phạm Văn Đồng vừa qua',
        descriptions2: "XL7 Hybrid – Mẫu xe Suzuki đậm chất SUV (xe thể thao đa dụng) đã có màn chào sân đầy ấn tượng tại sảnh Hall B - JOIE PALACE Phạm Văn Đồng. Vinh dự được đồng hành cùng Suzuki trong buổi họp báo hoành tráng này, JOIE PALACE Phạm Văn Đồng đã góp phần tạo nên thành công cho sự kiện với: Sảnh hội nghị Hall B sang trọng, được bố trí theo kiểu lớp học (Classroom), tạo điều kiện cho khách mời có thể vừa chiêm ngưỡng màn ra mắt, vừa ghi chép thông tin quan trọng Hệ thống thang máy tải trọng lớn có khả năng đưa ô tô vào tận sảnh, mang đến màn chào sân ấn tượng của 03 chiếc XL7 Hybrid tại sân khấu chính Khu vực đón khách rộng rãi cùng menu teabreak tinh tế, tiếp thêm năng lượng hứng khởi cho hoạt động networking Hệ thống âm thanh và ánh sáng hiện đại tạo nên trải nghiệm ấn tượng  Dịch vụ hội nghị tận tâm với đội ngũ nhân viên giàu kinh nghiệm",
        descriptions3: 'Buổi họp báo đã khẳng định vị thế vững chắc của Suzuki tại thị trường Việt Nam hiện nay...',
        arrayImage1: ['wdc.jpg', 'tee.jpg', 'ipk7.jpg'],
        arrayImage2: ['dwcwe.jpg', 'sxw.jpg', 'wqq.jpg'],
        arrayImage3: ['wqq (1).jpg', 'rvke.jpg'],
    }
];

const Blog = () => {
    return (
        <>
            <section className="h-[80vh] bg-cover relative">
                <div className="absolute w-full">
                    <div className="relative top-[250px] min-h-[100px] w-4/6 m-auto max-xl:w-5/6">
                        <div className="w-[550px] max-sm:w-full">
                            <h1 className="text-4xl uppercase max-sm:text-xl">{contentBanner[0].title}</h1>
                            <p className="text-xl max-sm:text-base">{contentBanner[0].descriptions1}</p>
                        </div>
                    </div>
                </div>
                <Image
                    src={`/${contentBanner[0].banner}`}
                    alt=""
                    className="w-full h-full object-cover"
                />
            </section>

            <section className="min-h-screen w-4/6 m-auto pt-[72px] max-xl:w-5/6 ">
                <p className="text-base text-center py-[10px]  max-sm:text-base">{contentBanner[0].descriptions2}</p>
                <div className="">
                    {contentBanner[0].arrayImage1.map((image, index) => (
                        <Image
                            key={index}
                            src={`/${image}`}
                            alt={`image-${index}`}
                            className="w-fit m-auto h-full object-cover py-[10px]"
                        />
                    ))}
                </div>
                <p className="text-base text-center py-[10px]  max-sm:text-base">{contentBanner[0].descriptions3}</p>
                <div className="">
                    {contentBanner[0].arrayImage2.map((image, index) => (
                        <Image
                            key={index}
                            src={`/${image}`}
                            alt={`image-${index}`}
                            className="w-full h-full object-cover py-[10px]"
                        />
                    ))}
                </div>
            </section>
            <section className="min-h-screen w-fit m-auto">
                <div>
                    <h2 className="before:block before:absolute before:-left-full before:bottom-0 before:bg-gold before:h-1 relative before:w-full ml-[50px] text-4xl text-gold max-sm:text-xl">Xem thêm</h2>
                </div>
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
                            <p className="max-md:text-base max-sm:text-[10px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                                JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
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
                            <p className="max-md:text-base max-sm:text-[10px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                                JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
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
                            <p className="max-md:text-base max-sm:text-[10px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                                JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
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
                            <p className="max-md:text-base max-sm:text-[10px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                                JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
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
                            <p className="max-md:text-base max-sm:text-[10px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                                JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
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
                            <p className="max-md:text-base max-sm:text-[10px] ">Tin Tức Mới Nhất \ 26 Tháng Tám 2024</p>
                            <p className="font-bold max-lg:text-lg max-sm:text-[13px]  text-xl m-auto">
                                JOIE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU
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
                            4
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
        </>
    );
};

export default Blog;
