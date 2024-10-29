"use client";
import { Image } from "@chakra-ui/react";
import React from "react";

const page = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Image
        className="w-full h-full object-cover"
        w={"100%"}
        h={"100%"}
        src="https://tingenz.com/wp-content/uploads/2022/11/hinh-anh-loi-cam-on-tu-trai-tim-4-min.jpg"
        alt=""
      />
    </div>
  );
};

export default page;
