'use client';
import { Image } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import TextFade from "@/app/_components/TextFade";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Fromfeedback() {
    const router = useRouter();
    const clickHome = () => {
        router.push('/');
    }

    return (
        <>
            <section className="flex px-[80px] max-md:px-[10px] max-sm:px-0">

                <div className="w-1/2 bg-black z-[2] max-md:hidden">
                    <Image className="h-full w-full object-cover" src="/meeting-6.png" alt="My Image" />
                </div>
                <div className=" w-1/2 max-md:w-full h-[97vh] bgfeedbackYellow max-md:after:left-[40px] flex flex-col justify-center items-center mt-[20px]">
                    <div className="w-8/12 max-md:w-10/12 flex flex-col gap-10 font-Montserrat">
                        <div class="bg-whiteAlpha-50 text-center p-8 space-y-6 z-20">
                            <h1 class="text-2xl font-bold text-yellow-200 font-beautique">Trân trọng cảm ơn quý khách</h1>
                            <p class="text-sm text-yellow-100">
                                Nhân viên tư vấn - chăm sóc khách hàng của Joie Palace sẽ liên hệ với quý khách sớm nhất trong vòng 24h tới, quý khách vui lòng chú ý điện thoại. Trân trọng cảm ơn!
                            </p>
                            <button class="flex w-full items-center justify-center bg-gold  font-semibold py-2 px-6 rounded-full shadow-md text-white "
                            onClick={clickHome}
                            >
                                <span class="mr-2"><svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3.19L15 7.69V15.5H13V9.5H7V15.5H5V7.69L10 3.19ZM10 0.5L0 9.5H3V17.5H9V11.5H11V17.5H17V9.5H20L10 0.5Z" fill="white" />
                                </svg>
                                </span> Trang chủ
                            </button>
                            <nav class="flex justify-center space-x-8 mt-6 text-yellow-200">
                                <Link href={'/'} className='underline text-gold text-xs font-medium cursor-pointer'>
                                    Trang chủ
                                </Link>
                                <Link href={'/client/nguoi-dung'} className='underline text-gold text-xs font-medium cursor-pointer'>
                                    Tài Khoản
                                </Link>
                                <Link href={'/client/nguoi-dung/lich-su-tiec'} className='underline text-gold text-xs font-medium cursor-pointer'>
                                    Tiệc của bạn
                                </Link>
                                <Link href={'/client/danh-gia-gop-y'} className='underline text-gold text-xs font-medium cursor-pointer'>
                                    Đánh giá khác
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </>

    );
}
export default Fromfeedback;