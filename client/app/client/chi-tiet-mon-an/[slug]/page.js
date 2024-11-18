"use client";
import Footer from "@/app/_components/FooterClient";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import SliderMenuDish from "@/app/_components/SliderMenuDish";
import Logokhaivi from '@/public/Logokhaivi.svg';
import { useParams } from "next/navigation";
import React,{ useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";
import { getProductBySlug } from "@/app/_services/productsServices";
import { fetchCategoriesById } from '@/app/_services/productsServices';
import AddToMenuButton from "@/app/_components/AddToMenuButton";
import { getMenuListByUserId } from "@/app/_lib/features/menu/menuSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoriesBySlug } from "@/app/_lib/features/categories/categoriesSlice";
import { API_CONFIG } from "@/app/_utils/api.config";

function Conference() {
    const { slug } = useParams();
    const [detailDish, setDetailDish] = useState(null);
    const [loading, setLoading] = useState(true);
    const [productsByCategoryId, setProductsByCategoryId] = useState(true);
    const [userMenuList, setUserMenuList] = useState([]);
    const [isAdded, setIsAdded] = useState(false);
    const dispatch = useDispatch();
    const [isLogedIn, setIsLogedIn] = React.useState(false);
    const { menuList } = useSelector((store) => store.menu);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataDishById = await getProductBySlug(slug);
                const datafetchCategoriesById = await fetchCategoriesById(dataDishById[0]?.category_id);
                const productsByCategoryId = (datafetchCategoriesById.data[0].products);
                if (productsByCategoryId) {
                    const dataMainCourse = productsByCategoryId.map((dish) => ({
                        id: dish.id,
                        name: dish.name,
                        price: `${dish.price.toLocaleString()} VND / 10 người`,
                        description: dish.description,
                        image: dish.images,
                        link: `/client/chi-tiet-mon-an/${dish.slug}`,
                    }));
                    setProductsByCategoryId(dataMainCourse);
                }
                setDetailDish(dataDishById[0]);
            } catch (error) {
                console.error("Error fetching menu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);
    React.useEffect(() => {
        const fetchData = async () => {
            if (typeof window !== "undefined") {
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser) {
                    setIsLogedIn(true);
                    try {
                        const result = await dispatch(
                            getMenuListByUserId({
                                params: { user_id: storedUser.id, is_show: false },
                            })
                        ).unwrap();

                        if (result.success) {
                            console.log("success result -> ", result);
                        } else {
                            console.log("failure result -> ", result);
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            }
        };

        fetchData();
        dispatch(fetchCategoriesBySlug({ slug: API_CONFIG.FOOD_CATEGORY_SLUG }));

        return () => { };
    }, []);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner size="xl" color="white" />
            </div>
        );
    }
    if (!detailDish) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-xl text-white text-center">
                <Image
                    className="object-cover w-[300px] rounded-full"
                    src={`/cloche.png`}
                    alt=''
                />
                Hiện tại chưa có món ăn bạn muốn tìm.
            </div>

        );
    }
    const handleUpdateMenu = (newDish) => {
        if (!userMenuList.some((dish) => dish.id === newDish.id)) {
            setUserMenuList((prevList) => [...prevList, newDish]);
            setIsAdded(true);
        }
    };

    return (
        <div className="m-auto h-full" id="fullpage">
            <div className="pt-24">
                <section className="flex flex-col md:flex-row w-3/5 max-xl:w-4/5 max-2md:w-[95%] mx-auto relative">
                    <div className="w-full md:w-1/2 p-4">
                        {detailDish ? (
                            <>
                                <h1 className="text-4xl leading-[68px] text-left text-gold uppercase mb-5 max-2md:text-2xl ">
                                    {detailDish.name}
                                </h1>
                                <p className="font-normal text-base leading-6 text-left font-inter text-gold mb-5 max-2md:text-sm">
                                    {(detailDish.price || 0).toLocaleString()} / 10 VND
                                </p>
                                <p className="font-gilroy text-base leading-6 mb-5 max-2md:text-sm text-justify">
                                    {detailDish.description || "Gỏi củ hủ dừa tôm thịt là một món ăn đặc sắc..."}
                                </p>
                                <AddToMenuButton
                                    dish={detailDish}
                                    userMenuList={menuList}
                                    handleUpdateMenu={handleUpdateMenu}
                                    addable={!isAdded}
                                    tooltipClassName="tooltip-custom"
                                    isAdded={isAdded}
                                    usePopover={true}
                                />
                            </>
                        ) : (
                            <p className="text-xl text-red-500 text-center">
                                Hiện tại chưa có món ăn bạn muốn tìm.
                            </p>
                        )}
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center ">
                        <div className="w-full relative top-[40px] left-[100px]">
                            <div className="flex justify-center items-center h-[300px] w-[600px] rounded-[50%] border border-gold ">
                                <div className="flex justify-center items-center h-[300px] w-[600px] rounded-[50%] border border-gold -rotate-[10deg]">
                                    <div className="flex justify-center h-[300px] w-[300px] items-center max-2md:w-[150px] max-2md:h-[150px]">
                                        <Image
                                            className="object-cover rotate-[10deg] rounded-full"
                                            src={detailDish?.images[0] || `/cloche.png`}
                                            alt=''
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <div className="section mt-[100px]">
                <SliderMenuDish dataSlider={productsByCategoryId} title={'Các món khác'} logo={Logokhaivi} idDish={'menuKhaiVi'} />
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Conference;