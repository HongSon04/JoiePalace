import imagePlaceholder from "@/public/image-placeholder.jpg";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import { useRef } from "react";

/**
 * @param {string} image - The image url
 * @returns - A file uploader component
 *
 * // USAGE:
 *
 */

function FileUploader({ image }) {
  const hiddenFileInput = useRef(null);

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      const body = new FormData();
      body.append("image", i);
    }
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-full !shrink-0 relative">
          <Image
            aria-label="file upload"
            onClick={handleClick}
            fill
            src={image ? image : imagePlaceholder}
            className="rounded-full w-fit object-cover cursor-pointer"
            alt="Dish image"
            priority
          ></Image>
        </div>

        <div className="flex items-center gap-5">
          <Button color="danger" className={"font-semibold"}>
            Xóa ảnh
          </Button>
          <Button
            onClick={handleClick}
            className="w-fit bg-blue-400 hover:bg-blue-500 rounded-lg flex-center text-white"
          >
            {image ? "Thay đổi" : "Tải ảnh lên"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
