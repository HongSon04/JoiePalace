'use client';
import { Image } from "@chakra-ui/react";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function Fromfeedback() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const { slug } = useParams();

    const clickHome = () => {
        router.push('/');
    }

    useEffect(() => {
        switch (slug) {
            case 'xac-nhan-thanh-cong':
                setContent('Tài khoản của quý khách đã được nhận! Chúc quý khách có trải nghiệm vui vẻ Trân trọng cảm ơn');
                setTitle('Xác nhận thành công');
                break;
            case 'xac-nhan-that-bai':
                setContent('Tài khoản của quý khách chưa được nhận! Đường dẫn đã hết hạn');
                setTitle('Xác nhận thất bại');
                break;
            case 'thanh-toan-thanh-cong':
                setContent('Chúc mừng! Quý khách đã thanh toán cọc thành công! Tiệc của quý khách đang được nhân viên của chúng tôi lên kế hoạch và chuẩn bị. Cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ tại Joie Palace. Trân trọng!');
                setTitle('Thanh toán thành công');
                break;
            case 'thanh-toan-that-bai':
                setContent('Chưa thanh toán tiền cọc thành công Quý khách vui lòng thử lại sau');
                setTitle('Thanh toán thất bại');
                break;
            default:
                setContent('');
                setTitle('');
                break;
        }
    }, [slug]);

    return (
        <>
            <section className="flex px-[80px] max-md:px-[10px] max-sm:px-0">
                <div className="w-1/2 bg-black z-[2] max-md:hidden">
                    <Image className="h-full w-full object-cover" src="/meeting-6.png" alt="Meeting Image" />
                </div>
                <div className="w-1/2 max-md:w-full h-[97vh] bgfeedbackYellow max-md:after:left-[40px] flex flex-col justify-center items-center mt-[20px]">
                    <div className="w-8/12 max-md:w-10/12 flex flex-col gap-10 font-Montserrat">
                        <div className="bg-whiteAlpha-50 text-center p-8 space-y-6 z-20">
                            <h1 className="text-2xl font-bold text-yellow-200 font-beautique">{title}</h1>
                            <p className="text-sm text-yellow-100">
                                {content}
                            </p>
                            <Link href='/' className='underline text-gold text-xs font-medium cursor-pointer'>
                                Trang chủ
                            </Link>
                            <button className="flex w-full items-center justify-center bg-gold font-semibold py-2 px-6 rounded-full shadow-md text-white" onClick={clickHome}>
                                <span className="mr-2">
                                    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 3.19L15 7.69V15.5H13V9.5H7V15.5H5V7.69L10 3.19ZM10 0.5L0 9.5H3V17.5H9V11.5H11V17.5H17V9.5H20L10 0.5Z" fill="white" />
                                    </svg>
                                </span> Trang chủ
                            </button>

                            <nav className="flex justify-center space-x-8  text-yellow-200">
                                <Link href='/' className='underline text-gold text-xs font-medium cursor-pointer'>Trang chủ</Link>
                                <Link href='/client/nguoi-dung' className='underline text-gold text-xs font-medium cursor-pointer'>Tài Khoản</Link>
                                <Link href='/client/nguoi-dung/lich-su-tiec' className='underline text-gold text-xs font-medium cursor-pointer'>Tiệc của bạn</Link>
                                <Link href='/client/danh-gia-gop-y' className='underline text-gold text-xs font-medium cursor-pointer'>Đánh giá khác</Link>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );  
}

export default Fromfeedback;
