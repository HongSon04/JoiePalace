"use client";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const InputIndex = ({ messageError, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full h-auto gap-1 flex flex-col relative">
      <input
        className={`w-full py-3 font-normal border border-b-white border-t-0 border-l-0 border-r-0 focus:border-b-gold placeholder-white ${props.styles}`}
        {...props}
        type={type === "password" ? (showPassword ? "text" : type) : type}
      />
      {type === "password" ? (
        <div
          onClick={() => setShowPassword(showPassword ? false : true)}
          className="absolute cursor-pointer right-0 top-1/2 -translate-y-1/2"
        >
          {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
        </div>
      ) : null}

      <span className="text-sm text-red-600">{messageError}</span>
    </div>
  );
};
export default InputIndex;
