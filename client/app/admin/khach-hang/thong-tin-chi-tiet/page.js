import AdminHeader from '@/app/_components/AdminHeader';
import React from 'react';
import { PiMedalLight } from "react-icons/pi";
const page = () => {
    return (
        <main className='grid gap-6 p-4 '>
            <AdminHeader
                title="Khách hàng"
                showSearchForm = {false}
            ></AdminHeader>
            <div className="flex justify-start items-center gap-2 text-base ">
                <p>Khách hàng</p>
                <p>/</p>
                <p>Thông tin chi tiết</p>
            </div>
            <div className='flex justify-between gap-[30px]'> 
                <div className='w-[25%] h-[345px] p-5 bg-whiteAlpha-100 rounded-lg grid gap-[22px]'>
                    <div className='flex gap-3 items-center'>
                        <img className="rounded-full w-[90px]" src="/image/user.jpg" />
                        <div>
                            <p className='text-xs mb-3'>Hạng thành viên</p>
                            <div className="flex gap-3 items-center text-xs ">
                                <img  src="/image/Group.svg" />
                                <p>Đồng</p>
                            </div>
                        </div>
                    </div>
                    <div className='grid gap-[10px] w-full'>
                        <div className='p-3 bg-whiteAlpha-50 rounded-lg'>
                            <p>Tên</p>
                        </div>
                        <div className='p-3  bg-whiteAlpha-50 rounded-lg'>
                            <p>Email</p>
                        </div>
                        <div className='p-3  bg-whiteAlpha-50 rounded-lg'>
                            <p>Số điện thoại</p>
                        </div>
                    </div>
                </div>
                <div className='w-[75%] rounded-lg bg-whiteAlpha-100 '>
                    <div className='w-full grid gap-[20px] p-4'>
                        <p className='text-lg font-bold'>Tiệc đã hoàn thành</p>
                        <div className="overflow-x-auto overflow-y-auto max-h-[325px] max-w-[800px] ">
                            <table className="table table-chinhanh rounded-lg">
                                <thead>
                                    <tr>
                                        <th>Mã tiệc</th>
                                        <th>Chủ tiệc</th>
                                        <th>Loại tiệc</th>
                                        <th>Ngày đặt</th>
                                        <th>Tổng giá trị</th>
                                        <th>Tiền cọc</th>
                                        <th>Ngày đặt cọc</th>
                                        <th>Còn lại phải thanh toán</th>
                                        <th>Ngày tổ chức</th>
                                        <th>Giờ tổ chức</th>
                                        <th>Ngày thanh toán</th>
                                        <th>Tình trạng thanh toán</th>
                                        <th>Số lượng khách dự kiến</th>
                                        <th>Số lượng bàn (chính thức + dự phòng)</th>
                                        <th>Chi nhánh</th>
                                        <th>Sảnh</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                
                                </tbody>
                            </table>
                        </div>
                        <p className='text-lg font-bold'>Tiệc dự kiến diễn ra</p>
                        <div className="overflow-x-auto overflow-y-auto max-h-[325px] max-w-[800px] ">
                            <table className="table table-chinhanh rounded-lg">
                                <thead>
                                    <tr>
                                        <th>Mã tiệc</th>
                                        <th>Chủ tiệc</th>
                                        <th>Loại tiệc</th>
                                        <th>Ngày đặt</th>
                                        <th>Tổng giá trị</th>
                                        <th>Tiền cọc</th>
                                        <th>Ngày đặt cọc</th>
                                        <th>Còn lại phải thanh toán</th>
                                        <th>Ngày tổ chức</th>
                                        <th>Giờ tổ chức</th>
                                        <th>Ngày thanh toán</th>
                                        <th>Tình trạng thanh toán</th>
                                        <th>Số lượng khách dự kiến</th>
                                        <th>Số lượng bàn (chính thức + dự phòng)</th>
                                        <th>Chi nhánh</th>
                                        <th>Sảnh</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                    <tr>
                                        <td>#12DKAF</td>
                                        <td>Nguyễn Văn A</td>
                                        <td>Tiệc cưới</td>
                                        <td>22/12/2024</td>
                                        <td>200.000.000VND</td>
                                        <td>60.000.000 VND</td>
                                        <td>24/12/2024</td>
                                        <td>140.000.000 VND</td>
                                        <td>1/1/2025</td>
                                        <td>18:00</td>
                                        <td>1/1/2025</td>
                                        <td><li className="status da-dat-coc">Đã đặt cọc</li></td>
                                        <td>300</td>
                                        <td>50 + 2</td>
                                        <td>Phạm Văn Đồng</td>
                                        <td>Hall A</td>
                                        <td><p className="text-teal-400 text-xs font-bold">Chi tiết</p></td>
                                    </tr>
                                
                                </tbody>
                            </table>
                        </div>
                        
                    </div>
                </div>
            </div>
        </main>
    );
};

export default page;