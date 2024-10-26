"use client";

import { useEffect, useState } from "react";
import ButtonDiscover from "./ButtonDiscover";
import InputIndex from "./InputIndexClient";
import { fetchBranchesFromApi } from "../_services/branchesServices";

const Contact = () => {
  const [listBranches, setListBranches] = useState([]);

  useEffect(() => {
    const fecthData = async () => {
      const branches = await fetchBranchesFromApi();
      setListBranches(branches);
    };
    fecthData();
  }, []);
  if (!listBranches) return;
  return (
    <form
      className="w-full h-auto flex flex-col gap-5 overflow-y-scroll pr-1 text-lg"
      id="form-information"
    >
      <InputIndex type="text" placeholder="Họ và tên*" />
      <InputIndex type="number" placeholder="Số điện thoại*" />
      <InputIndex type="email" placeholder="Email*" />
      <InputIndex type="number" min="0" placeholder="Số lượng khách*" />
      <InputIndex type="datetime-local" placeholder="Thời gian*" />
      <div className="w-full flex items-center justify-between">
        <span>
          Địa điểm<span className="text-red-700">*</span>
        </span>
        <div className="w-[40%] h-full flex items-center gap-3 border border-darkGreen-600 rounded-md">
          <select
            name=""
            id=""
            className="w-full border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
          >
            {listBranches.map((branch) => (
              <option
                key={branch.id}
                className="text-white bg-darkGreen-800 border-none"
                value={branch.name}
              >
                {branch.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <span>
          Mức chi<span className="text-red-700">*</span>
        </span>
        <div className="w-[40%] h-full flex items-center gap-3 border border-darkGreen-600  rounded-md">
          <select
            name=""
            id=""
            className="w-full border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
          >
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="50 - 100 triệu"
            >
              50 - 100 triệu
            </option>
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="100 - 300 triệu"
            >
              100 - 300 triệu
            </option>
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="300 - 500 triệu"
            >
              300 - 500 triệu
            </option>
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="500 - 1 tỉ"
            >
              500 - 1 tỉ
            </option>
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="Trên 1 tỉ"
            >
              Trên 1 tỉ
            </option>
          </select>
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <span>
          Loại tiệc<span className="text-red-700">*</span>
        </span>
        <div className="w-[40%] h-full flex items-center gap-3 border border-darkGreen-600 rounded-md">
          <select
            name=""
            id=""
            className="w-full border bg-transparent border-darkGreen-400 p-3 py-2 rounded-sm text-white"
          >
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="1"
            >
              Hoàng Văn Thụ
            </option>
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="2"
            >
              Phạm Văn Đồng
            </option>
            <option
              className="text-white bg-darkGreen-800 border-none"
              value="3"
            >
              Võ Văn Kiệt
            </option>
          </select>
        </div>
      </div>
      <InputIndex
        type="text"
        placeholder={"Ghi chú*"}
        styles="overflow-hidden"
      />
      <div className="w-full flex justify-end">
        <ButtonDiscover name={"Gửi"} className={"w-auto px-6"} />
      </div>
    </form>
  );
};

export default Contact;
