'use client';
import { Image } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import TextFade from "@/app/_components/TextFade";
import InputIndex from "@/app/_components/InputIndexClient";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import { useState } from "react";
import { useParams } from "next/navigation";

function Fromfeedback() {
    const { id_brand, id_booking } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState('');
    const [selectedFeedbackNumber, setSelectedFeedbackNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const clickFeedback = (value) => {
        switch (value) {
            case 'Rất hài lòng':
                setSelectedFeedback('Rất hài lòng'); 
                setSelectedFeedbackNumber(0); 
                break;
            case 'Hài lòng':
                setSelectedFeedback('Hài lòng'); 
                setSelectedFeedbackNumber(1)
                break;
            case 'Bình thường':
                setSelectedFeedback('Bình thường');
                setSelectedFeedbackNumber(2)
                break;
            case 'Chưa ổn':
                setSelectedFeedback('Chưa ổn'); 
                setSelectedFeedbackNumber(3)
                break;
            case 'Không hài lòng':
                setSelectedFeedback('Không hài lòng'); 
                setSelectedFeedbackNumber(4)
                break;
            default:
                break;
        }

        setIsOpen(false);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra nếu các trường bắt buộc bị để trống
        if (!name || !selectedFeedback || !comment) {
            if(!comment){
                
            }
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        const feedbackData = {
            branch_id: id_brand,
            booking_id: id_booking,
            name,
            email,
            feedback: selectedFeedbackNumber,
            comment,
        };
        console.log(feedbackData);

        setError('');
    };
    return (
        <section className="flex px-[80px] max-md:px-[10px] max-sm:px-0">
            <div className="w-1/2 h-screen bg-black z-[2] max-md:hidden">
                <Image className="h-full w-full object-cover" src="/meeting-6.png" alt="My Image" />
            </div>
            <div className="w-1/2 max-md:w-full h-screen bgfeedbackYellow max-md:after:left-[40px] flex flex-col justify-center items-center mt-[20px]">
                <div className="w-8/12 max-md:w-10/12 flex flex-col gap-10 ">
                    <div className="z-10">
                        <h1 className="uppercase text-gold font-bold text-5xl leading-[100%] font-beautique max-sm:text-3xl ">
                            Đánh giá góp ý
                        </h1>
                        <p className="max-sm:text-xs ">Joie Palace sẽ luôn luôn tiếp thu ý kiến đóng góp từ khách hàng và mang đến những trải nghiệm ngày càng cao cấp hơn</p>
                    </div>
                    <form
                        className="w-full h-auto flex flex-col gap-5 z-10 pb-10 "
                        id="form-information"
                        onSubmit={handleSubmit}
                    >
                        <InputIndex
                            type="text"
                            placeholder="Họ và tên*"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <InputIndex
                            type="email"
                            placeholder="Email*"
                            value={'admin1@gmail.com'}
                            onChange={(e) => setEmail(e.target.value)}
                            readOnly
                        />
                        <div className="relative">
                            <InputIndex
                                type="text"
                                name="feedback"
                                id="optionFeedback"
                                placeholder="Bạn cảm thấy thế nào về buổi tiệc *"
                                value={selectedFeedback}
                                onClick={() => setIsOpen(!isOpen)}
                                readOnly
                                className="border-b-[1px] pb-2 w-full"
                            />
                            {isOpen && (
                                <div className="bg-gold absolute w-full">
                                    <div className="p-[12px] cursor-pointer" onClick={() => clickFeedback('Rất hài lòng')}>
                                        <div className="border-b-[1px] pb-2">Rất hài lòng</div>
                                    </div>
                                    <div className="p-[12px] cursor-pointer" onClick={() => clickFeedback('Hài lòng')}>
                                        <div className="border-b-[1px] pb-2">Hài lòng</div>
                                    </div>
                                    <div className="p-[12px] cursor-pointer" onClick={() => clickFeedback('Bình thường')}>
                                        <div className="border-b-[1px] pb-2">Bình thường</div>
                                    </div>
                                    <div className="p-[12px] cursor-pointer" onClick={() => clickFeedback('Chưa ổn')}>
                                        <div className="border-b-[1px] pb-2">Chưa ổn</div>
                                    </div>
                                    <div className="p-[12px] cursor-pointer" onClick={() => clickFeedback('Không hài lòng')}>
                                        <div className="border-b-[1px] pb-2">Không hài lòng</div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <InputIndex
                            type="text"
                            placeholder="Đánh giá góp ý*"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            styles="overflow-hidden"
                        />
                        <div className="w-full flex justify-end">
                            <ButtonDiscover name={"Gửi"} className={"w-auto px-6"} />
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
export default Fromfeedback;