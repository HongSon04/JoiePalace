"use client";
import Footer from "@/app/_components/FooterClient";
import { Image } from "@chakra-ui/react";
import Link from "next/link";
import SliderMenuDish from "@/app/_components/SliderMenuDish";

import Logokhaivi from '@/public/Logokhaivi.svg';
import Unionmonchinh from '@/public/Unionmonchinh.svg';
import Uniontrangmieng from '@/public/Uniontrangmieng.svg';
import Unionnuocuong from '@/public/Unionnuocuong.svg';
import SliderMenuDrink from "@/app/_components/SliderMenuDrink";
import SliderComment from "@/app/_components/SliderComment";
import { useParams } from "next/navigation";
import { fetchMenuBySlug } from "@/app/_services/menuServices";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";



function Conference() {
    const { slug } = useParams();
    const [drinks, setDrinks] = useState();
    const [foods, setFoods] = useState();
    const [mainCourse, setMainCourse] = useState([]);
    const [appetizer, setAppetizer] = useState([]);
    const [dessert, setDessert] = useState([]);
    const [beverages, setBeverages] = useState([]);
    const { makeAuthorizedRequest } = useApiServices();
    const [listFeedback, setListFeedback] = useState([]);
    const [selectedFeedback, setSelectedFeedback] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const menuData = await fetchMenuBySlug(slug);
                const getProductsMenu = menuData[0].products;
                const getFoodsMenu = getProductsMenu["thuc-an"];
                const getDrinksMenu = getProductsMenu["nuoc-uong"];
                const mainCourse = getFoodsMenu.filter(i => i.categories.slug === 'thuc-an') || [];
                const appetizer = getFoodsMenu.filter(i => i.categories.slug === 'mon-khai-vi') || [];
                const dessert = getFoodsMenu.filter(i => i.categories.slug === 'mon-trang-mieng') || [];
                const beverages = getProductsMenu["nuoc-uong"] || [];
                setMainCourse(mainCourse);
                setAppetizer(appetizer);
                setDessert(dessert);
                setBeverages(beverages);
            } catch (error) {
                console.error("Error fetching menu:", error);
            }
        };
        fetchData();
    }, [slug]);

    useEffect(() => {
        const getFeedbacks = async () => {
            const data = await makeAuthorizedRequest(
                API_CONFIG.FEEDBACKS.GET_ALL_USER,
                'GET',
                '',
                null,
                '/client/dang-nhap'
            );

            if (data.success) {
                const feedbacksToShow = data.data.filter(feedback => feedback.is_show);
                setListFeedback(feedbacksToShow);
            } else {
                console.error("Error fetching feedbacks:", data);
                return [];
            }
        };
        getFeedbacks();
    }, []);

    const categoriesMenu = [
        {
            name: "Khai vị",
            countDishes: appetizer?.length || 0,
        },
        {
            name: "Món chính",
            countDishes: mainCourse?.length || 0,
        },
        {
            name: "Tráng miệng",
            countDishes: dessert?.length || 0,
        },
        {
            name: "Đồ uống",
            countDishes: beverages?.length || 0,
        },
    ];
    // const dataDishes = [{
    //     id: 1, name: "Gỏi Củ Hủ Dừa Tôm Thịt", price: "400.000 VND / 10 người", description: "Khai vị là một trong những món quyết định đến trải nghiệm của quý thực khách, chúng tôi mang đến một món ăn hoàn hảo để khởi động vị giác.", image: "dish1.png", link: "/explore-dish"
    // }, {
    //     id: 2, name: "Gỏi Củ Hủ Dừa Tôm Thịt", price: "400.000 VND / 10 người", description: "Khai vị là một trong những món quyết định đến trải nghiệm của quý thực khách, chúng tôi mang đến một món ăn hoàn hảo để khởi động vị giác.", image: "dish1.png", link: "/explore-dish"
    // }, {
    //     id: 3, name: "Gỏi Củ Hủ Dừa Tôm Thịt", price: "400.000 VND / 10 người", description: "Khai vị là một trong những món quyết định đến trải nghiệm của quý thực khách, chúng tôi mang đến một món ăn hoàn hảo để khởi động vị giác.", image: "dish1.png", link: "/explore-dish"
    // }]

    const dataMainCourse = mainCourse.map((dish) => ({
        id: dish.id,
        name: dish.name,
        price: `${dish.price.toLocaleString()} VND / 10 người`,
        description: dish.description,
        image: 'dish1.png',
        link: `/explore-dish/${dish.slug}`,
    }));
    const dataAppetizer = appetizer.map((dish) => ({
        id: dish.id,
        name: dish.name,
        price: `${dish.price.toLocaleString()} VND / 10 người`,
        description: dish.description,
        image: 'dish1.png',
        link: `/explore-dish/${dish.slug}`,
    }));
    const dataDessert = dessert.map((dish) => ({
        id: dish.id,
        name: dish.name,
        price: `${dish.price.toLocaleString()} VND / 10 người`,
        description: dish.description,
        image: 'dish1.png',
        link: `/explore-dish/${dish.slug}`,
    }));
    const dataDrink = beverages.map((dish) => ({
        id: dish.id,
        name: dish.name,
        price: `${dish.price.toLocaleString()} VND / 10 người`,
        description: dish.description,
        image: 'watter.png',
        link: `/explore-dish/${dish.slug}`,
    }));

    const calculateTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = Math.floor(seconds / 31536000);
    
        if (interval > 1) return `${interval} năm trước`;
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) return `${interval} tháng trước`;
        interval = Math.floor(seconds / 86400);
        if (interval > 1) return `${interval} ngày trước`;
        interval = Math.floor(seconds / 3600);
        if (interval > 1) return `${interval} giờ trước`;
        interval = Math.floor(seconds / 60);
        if (interval > 1) return `${interval} phút trước`;
        return `${seconds} giây trước`;
    };
    
    const rateFeedback = (value) => {
        switch (value) {
            case 4:
                return 'Rất hài lòng';
            case 3:
                return 'Hài lòng';
            case 2:
                return 'Bình thường';
            case 1:
                return 'Chưa ổn';
            case 0:
                return 'Không hài lòng';
            default:
                return 'Chưa đánh giá';
        }
    };
    
    const reviews = listFeedback.map((feedback) => {
        return {
            id: feedback.id,
            avatar: '/userImage.png',
            content: feedback.comments,
            satisfaction: rateFeedback(feedback.rate), 
            timeAgo: calculateTimeAgo(feedback.created_at),
            author: feedback.name
        };
    });
    
    // const dataDrink = [
    //     {
    //         id: 1,
    //         name: "PEPSI CHAI 1.5 LÍT",
    //         price: "200.000 VND / Thùng",
    //         description: "Nước ngọt",
    //         image: "watter.png",
    //         link: "/explore-dish"
    //     },
    //     {
    //         id: 2,
    //         name: "PEPSI CHAI 1.5 LÍT",
    //         price: "200.000 VND / Thùng",
    //         description: "Nước ngọt",
    //         image: "watter.png",
    //         link: "/explore-dish"

    //     },
    //     {
    //         id: 3,
    //         name: "PEPSI CHAI 1.5 LÍT",
    //         price: "200.000 VND / Thùng",
    //         description: "Nước ngọt",
    //         image: "watter.png",
    //         link: "/explore-dish"

    //     }
    // ]


    return (
        <div className="m-auto h-full" id="fullpage">
            <div className="section pt-[100px]">
                <section className="flex flex-col md:flex-row w-[60%]   max-xl:w-[80%] max-2md::w-[95%] m-auto affterSS2 after:h-[400px]">
                    <div className="w-full md:w-1/2 p-4">
                        <h1 className="text-4xl leading-[68px] text-left text-gold uppercase mb-5 max-2md:text-2xl">A LA CARTE MENU</h1>
                        <p className="font-normal text-base leading-6 text-left font-inter text-gold  mb-5 max-2md:text-[13px]">( 8 Món )</p>
                        <p className="font-gilroy text-base leading-6 text-left mb-5 max-2md:text-[13px]">
                            Trung tâm Sự kiện White Palace là địa điểm hoàn hảo để bạn có thể tổ chức cùng lúc hội nghị hàng ngàn khách mời, hội thảo chuyên đề và các buổi họp cấp cao. Tất cả đều có thể diễn ra cùng với dịch vụ hội nghị chuyên nghiệp, được phục vụ bởi hàng trăm nhân sự tại đây. Tùy vào mục đích và loại hình hội nghị mà bạn có thể lựa chọn cho mình hình thức bố trí và dịch vụ phù hợp.
                            Chúng tôi mang đến sự khác biệt với việc cung cấp
                            đa dạng các thực đơn phù hợp với nhu cầu của
                            khách hàng.
                        </p>
                        {categoriesMenu.map(i => (
                            <div className="flex items-end text-gold mb-5">
                                <div className="font-medium text-2xl leading-[40px] font-gilroy border-b-1 border-gold mr-8 max-2md:text-xl">{i.name}</div>
                                <p className="font-normal text-base leading-6 text-left font-inter max-2md:text-[13px]">( {i.countDishes} Món ) Loại</p>
                            </div>
                        ))}

                    </div>
                    <div className="w-1/2  max-sm:w-full flex justify-center">
                        <div className="w-[97%]">
                            <Image
                                className=" bg-white p-4 max-sm:p-2"
                                src="/Alacarte-Menu-Thumbnail.png"
                                alt="A la carte menu thumbnail"
                            />
                        </div>
                    </div>
                </section>
            </div>
            <div className="section">
                <SliderMenuDish dataSlider={dataAppetizer} title={'Khai vị'} logo={Logokhaivi}></SliderMenuDish>
                <SliderMenuDish dataSlider={dataMainCourse} title={'Món chính'} logo={Unionmonchinh}></SliderMenuDish>
                <SliderMenuDish dataSlider={dataDessert} title={'Tráng miệng'} logo={Uniontrangmieng}></SliderMenuDish>
                <SliderMenuDrink dataSlider={dataDrink} title={'Nước uống'} logo={Unionnuocuong}></SliderMenuDrink>
            </div>
            <div className="w-full">
                <SliderComment dataSlider={reviews} ></SliderComment>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default Conference;