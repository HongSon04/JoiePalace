import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "../_utils/config";
import React from "react";

function SelectedProduct({ product }) {
  const [image, setImage] = React.useState(
    product?.images?.at(0) || CONFIG.DISH_IMAGE_PLACEHOLDER
  );

  console.log("product", product);
  

  const onError = () => {
    setImage(CONFIG.DISH_IMAGE_PLACEHOLDER);
  };

  return (
    <div className="rounded-lg flex gap-3 items-start">
      <div className="relative rounded-lg overflow-hidden w-14 h-14">
        <Image
          src={image}
          onError={onError}
          sizes="44px"
          className="rounded-lg object-cover"
        />
      </div>
      <div className="flex flex-col flex-1">
        <h3 className="text-white text-base">{product?.name}</h3>
        <p className="text-gray-200 text-base font-normal mt-2">
          {product?.price?.toLocaleString()} VNĐ
        </p>
      </div>
      <Link
        href={`/chi-tiet-san/pham/${product?.id}`}
        className="text-base text-gold underline hover:brightness-90 transition"
      >
        Chi tiết
      </Link>
    </div>
  );
}

export default SelectedProduct;
