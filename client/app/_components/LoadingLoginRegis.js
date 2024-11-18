import React from "react";

const LoadingLoginRegis = () => {
  return (
    <>
      <div className="w-full h-full bg-blackAlpha-500 absolute top-0 left-0 z-[999] gap-x-2 flex justify-center items-center">
        <div className="w-5 bg-[#d991c2] animate-pulse h-5 rounded-full animate-bounce" />
        <div className="w-5 animate-pulse h-5 bg-[#9869b8] rounded-full animate-bounce" />
        <div className="w-5 h-5 animate-pulse bg-[#6756cc] rounded-full animate-bounce" />
      </div>
    </>
  );
};

export default LoadingLoginRegis;
