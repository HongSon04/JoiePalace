'use client';
import { Image } from "@chakra-ui/react";
import dynamic from 'next/dynamic';
import TextFade from "@/app/_components/TextFade";
import InputIndex from "@/app/_components/InputIndexClient";
import ButtonDiscover from "@/app/_components/ButtonDiscover";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_CONFIG } from "@/app/_utils/api.config";
import useApiServices from "@/app/_hooks/useApiServices";
import { useRouter } from "next/navigation";

function Fromfeedback() {
    const { id_brand, id_booking } = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState('');
    const [selectedFeedbackNumber, setSelectedFeedbackNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [idUser, setIdUser] = useState('');
    const [comments, setComments] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    const { makeAuthorizedRequest } = useApiServices();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setEmail(user.email);
            setIdUser(user.id);
        }
    }, []);

    const clickFeedback = (value) => {
        switch (value) {
            case 'Rất hài lòng':
                setSelectedFeedback('Rất hài lòng');
                setSelectedFeedbackNumber(4);
                break;
            case 'Hài lòng':
                setSelectedFeedback('Hài lòng');
                setSelectedFeedbackNumber(3)
                break;
            case 'Bình thường':
                setSelectedFeedback('Bình thường');
                setSelectedFeedbackNumber(2)
                break;
            case 'Chưa ổn':
                setSelectedFeedback('Chưa ổn');
                setSelectedFeedbackNumber(1)
                break;
            case 'Không hài lòng':
                setSelectedFeedback('Không hài lòng');
                setSelectedFeedbackNumber(0)
                break;
            default:
                break;
        }

        setIsOpen(false);
    };
    const notification = (check, data) => {
        const notification = document.getElementById('notificationFeedBack');
        const textNotification = document.getElementById('textNotification');

        textNotification.innerText = data;

        if (check) {
            notification.classList.add('success');
        } else {
            notification.classList.add('error');
        }

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.remove('success');
            notification.classList.remove('error');
            router.push("/client/cam-on");
        }, 3000);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameInput = document.querySelector('#name');
        const feedbackInput = document.querySelector('#optionFeedback');
        const commentInput = document.querySelector('#comment');

        if (!name || !selectedFeedback || !comment) {
            if (!name) {
                nameInput.style.borderColor = 'red';
            } else {
                nameInput.style.borderColor = 'white';
            }
            if (!selectedFeedback) {
                feedbackInput.style.borderColor = 'red';
            } else {
                feedbackInput.style.borderColor = 'white';
            }
            if (!comment) {
                commentInput.style.borderColor = 'red';
            } else {
                commentInput.style.borderColor = 'white';
            }
            setError("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        } else {
            nameInput.style.borderColor = 'white';
            feedbackInput.style.borderColor = 'white';
            commentInput.style.borderColor = 'white';
        }

        const feedbackData = {
            branch_id: id_brand,
            booking_id: id_booking,
            user_id: idUser,
            name,
            rate: selectedFeedbackNumber,
            comments,
            is_show: true,
            is_approved: false
          };

        
        try {
            
            const response = await makeAuthorizedRequest(
                API_CONFIG.FEEDBACKS.CREATE,
                "POST",
                feedbackData
            )
            if (response?.success) {
                notification(true, 'Lời đánh giá & góp ý của quý khách đã được chúng tôi ghi nhận. Trân trọng cảm ơn!');
            } else {
                notification(false, 'Bạn hãy thử lại feedback cho chúng tôi một lần nữa!!!');
            }
        } catch (error) {
            notification(false, 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
        }

        setError('');
    };

    const closeNotifications = () => {
        const notification = document.getElementById('notificationFeedBack');
        notification.classList.remove('show');
    }
    return (
        <>
            <div className="rounded-md p-[10px] bg-gold h-min w-[409px] top-[100px] z-50 fixed right-[20px] notificationFeedback" id="notificationFeedBack">
                <div className="flex justify-between items-center">
                    <div className="mb-[12px]">
                        <div className="font-bold">Gửi Thành công</div>
                    </div>
                    <div className="cursor-pointer" onClick={closeNotifications}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3.88906L8.88906 0L10 1.11094L6.11094 5L10 8.88906L8.88906 10L5 6.11094L1.11094 10L0 8.88906L3.88906 5L0 1.11094L1.11094 0L5 3.88906Z" fill="white" fill-opacity="0.36" />
                        </svg>
                    </div>
                </div>
                <p id='textNotification'>
                    Nothing...
                </p>
            </div>
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
                                id="name"
                            />
                            <InputIndex
                                type="email"
                                placeholder="Email*"
                                value={email}
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
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                styles="overflow-hidden"
                                id="comment"
                            />
                            <div className="w-full flex justify-end">
                                <ButtonDiscover name={"Gửi"} className={"w-auto px-6"} />
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>

    );
}
export default Fromfeedback;