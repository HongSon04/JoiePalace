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
          
        </section>


     
      <section>
        <Footer />
      </section>
    </div>
  );
};

export default Page;
