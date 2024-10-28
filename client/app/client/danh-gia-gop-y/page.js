'use client';
import { Image } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import Footer from "@/app/_components/FooterClient";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from 'react';

const menuSliderSettings = {
    dots: false,
    slidesToShow: 3.04,
    slidesToScroll: 1,
    infinite: true,
    speed: 1500,
    // autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    responsive: [
        {
            breakpoint: 1400,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
            },
        },
        {
            breakpoint: 830,
            settings: {
                slidesToShow: 2.04,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};

function Feedback() {

    return (
        <section>
            <section className="md:min-h-screen bg-image-tintuc flex flex-col justify-center max-md:h-[415px]">
                <div className="">
                    <h1 className="text-[80px] text-center font-bold mb-10 font-gilroy max-sm:text-xl ">Tin Tức Mới Nhất</h1>
                    <p className="text-center text-base max-sm:text-[13px]">Chúng tôi luôn sẵn lòng đón nhận mọi sự góp ý  từ quý khách. <br />
                        Đó sẽ là động lực giúp Joie Palace phát triển và nâng cao <br /> chất lượng dịch vụ</p>
                </div>
            </section>
            <section className="w-9/12 m-auto mt-[70px] max-lg:mt-[40px]">
                <div className="uppercase text-4xl text-center font-bold max-lg:text-2xl">Các bài đánh giá gần đây</div>
                <div className="mt-[60px] max-lg:mt-[10px]">
                    <Slider {...menuSliderSettings}>
                        <div className="max-lg:p-2 max-xl:p-1">
                            <div className="w-[346px] h-[236px] max-lg:w-[100%] max-xl:w-[100%] rounded-2xl bg-whiteAlpha-200 p-3 text-gold font-gilroy m-auto">
                                <div className="flex">
                                    <div className="h-[32px] w-[32px] mt-2">
                                        <Image className="rounded-full" src="/meeting-5.png" alt="" />
                                    </div>
                                    <div className="ml-9 max-xl:ml-4 leading-9 max-md:leading-8 max-xl:leading-6">
                                        <div className="font-bold text-[24px] max-md:text-[18px] max-lg:text-[18px] max-sm:text-[21px] ">Christian Bell</div>
                                        <div className="max-lg:text-[10px] max-md:text-[14px]"><span>11:57</span> <span>22/12/2022</span></div>
                                    </div>
                                </div>
                                <div className="leading-6 mt-4 max-md:mt-3 max-xl:mt-3 text-base max-xl:leading-5  text-justify">
                                    Thực đơn: Đồ ăn ngon, phong phú, phù hợp với nhiều khẩu vị. Khách mời của mình đều khen ngợi về món ăn.
                                    Giá cả: Hợp lý so với chất lượng dịch vụ và không gian đẹp.
                                </div>
                            </div>
                        </div>
                        <div className="max-lg:p-2 max-xl:p-1">
                            <div className="w-[346px] h-[236px] max-lg:w-[100%] max-xl:w-[100%] rounded-2xl bg-whiteAlpha-200 p-3 text-gold font-gilroy m-auto">
                                <div className="flex">
                                    <div className="h-[32px] w-[32px] mt-2">
                                        <Image className="rounded-full" src="/meeting-5.png" alt="" />
                                    </div>
                                    <div className="ml-9 max-xl:ml-4 max-xl:leading-6">
                                        <div className="font-bold text-[24px] max-md:text-[18px] max-lg:text-[18px] max-sm:text-[21px]">Christian Bell</div>
                                        <div className="max-lg:text-[10px]"><span>11:57</span> <span>22/12/2022</span></div>
                                    </div>
                                </div>
                                <div className="leading-6 mt-4 max-md:mt-3 text-base max-xl:leading-5 text-justify">
                                    Thực đơn: Đồ ăn ngon, phong phú, phù hợp với nhiều khẩu vị. Khách mời của mình đều khen ngợi về món ăn.
                                    Giá cả: Hợp lý so với chất lượng dịch vụ và không gian đẹp.
                                </div>
                            </div>
                        </div>
                        <div className="max-lg:p-2 max-xl:p-1">
                            <div className="w-[346px] h-[236px] max-lg:w-[100%] max-xl:w-[100%] rounded-2xl bg-whiteAlpha-200 p-3 text-gold font-gilroy m-auto">
                                <div className="flex">
                                    <div className="h-[32px] w-[32px] mt-2">
                                        <Image className="rounded-full" src="/meeting-5.png" alt="" />
                                    </div>
                                    <div className="ml-9 max-xl:ml-4 leading-9 max-xl:leading-6 max-md:leading-9">
                                        <div className="font-bold text-[24px] max-md:text-[18px] max-lg:text-[18px] max-sm:text-[21px]">Christian Bell</div>
                                        <div className="max-lg:text-[13px]"><span>11:57</span> <span>22/12/2022</span></div>
                                    </div>
                                </div>
                                <div className="leading-6 mt-4 max-md:mt-3 text-base max-xl:leading-5 text-justify">
                                    Thực đơn: Đồ ăn ngon, phong phú, phù hợp với nhiều khẩu vị. Khách mời của mình đều khen ngợi về món ăn.
                                    Giá cả: Hợp lý so với chất lượng dịch vụ và không gian đẹp.
                                </div>
                            </div>
                        </div>
                    </Slider>
                </div>
            </section>
            <section className="m-auto mt-[70px] max-lg:mt-[10px]">
                <div className="uppercase text-4xl max-lg:text-2xl text-center font-bold">những khách hàng khác
                    <br /> nói gì về chúng tôi</div>
                <div className="mt-[60px] max-lg:mt-[10px]">
                    <div className="flex max-sm:flex-col max-sm:items-center  w-7/12 h-[388px] max-2md:h-2/6 rounded-2xl bg-gold p-[16px] m-auto" >
                        <div className="mr-[10px] max-sm:mb-1">
                            <div className="h-[64px] w-[64px]">
                                <Image className="rounded-full" src="/meeting-5.png" alt="" />
                            </div>
                        </div>
                        <div className="">
                            <div className="text-[20px] max-xl:text-[18px] max-lg:text-[16px] max-sm:text-[13px] font-beautique text-justify">
                                “Không gian: Rộng rãi, sang trọng, trang trí tinh tế, tạo cảm giác ấm cúng và lãng mạn cho ngày trọng đại của mình.
                            </div>
                            <div className="mt-[30px] text-[20px] max-xl:text-[18px] max-lg:text-[16px] max-sm:text-[13px] font-gilroy font-light text-justify">
                                Mình thực sự hài lòng với chất lượng dịch vụ, từ không gian đến các món ăn, sự chu đáo và sang trọng. Đây có lẽ là trải nghiệm hài lòng nhất của mình từ trước đến giờ, chắc chắc mình sẽ giới thiệu cho người quen của mình nếu họ có nhu cầu. Cảm ơn Joie Palace rất nhiều vì đã mang lại cho ngày trọng đại của mình một kỷ niệm trọn vẹn!
                            </div>
                            <div className="mt-[30px]">
                                <div><span>11:57</span> <span>22/12/2022</span></div>
                                <div className="font-bold text-[24px] mt-[10px] max-lg:text-[16px] max-md:text-[14px]">Christian Bell</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </section>
    );
}
export default Feedback;