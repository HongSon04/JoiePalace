"use client";

import React, { useEffect, useState } from "react";
import { z } from "zod";
import ButtonDiscover from "./ButtonDiscover";
import { Button } from "@nextui-org/react";
import InputIndex from "./InputIndexClient";
import { fetchBranchesFromApi } from "../_services/branchesServices";
import { fecthAllPartyTypes } from "../_services/partyTypesServices";
import { createNewBooking } from "../_services/bookingServices";
import { formatDate } from "../_utils/format";
import useCustomToast from "../_hooks/useCustomToast";
import { useRouter, useSearchParams } from "next/navigation";
import { getPackageById } from "../_services/packageServices";
import IconButton from "./IconButton";
import "@/app/_styles/client.css";

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
    .max(5000, "Tối đa 5000 khách!"),
});

const Contact = () => {
  const [errors, setErrors] = useState({});
  const [listBranches, setListBranches] = useState([]);
  const [listPartyTypes, setListPartyTypes] = useState([]);
  const [dataPackage, setDataPackage] = useState(null);
  const [user, setUser] = useState();
  const toast = useCustomToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const package_id = searchParams.get("package_id");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user data from local storage
  useEffect(() => {
    const getUser = JSON.parse(localStorage.getItem("user"));
    setUser(getUser);
  }, []);

  // Initialize form data with default values
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    email: "",
    phone: "",
    guestCount: "",
    date: "",
    shift: "Sáng",
    branch: "",
    budget: "50 - 100 triệu",
    partyType: "",
    note: "",
  });

  // Update formData when user data is available
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: user.id || "",
        name: user.name || "",
        email: user.email || "",
        phone: user.phone !== null ? "" : user.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const branches = await fetchBranchesFromApi();
      const partyTypes = await fecthAllPartyTypes();
      let dataPackageRes = null;

      if (package_id) {
        dataPackageRes = await getPackageById(package_id);
        setDataPackage(dataPackageRes.data[0]);
      }

      setListBranches(branches);
      setListPartyTypes(partyTypes);

      // Set default values for formData based on fetched data
      if (branches.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          branch: branches[0]?.id || "",
        }));
      }
      if (partyTypes.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          partyType: partyTypes[0]?.id || "",
        }));
      }
    };

    fetchData();
  }, [package_id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = {};

    try {
      // Validate form data
      formSchema.parse(formData);
      setErrors({}); // Clear previous errors

      const dataToSend = {
        user_id: formData.user_id,
        branch_id: formData.branch,
        party_type_id: formData.partyType,
        name: formData.name,
        phone: formData.phone.toString(),
        email: formData.email,
        note: formData.note,
        number_of_guests: Number(formData.guestCount),
        budget: formData.budget.toString(),
        shift: formData.shift.toString(),
        organization_date: formatDate(formData.date),
      };

      // Send booking request
      const response = await createNewBooking(dataToSend);
      if (response.status === 200 || response.status === 201) {
        toast({
          position: "top",
          type: "success",
          title: "Thành công!",
          description: "Nhà hàng sẽ liên hệ lại với thời gian sớm nhất 😘😘!",
          closable: true,
        });
        router.push("/client/cam-on"); // Redirect to thank you page
      }
    } catch (error) {
      // Handle validation and submission errors
      toast({
        position: "top",
        type: "error",
        title: "Thất bại!",
        description:
          error.response?.data.message || "Vui lòng kiểm tra lại thông tin!",
        closable: true,
      });

      // Collect validation errors
      if (error.errors) {
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If branches or party types are not loaded, return null to avoid rendering the form
  if (!listBranches.length || !listPartyTypes.length) return null;

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
        className="input_date"
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
          <option className="bg-darkGreen-800" value="Sáng">
            Ca sáng (9h - 15h)
          </option>
          <option className="bg-darkGreen-800" value="Tối">
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
              value={branch.id}
            >
              {branch.name}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full flex justify-between h-auto">
        <span>
          Mức chi<span className="text-red-700">*</span>
        </span>
        <div className="dropdow flex flex-col w-[40%] px-3 gap-2">
          <InputIndex
            value={formData.budget}
            messageError={errors.budget}
            onChange={handleChange}
            name="budget"
            type="number"
            min="0"
            placeholder="Nhập mức chi"
          />
          <select
            name="budget"
            value={formData.budget}
            onChange={handleSelectChange}
            className="w-[100%] border bg-whiteAlpha-100 rounded-lg border-darkGreen-400 py-2 overflow-hidden text-white !px-0"
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
              value={partyType.id}
            >
              {partyType.name}
            </option>
          ))}
        </select>
      </div>
      <InputIndex
        value={formData.note}
        onChange={handleChange}
        name="note"
        type="text"
        placeholder="Ghi chú*"
        styles="overflow-hidden"
      />
      <div className="w-full flex justify-end">
        <IconButton
          className={`w-auto px-6 text-white flex items-center gap-2 rounded-full !bg-gold py-${
            isLoading ? "3" : "0"
          } h-auto ${isLoading ? "select-none" : ""}`}
          onClick={handleSubmit}
        >
          {!isLoading ? (
            <div className="w-full h-full flex items-center gap-2 justify-center !py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M7.52867 11.5286L8.47133 12.4712L12.9427 7.9999L8.47133 3.52856L7.52867 4.47123L10.3907 7.33323H4V8.66656H10.3907L7.52867 11.5286Z"
                  fill="white"
                />
              </svg>
              <span className="font-medium">Gửi</span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div>
              <span>Đang xử lí</span>
            </>
          )}
        </IconButton>
      </div>
    </form>
  );
};

export default Contact;
