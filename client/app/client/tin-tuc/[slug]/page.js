"use client";

import { Image } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fetchBlogDataById, fecthAllBlog } from "@/app/_services/blogServices";
import { useEffect, useState } from "react";
const data = [
    {
        "id": 1,
        "category_id": 1,
        "title": "test",
        "slug": "test",
        "description": "description",
        "short_description": "short_description",
        "content": "content",
        "images": [
            "http://res.cloudinary.com/dlpvcsewd/image/upload/v1730018423/joiepalace/blogs/fmua8fbbjedchqv0ojzf.jpg"
        ],
        "views": 2,
        "created_at": "2024-10-27T08:40:14.373Z",
        "updated_at": "2024-10-28T15:33:38.488Z",
        "tags": [
            {
                "id": 1,
                "name": "test1",
                "slug": "test1",
                "created_at": "2024-10-24T09:11:45.130Z",
                "updated_at": "2024-10-24T09:11:45.130Z"
            },
            {
                "id": 2,
                "name": "test21",
                "slug": "test21",
                "created_at": "2024-10-24T09:11:49.692Z",
                "updated_at": "2024-10-24T09:11:49.692Z"
            },
            {
                "id": 3,
                "name": "test213",
                "slug": "test213",
                "created_at": "2024-10-24T09:11:51.556Z",
                "updated_at": "2024-10-24T09:11:51.556Z"
            }
        ],
        "categories": {
            "id": 1,
            "category_id": null,
            "name": "Nước uống",
            "slug": "nuoc-uong",
            "description": "Đồ uống giải khát",
            "short_description": "Đồ uống giải khát",
            "images": [],
            "deleted": false,
            "deleted_at": null,
            "deleted_by": null,
            "created_by": null,
            "updated_by": null,
            "created_at": "2024-10-24T08:11:33.736Z",
            "updated_at": "2024-10-24T08:11:33.736Z"
        }
    },
    {
        "id": 2,
        "category_id": 1,
        "title": "test2",
        "slug": "test2",
        "description": "description",
        "short_description": "short_description",
        "content": "content",
        "images": [
            "http://res.cloudinary.com/dlpvcsewd/image/upload/v1730018635/joiepalace/blogs/gophdvdsqjokdazb4cvk.jpg"
        ],
        "views": 1,
        "created_at": "2024-10-27T08:43:55.538Z",
        "updated_at": "2024-10-28T15:32:08.188Z",
        "tags": [
            {
                "id": 1,
                "name": "test1",
                "slug": "test1",
                "created_at": "2024-10-24T09:11:45.130Z",
                "updated_at": "2024-10-24T09:11:45.130Z"
            },
            {
                "id": 2,
                "name": "test21",
                "slug": "test21",
                "created_at": "2024-10-24T09:11:49.692Z",
                "updated_at": "2024-10-24T09:11:49.692Z"
            },
            {
                "id": 3,
                "name": "test213",
                "slug": "test213",
                "created_at": "2024-10-24T09:11:51.556Z",
                "updated_at": "2024-10-24T09:11:51.556Z"
            }
        ],
        "categories": {
            "id": 1,
            "category_id": null,
            "name": "Nước uống",
            "slug": "nuoc-uong",
            "description": "Đồ uống giải khát",
            "short_description": "Đồ uống giải khát",
            "images": [],
            "deleted": false,
            "deleted_at": null,
            "deleted_by": null,
            "created_by": null,
            "updated_by": null,
            "created_at": "2024-10-24T08:11:33.736Z",
            "updated_at": "2024-10-24T08:11:33.736Z"
        }
    },
    {
        "id": 3,
        "category_id": 1,
        "title": "Đám Cưới Công Nghệ",
        "slug": "dam-cuoi-cong-nghe",
        "description": "Đám cưới công nghệ là xu hướng mới trong tổ chức lễ cưới, kết hợp giữa truyền thống và hiện đại.",
        "short_description": "Khám phá xu hướng đám cưới công nghệ.",
        "content": "Đám cưới công nghệ đang trở thành một xu hướng phổ biến trong những năm gần đây. Với sự phát triển của công nghệ, các cặp đôi có thể tổ chức lễ cưới của mình một cách độc đáo và sáng tạo hơn bao giờ hết. Từ việc sử dụng drone để quay phim, livestream lễ cưới đến việc tạo ra các trang web riêng cho đám cưới, công nghệ đã mang đến nhiều lựa chọn thú vị cho các cặp đôi. Ngoài ra, các ứng dụng di động cũng giúp khách mời dễ dàng theo dõi thông tin và tham gia vào các hoạt động trong ngày cưới.",
        "images": [
            "http://res.cloudinary.com/dlpvcsewd/image/upload/v1730018718/joiepalace/blogs/eqovyenkzz8q65vpmccs.png"
        ],
        "views": 7,
        "created_at": "2024-10-27T08:45:19.836Z",
        "updated_at": "2024-10-28T15:33:41.542Z",
        "tags": [
            {
                "id": 1,
                "name": "test1",
                "slug": "test1",
                "created_at": "2024-10-24T09:11:45.130Z",
                "updated_at": "2024-10-24T09:11:45.130Z"
            }
        ],
        "categories": {
            "id": 1,
            "category_id": null,
            "name": "Nước uống",
            "slug": "nuoc-uong",
            "description": "Đồ uống giải khát",
            "short_description": "Đồ uống giải khát",
            "images": [],
            "deleted": false,
            "deleted_at": null,
            "deleted_by": null,
            "created_by": null,
            "updated_by": null,
            "created_at": "2024-10-24T08:11:33.736Z",
            "updated_at": "2024-10-24T08:11:33.736Z"
        }
    }
]

