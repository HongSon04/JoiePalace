"use client";

import { FiPlus } from "react-icons/fi";
import Footer from "@/app/_components/FooterClient";
import Image from "next/image";
import {
    Button,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
  
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Tooltip,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
  } from "@chakra-ui/react";

  const categories = [
        {
            id: "1",
            name: "Nước tinh khiết",
        },
        {
            id: "2",
            name: "Nước ngọt",
        },
        {
            id: "3",
            name: "Trà",
        },
        { 
            id: "4",
            name: "Bia",
        }
  ]
const Page = () => {
  return (
    <div className="w-full min-h-screen flex flex-col" id="main-contact">
        <section
            className="section w-full h-screen flex px-8 lg:px-24 2xl:px-44 pt-24 pb-9 gap-10"
            id="section-information"
            style={{
                backgroundImage: "url('/images-client/banners/banner-do-uong.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat', 
                height: '700px', 
        
            }}
        >
            <div className="flex flex-col items-center gap-6 justify-center w-full h-full">
                <h1 className="text-gold text-center text-4xl sm:text-6xl sm:leading-[80px] font-medium font-sans leading-none text-shadow-lg 2md:w-4/6">
                    ĐỒ UỐNG
                </h1>
                <h4 className="text-white text-center font-size[20px] font-normal line-height[24px]">Chào mừng đến với thiên đường ẩm thực Joie Palace,<br></br> nơi nâng niu vị giác của quý khách </h4>
            </div>
        </section>
         
        <section className="px-48 py-16 relative !font-gilroy">
            <Tabs variant={"unstyled"} position={"relative"} align="center">
                <TabList className="p-2 rounded-full bg-whiteAlpha-100 w-fit items-center gap-3">
                    {categories.map((category) => (
                    <Tab
                        key={category.id}
                        color={"white"}
                        className="aria-[selected=true]:text-white aria-[selected=true]:opacity-100 aria-[selected=true]:bg-gold bg-transparent opacity-45 transition flex items-center gap-2 uppercase font-semibold flex-center text-center rounded-full py-2 px-6 leading-8"
                    >
                        {category.name}
                    </Tab>
                    ))}
                   
                   
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <div className="grid grid-cols-2 gap-12 mt-[40px]">
                            <div className="flex justify-center">
                                <div className="flex gap-4 items-center">
                                    <h1 className="text-4xl font-bold">1.</h1>
                                    <Image
                                        src="/chai-pepsi.png" 
                                        alt="Mô tả ảnh"               
                                        width={114}                  
                                        height={180}              
                                    />
                                    <div className="text-start flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-2xl font-bold">
                                                PEPSI CHAI 1.5 LÍT
                                            </p>
                                            <p className="text-2xl font-normal">
                                                200.000 VND / Thùng
                                            </p>
                                            <p className="text-2xl text-base font-normal">
                                                Nước ngọt
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between text-start">
                                            <p className="text-base text-gold font-[400] underline">Xem thêm</p>
                                            <button className="w-[40px] h-[40px] bg-gold flex justify-center items-center rounded-full">
                                                <FiPlus className="text-xl"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex gap-4 items-center">
                                    <h1 className="text-4xl font-bold">1.</h1>
                                    <Image
                                        src="/chai-pepsi.png" 
                                        alt="Mô tả ảnh"               
                                        width={114}                  
                                        height={180}              
                                    />
                                    <div className="text-start flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-2xl font-bold">
                                                PEPSI CHAI 1.5 LÍT
                                            </p>
                                            <p className="text-2xl font-normal">
                                                200.000 VND / Thùng
                                            </p>
                                            <p className="text-2xl text-base font-normal">
                                                Nước ngọt
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between text-start">
                                            <p className="text-base text-gold font-[400] underline">Xem thêm</p>
                                            <button className="w-[40px] h-[40px] bg-gold flex justify-center items-center rounded-full">
                                                <FiPlus className="text-xl"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex gap-4 items-center">
                                    <h1 className="text-4xl font-bold">1.</h1>
                                    <Image
                                        src="/chai-pepsi.png" 
                                        alt="Mô tả ảnh"               
                                        width={114}                  
                                        height={180}              
                                    />
                                    <div className="text-start flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-2xl font-bold">
                                                PEPSI CHAI 1.5 LÍT
                                            </p>
                                            <p className="text-2xl font-normal">
                                                200.000 VND / Thùng
                                            </p>
                                            <p className="text-2xl text-base font-normal">
                                                Nước ngọt
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between text-start">
                                            <p className="text-base text-gold font-[400] underline">Xem thêm</p>
                                            <button className="w-[40px] h-[40px] bg-gold flex justify-center items-center rounded-full">
                                                <FiPlus className="text-xl"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex gap-4 items-center">
                                    <h1 className="text-4xl font-bold">1.</h1>
                                    <Image
                                        src="/chai-pepsi.png" 
                                        alt="Mô tả ảnh"               
                                        width={114}                  
                                        height={180}              
                                    />
                                    <div className="text-start flex flex-col gap-6">
                                        <div className="flex flex-col gap-4">
                                            <p className="text-2xl font-bold">
                                                PEPSI CHAI 1.5 LÍT
                                            </p>
                                            <p className="text-2xl font-normal">
                                                200.000 VND / Thùng
                                            </p>
                                            <p className="text-2xl text-base font-normal">
                                                Nước ngọt
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between text-start">
                                            <p className="text-base text-gold font-[400] underline">Xem thêm</p>
                                            <button className="w-[40px] h-[40px] bg-gold flex justify-center items-center rounded-full">
                                                <FiPlus className="text-xl"/>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </TabPanel>
                    <TabPanel>
                    <p>two!</p>
                    </TabPanel>
                    <TabPanel>
                    <p>three!</p>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </section>


     
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default Page;
