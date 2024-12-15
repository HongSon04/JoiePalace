// import NextImage from "next/image";
// import pattern from "@/public/line-group.svg";
// import { Col, Row } from "antd";
// import React from "react";

// function HeroSection() {
//   React.useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [branches, partyTypes] = await Promise.all([
//           dispatch(getBranches({})).unwrap(),
//           dispatch(getPartyTypes({})).unwrap(),
//         ]);

//         // console.log("party types -> ", partyTypes);
//         // console.log("branches -> ", branches);

//         if (branches.success) {
//           // console.log("Fetch branches successfully");
//         }

//         if (partyTypes.success) {
//           // console.log("Fetch party types successfully");
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchData();

//     return () => {};
//   }, [dispatch]);

//   return (
//     <section className="px-48 pb-16 pt-36 relative !font-gilroy">
//       <NextImage
//         src={pattern}
//         alt="joie palace pattern"
//         className="absolute left-0 top-1/2 -translate-y-1/2"
//       />
//       <Row gutter={[20, 20]}>
//         <Col span={12}>
//           <h1 className="text-5xl text-gold font-gilroy font-semibold uppercase leading-normal">
//             CÔNG CỤ TẠO COMBO <br /> VÀ DỰ CHI
//           </h1>
//           <p className="text-base leading-normal mt-4">
//             Nắm bắt được tâm lý khách hàng, với tiêu chí “Tiện lợi- Nhanh gọn -
//             Rõ ràng”, Joie Palace giới thiệu bộ công cụ tạo tiệc và dự chi hoàn
//             toàn mới. Với mục tiêu mang đến cái nhìn tổng quát về những chi
//             tiết, những thành phần cần thiết để tạo nên một bữa tiệc đang nhớ và
//             thành công, chúng tôi ở đây để giúp bạn lựa chọn được những dịch vụ
//             phù hợp với nhu cầu, cũng như đưa ra được con số hoàn hảo nhất, vừa
//             vặn với tầm dự chi của bạn.
//           </p>
//         </Col>

//         <Col span={12} className="flex justify-end">
//           <form action="#" className="w-[400px]">
//             {partyTypes && (
//               <FormInput
//                 register={register}
//                 errorMessage={errors?.partyType?.message}
//                 wrapperClassName="!mt-0"
//                 theme="dark"
//                 label="Quý khách định tổ chức loại tiệc..."
//                 ariaLabel="Loại tiệc"
//                 id="partyType"
//                 name="partyType"
//                 type="select"
//                 options={[
//                   {
//                     id: "",
//                     name: "Chọn loại tiệc",
//                   },
//                   ...partyTypes.map((p) => ({
//                     id: JSON.stringify(p),
//                     name: p.name,
//                   })),
//                 ]}
//                 onChange={onInputChange}
//                 value={watch("partyType")}
//                 className={
//                   "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
//                 }
//               ></FormInput>
//             )}
//             {branches && (
//               <FormInput
//                 register={register}
//                 errorMessage={errors?.branch?.message}
//                 theme="dark"
//                 label="Quý khách dự định tổ chức tiệc ở..."
//                 ariaLabel="Địa điểm tổ chức tiệc / chi nhánh nhà hàng"
//                 id="branch"
//                 name="branch"
//                 type="select"
//                 options={[
//                   {
//                     id: "",
//                     name: "Chọn chi nhánh",
//                   },
//                   ...branches.map((p) => ({
//                     id: JSON.stringify(p),
//                     name: p.name,
//                   })),
//                 ]}
//                 onChange={onInputChange}
//                 value={watch("branch")}
//                 className={
//                   "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
//                 }
//               ></FormInput>
//             )}
//             <FormInput
//               register={register}
//               errors={errors}
//               errorMessage={errors?.partySize?.message}
//               theme="dark"
//               label="Với số lượng khách mời khoảng..."
//               placeholder="Ví dụ: 500"
//               ariaLabel="Số lượng khách mời"
//               id="partySize"
//               name="partySize"
//               type="text"
//               onChange={onInputChange}
//               value={watch("partySize")}
//               className={
//                 "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
//               }
//             ></FormInput>
//             <div className="flex flex-col">
//               <div className="flex gap-3">
//                 <FormInput
//                   register={register}
//                   errors={errors}
//                   errorMessage={errors?.budget?.message}
//                   placeholder="Ví dụ: 500"
//                   theme="dark"
//                   label="Với mức dự chi khoảng..."
//                   ariaLabel="Mức dự chi"
//                   id="budget"
//                   name="budget"
//                   type="text"
//                   onChange={onInputChange}
//                   value={watch("budget")}
//                   className={
//                     "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
//                   }
//                 ></FormInput>
//                 <FormInput
//                   register={register}
//                   errorMessage={"Vui lòng chọn đơn vị"}
//                   theme="dark"
//                   label="Đơn vị"
//                   ariaLabel="Đơn vị cho mức dự chi"
//                   id="priceUnit"
//                   name="priceUnit"
//                   type="select"
//                   options={[
//                     {
//                       id: "million",
//                       name: "Triệu",
//                     },
//                     {
//                       id: "billion",
//                       name: "Tỷ",
//                     },
//                   ]}
//                   onChange={(e) => setPriceUnit(e.target.value)}
//                   value={priceUnit}
//                   className={
//                     "!bg-whiteAlpha-100 hover:bg-whiteAlpha-200 focus:bg-whiteAlpha-200"
//                   }
//                 ></FormInput>
//               </div>
//             </div>
//             <Checkbox
//               isSelected={isSkipWarning}
//               onValueChange={setIsSkipWarning}
//               color={"default"}
//               classNames={{
//                 base: "mt-3",
//                 label: "text-gray-400",
//               }}
//             >
//               Bỏ qua cảnh báo vượt quá mức dự chi
//             </Checkbox>

//             {getValues("partyType") &&
//               getValues("partySize") &&
//               getValues("budget") &&
//               getValues("branch") && (
//                 <AnimatePresence mode="wait" initial={false}>
//                   <motion.a
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 20 }}
//                     className="w-full rounded-full bg-gold hover:brightness-105 py-2 px-3 mt-5 text-center hover:text-white transition flex flex-center gap-3"
//                     href="#creator"
//                   >
//                     <ArrowRightIcon className="w-6 h-6 text-white" />
//                     Tiếp tục
//                   </motion.a>
//                 </AnimatePresence>
//               )}
//           </form>
//         </Col>
//       </Row>
//     </section>
//   );
// }

// export default HeroSection;
