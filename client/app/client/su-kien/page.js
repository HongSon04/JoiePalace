"use client";
import { useEffect } from 'react';
import fullpage from 'fullpage.js';
import 'fullpage.js/dist/fullpage.css'; // Import fullpage.js CSS

function Event() {
    useEffect(() => {
        const fp = new fullpage('#fullpage', {
            autoScrolling: true,
            scrollHorizontally: true,
        });

        return () => {
            if (fullpage_api) {
                fullpage_api.destroy('all');
            }
        };
    }, []);

    return (
        <div className="lg:px-[25px] m-auto xl:max-w-screen-xl h-full" id="fullpage">
            <div className="section">
                <section className='flex h-screen justify-between items-start max-lg:pt-20'>
                    <div className="flex flex-col justify-center lg:h-screen z-10">
                        <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-1.png" alt="" />
                    </div>
                    <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2">
                        <h1 className="text-gold mb-10 font-bold content-event font-gilroy text-7xl max-lg:text-5xl max-sm:text-xl max-sm:mb-2">Sự kiện</h1>
                        <p className="flex-wrap text-white content-event text-base font-gilroy max-sm:text-[10px] max-sm:leading-3">
                            Với những giá trị riêng biệt trong thẩm mỹ kiến trúc và chất lượng dịch vụ, White Palace là không gian hoàn hảo để triển khai bất kì kế hoạch sự kiện nào mà bạn đang ấp ủ, từ các buổi yến tiệc mang dấu ấn cá nhân như tiệc thôi nôi, sinh nhật, tiệc cưới đến các chương trình nghệ thuật giải trí sáng tạo, các sự kiện trọng thể của doanh nghiệp như tiệc ra mắt sản phẩm, tiệc tri ân khách hàng, tiệc tất niên, triển lãm thương mại.
                        </p>
                    </div>
                    <div className="bgYellow w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:bottom-[100px] max-lg:pb-[80px] max-sm:pb-[50px]">
                        <div className="max-lg:mt-[80px]">
                            <div className="bg-gray-500 max-w-[60%] relative top-[20px] left-[20px] z-10">
                                <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-2.png" alt="" />
                            </div>
                            <div className="bg-gray-400 max-w-[60%] relative top-[-20px] left-[35%] z-20">
                                <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-3.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[50%] max-lg:hidden">
                        <div className="container_mouse ball relative top-[570px] ">
                            <span className="mouse-btn">
                                <span className="mouse-scroll"></span>
                            </span>
                        </div>
                    </div>
                </section>
            </div>
            <div className="section">
                <section className='flex h-screen justify-between items-start max-lg:pt-20 snap-start'>
                    <div className="flex flex-col justify-center lg:h-screen z-10">
                        <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-1.png" alt="" />
                    </div>
                    <div className="flex flex-col mx-5 z-30 w-[400px] md:h-screen lg:justify-center max-sm:mx-2">
                        <h1 className="text-gold mb-10 font-bold content-event font-gilroy text-7xl max-lg:text-5xl max-sm:text-xl max-sm:mb-2">Sự kiện</h1>
                        <p className="flex-wrap text-white content-event text-base font-gilroy max-sm:text-[10px] max-sm:leading-3">
                            Với những giá trị riêng biệt trong thẩm mỹ kiến trúc và chất lượng dịch vụ, White Palace là không gian hoàn hảo để triển khai bất kì kế hoạch sự kiện nào mà bạn đang ấp ủ, từ các buổi yến tiệc mang dấu ấn cá nhân như tiệc thôi nôi, sinh nhật, tiệc cưới đến các chương trình nghệ thuật giải trí sáng tạo, các sự kiện trọng thể của doanh nghiệp như tiệc ra mắt sản phẩm, tiệc tri ân khách hàng, tiệc tất niên, triển lãm thương mại.
                        </p>
                    </div>
                    <div className="bgYellow w-[350px] mb:w-[250px] relative flex flex-col md:justify-center lg:h-full max-lg:bottom-[100px] max-lg:pb-[80px] max-sm:pb-[50px]">
                        <div className="max-lg:mt-[80px]">
                            <div className="bg-gray-500 max-w-[60%] relative top-[20px] left-[20px] z-10">
                                <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-2.png" alt="" />
                            </div>
                            <div className="bg-gray-400 max-w-[60%] relative top-[-20px] left-[35%] z-20">
                                <img className="w-full h-full object-cover" src="https://whitepalace.com.vn/wp-content/uploads/2024/01/event-3.png" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-[50%] max-lg:hidden">
                        <div className="container_mouse ball relative top-[570px] ">
                            <span className="mouse-btn">
                                <span className="mouse-scroll"></span>
                            </span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Event;