// const contentBanner = [
//     {
//         id: 1,
//         title: 'MÀN CHÀO SÂN ĐẦY MẠNH MẼ VÀ ẤN TƯỢNG CỦA SUZUKI XL7 HYBRID',
//         banner: 'cwe.jpg',
//         descriptions1: 'SUZUKI XL7 HYBRID - Dòng xe đậm chất thể thao đa dụng với hàng loạt cải tiến nổi bật đã chính thức chào sân người yêu xe Việt Nam trong buổi họp báo tổ chức tại White Palace Phạm Văn Đồng vừa qua',
//         descriptions2: "XL7 Hybrid – Mẫu xe Suzuki đậm chất SUV (xe thể thao đa dụng) đã có màn chào sân đầy ấn tượng tại sảnh Hall B - White Palace Phạm Văn Đồng. Vinh dự được đồng hành cùng Suzuki trong buổi họp báo hoành tráng này, White Palace Phạm Văn Đồng đã góp phần tạo nên thành công cho sự kiện với: Sảnh hội nghị Hall B sang trọng, được bố trí theo kiểu lớp học (Classroom), tạo điều kiện cho khách mời có thể vừa chiêm ngưỡng màn ra mắt, vừa ghi chép thông tin quan trọng Hệ thống thang máy tải trọng lớn có khả năng đưa ô tô vào tận sảnh, mang đến màn chào sân ấn tượng của 03 chiếc XL7 Hybrid tại sân khấu chính Khu vực đón khách rộng rãi cùng menu teabreak tinh tế, tiếp thêm năng lượng hứng khởi cho hoạt động networking Hệ thống âm thanh và ánh sáng hiện đại tạo nên trải nghiệm ấn tượng  Dịch vụ hội nghị tận tâm với đội ngũ nhân viên giàu kinh nghiệm",
//         descriptions3: 'Buổi họp báo đã khẳng định vị thế vững chắc của Suzuki tại thị trường Việt Nam hiện nay...',
//         arrayImage1: ['wdc.jpg', 'tee.jpg', 'ipk7.jpg'],
//         arrayImage2: ['dwcwe.jpg', 'sxw.jpg', 'wqq.jpg'],
//         arrayImage3: ['wqq (1).jpg', 'rvke.jpg'],
//     }
// ];

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
            // const BlogDataSlug = await fetchBlogDataById(slug);
            const blogDataSlug = await data.filter(item => item.slug == slug);
            setBlog(blogDataSlug[0]);
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
            arrayImage1: blog.images,
            arrayImage2: [],
            arrayImage3: []
        }
    ] : [];
    // xem them
    useEffect(() => {
        const fetchData = async () => {
            const DataBlog = await fecthAllBlog();
            const newBlog = DataBlog.reverse().filter(blog => blog.slug !== slug);
            const new3Blog = DataBlog.reverse().slice(0, 3);
            setNew3Blog(new3Blog)
            setCountNumberPage(Math.ceil(DataBlog.length / 6))
            setNewBlog(newBlog);
            pagination(newBlog, numberpage);
        };
        fetchData();
    }, []);

    useEffect(() => {
        pagination(newBlog, numberpage);
    }, [newBlog, numberpage]);

    const pagination = (data, currentPage) => {
        const itemsPerPage = 2;

        const startIndex = (currentPage - 1) * itemsPerPage * 3;

        // Split data into parts
        const parentDiv1 = data.slice(startIndex, startIndex + itemsPerPage);
        const parentDiv2 = data.slice(startIndex + itemsPerPage, startIndex + itemsPerPage * 2);
        const parentDiv3 = data.slice(startIndex + itemsPerPage * 2, startIndex + itemsPerPage * 3);

        setparentDiv1(parentDiv1);
        setparentDiv2(parentDiv2);
        setparentDiv3(parentDiv3);
    };
    const handleNextPage = () => {
        if (numberpage < countNumberPage) {
            setNumberPage(prev => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (numberpage > 1) {
            setNumberPage(prev => prev - 1);
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
                paginationItems.push('...');
                paginationItems.push(totalPages);
            } else if (currentPage > totalPages - 4) {
                paginationItems.push(1);
                paginationItems.push('...');
                for (let i = totalPages - 6; i <= totalPages; i++) {
                    paginationItems.push(i);
                }
            } else {
                paginationItems.push(1);
                paginationItems.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    paginationItems.push(i);
                }
                paginationItems.push('...');
                paginationItems.push(totalPages);
            }
        }

        return paginationItems;
    };

    function formatDate(dateString) {
        const date = new Date(dateString);

        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day} Tháng ${month} ${year}`;
    }

    return (
        <>
            <section className="h-[80vh] bg-cover relative">
                <div className="absolute w-full">
                    <div className="relative top-[250px] min-h-[100px] w-4/6 m-auto max-xl:w-5/6">
                        <div className="w-[550px] max-sm:w-full">
                            <h1 className="text-4xl uppercase max-sm:text-xl">{contentBanner[0]?.title}</h1>
                            <p className="text-xl max-sm:text-base">{contentBanner[0]?.descriptions1}</p>
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
                <p className="text-base text-center py-[10px]  max-sm:text-base">{contentBanner[0]?.descriptions2}</p>
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
                <p className="text-base text-center py-[10px]  max-sm:text-base">{contentBanner[0]?.descriptions3}</p>
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
                    <h2 className="before:block before:absolute before:-left-full before:bottom-0 before:bg-gold before:h-1 relative before:w-full ml-[50px] text-4xl text-gold max-sm:text-xl">Xem thêm</h2>
                </div>
                <div className="grid grid-cols-3 m-auto mt-20">
                    <div className="flex flex-col justify-start items-center px-6">
                    {parentDiv1.map((blog, index) => (
                            <Link className="hover:text-white" href={`${blog.slug}`}>
                                <div key={index} className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                                    <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                                        <Image
                                            src={blog.images || "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"}
                                            alt={blog.title || ""}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>
                                    <p className="max-md:text-base max-sm:text-[5px] ">
                                        Tin Tức Mới Nhất \ {formatDate(blog.created_at) || "2024-06-20"}
                                    </p>
                                    <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                        {blog.title || "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col justify-between items-center border-l border-r pt-20">
                    {parentDiv2.map((blog, index) => (
                            <Link className="hover:text-white" href={`${blog.slug}`}>
                                <div key={index} className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                                    <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                                        <Image
                                            src={blog.images || "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"}
                                            alt={blog.title || ""}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>
                                    <p className="max-md:text-base max-sm:text-[5px] ">
                                        Tin Tức Mới Nhất \ {formatDate(blog.created_at) || "2024-06-20"}
                                    </p>
                                    <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                        {blog.title || "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex flex-col justify-start items-center">
                    {parentDiv3.map((blog, index) => (
                            <Link className="hover:text-white" href={`${blog.slug}`}>
                                <div key={index} className="w-[296px] max-lg:w-[200px] max-md:w-[150px] max-sm:w-[100px] leading-10 max-sm:leading-5 mb-20">
                                    <div className="div-children-banner cursor-pointer relative before:block before:absolute before:inset-0 before:bg-gradient-to-b before:from-[rgba(102,102,102,0.6)] before:to-[rgba(0,0,0,0.6)] inline-block before:opacity-70">
                                        <Image
                                            src={blog.images || "https://whitepalace.com.vn/wp-content/uploads/2024/06/JULIA-MORLEY-PHAM-KIM-DUNG-2-300x450.jpg"}
                                            alt={blog.title || ""}
                                            className="w-full h-full object-cover"
                                        />

                                    </div>
                                    <p className="max-md:text-base max-sm:text-[5px] ">
                                        Tin Tức Mới Nhất \ {formatDate(blog.created_at) || "2024-06-20"}
                                    </p>
                                    <p className="font-bold max-lg:text-lg max-sm:text-[10px] max-sm:leading-3 text-xl m-auto">
                                        {blog.title || "WHITE PALACE VÕ VĂN KIỆT VINH DỰ ĐÓN TIẾP  CHỦ TỊCH MISS WORLD TOÀN CẦU"}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <>
                    {/* Pagination */}
                    <nav className="flex items-center justify-start mt-4" aria-label="Pagination">
                        <button
                            onClick={handlePreviousPage}
                            disabled={numberpage === 1}
                            className={`bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${numberpage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    if (typeof item === 'number') {
                                        setNumberPage(item);
                                    }
                                }}
                                className={`min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${item === numberpage ? 'bg-gold text-white' : 'bg-white text-black hover:bg-gold hover:text-white'}`}
                                disabled={item === '...'}
                            >
                                {item}
                            </button>
                        ))}

                        <button
                            onClick={handleNextPage}
                            disabled={numberpage === countNumberPage}
                            className={`bg-white text-black hover:bg-gold hover:text-white min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center gap-x-1.5 text-sm border mr-1 ${numberpage === countNumberPage ? 'opacity-50 cursor-not-allowed' : ''}`}
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
