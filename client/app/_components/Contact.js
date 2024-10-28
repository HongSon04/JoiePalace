"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import ButtonDiscover from "./ButtonDiscover";
import InputIndex from "./InputIndexClient";
import { fetchBranchesFromApi } from "../_services/branchesServices";
import { fecthAllPartyTypes } from "../_services/partyTypesServices";

const formSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập Họ và tên!"),
  email: z.string().email("Vui lòng điền địa chỉ Email!"),
  phone: z
    .string()
    .regex(/^(0|\+?[1-9])\d{0,14}$/, "Vui lòng nhập số điện thoại hợp lệ!"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Vui lòng nhập thời gian!",
  }),
  guestCount: z
    .number()
    .min(100, "Số lượng khách ít nhất là 100 khách!")
    .max(1000, "Tối đa 1000 khách!"),
});

const Contact = () => {
  const [errors, setErrors] = useState({});
  const [listBranches, setListBranches] = useState([]);
  const [listPartyTypes, setListPartyTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    date: "",
    shift: "9h - 15h",
    branch: "",
    budget: "50 - 100 triệu",
    partyType: "",
  });

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const branches = await fetchBranchesFromApi();
  //     const partyTypes = await fecthAllPartyTypes();
  //     setListBranches(branches);
  //     setListPartyTypes(partyTypes);
  //   };
  //   fetchData();
  //   setFormData({
  //     ...formData,
  //     branch: listBranches[0].name,
  //     partyType: listPartyTypes[0].name,
  //   });
  // }, [formData]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    try {
      formSchema.parse(formData);
      console.log("Form submitted successfully:", formData);
      setErrors({});
      // Thực hiện hành động gửi form ở đây
    } catch (error) {
      error.errors.forEach((err) => {
        validationErrors[err.path[0]] = err.message;
      });
      setErrors(validationErrors);
    }
  };

  if (!listBranches || !listPartyTypes) return null;

  return (
    <form
      className="w-full h-auto flex flex-col gap-5 overflow-y-scroll pr-1 text-lg"
      id="form-information"
      onSubmit={handleSubmit}
    >
      <InputIndex
        value={formData.name}
        messageError={errors.name}
        onChange={handleChange}
        name="name"
        type="text"
        placeholder="Họ và tên*"
      />
      <InputIndex
        value={formData.phone}
        messageError={errors.phone}
        onChange={handleChange}
        name="phone"
        type="text"
        placeholder="Số điện thoại*"
      />
      <InputIndex
        value={formData.email}
        messageError={errors.email}
        onChange={handleChange}
        name="email"
        type="email"
        placeholder="Email*"
      />
      <InputIndex
        value={formData.guestCount}
        messageError={errors.guestCount}
        onChange={handleChange}
        name="guestCount"
        type="number"
        min="0"
        placeholder="Số lượng khách*"
      />
      <InputIndex
        value={formData.date}
        messageError={errors.date}
        onChange={handleChange}
        name="date"
        type="date"
        placeholder="Thời gian*"
      />
      <div className="w-full flex items-center justify-between">
        <span>
          Buổi tổ chức<span className="text-red-700">*</span>
        </span>
        <select
          name="shift"
          value={formData.shift}
          onChange={handleSelectChange}
          className="w-[40%] border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
        >
          <option className="bg-darkGreen-800" value="9h - 15h">
            Ca sáng (9h - 15h)
          </option>
          <option className="bg-darkGreen-800" value="17h - 21h">
            Ca tối (17h - 21h)
          </option>
        </select>
      </div>
      <div className="w-full flex items-center justify-between">
        <span>
          Địa điểm<span className="text-red-700">*</span>
        </span>
        <select
          name="branch"
          value={formData.branch}
          onChange={handleSelectChange}
          className="w-[40%] border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
        >
          {listBranches.map((branch) => (
            <option
              className="bg-darkGreen-800"
              key={branch.id}
              value={branch.name}
            >
              {branch.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex items-center justify-between">
        <span>
          Mức chi<span className="text-red-700">*</span>
        </span>
        <select
          name="budget"
          value={formData.budget}
          onChange={handleSelectChange}
          className="w-[40%] border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
        >
          <option className="bg-darkGreen-800" value="50 - 100 triệu">
            50 - 100 triệu
          </option>
          <option className="bg-darkGreen-800" value="100 - 300 triệu">
            100 - 300 triệu
          </option>
          <option className="bg-darkGreen-800" value="300 - 500 triệu">
            300 - 500 triệu
          </option>
          <option className="bg-darkGreen-800" value="500 - 1 tỉ">
            500 - 1 tỉ
          </option>
          <option className="bg-darkGreen-800" value="Trên 1 tỉ">
            Trên 1 tỉ
          </option>
        </select>
      </div>
      <div className="w-full flex items-center justify-between">
        <span>
          Loại tiệc<span className="text-red-700">*</span>
        </span>
        <select
          name="partyType"
          value={formData.partyType}
          onChange={handleSelectChange}
          className="w-[40%] border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
        >
          {listPartyTypes.map((partyType) => (
            <option
              className="bg-darkGreen-800"
              key={partyType.id}
              value={partyType.name}
            >
              {partyType.name}
            </option>
          ))}
        </select>
      </div>
      <InputIndex type="text" placeholder="Ghi chú*" styles="overflow-hidden" />
      <div className="w-full flex justify-end">
        <ButtonDiscover type="submit" name="Gửi" className="w-auto px-6" />
      </div>
    </form>
  );
};

export default Contact;
