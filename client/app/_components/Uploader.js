// app/components/ImageUpload.js
"use client"; // This is a client component

import { ExclamationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useCallback, useRef } from "react";
import { CONFIG } from "../_utils/config";
import { motion, AnimatePresence } from "framer-motion";

/**
 * USAGE: 
 * 
 * Step 1: set up state in parent component
 * const [files, setFiles] = useState([]);
 * 
  * Step 2: handle the file change in the parent component and then pass onChange handler, state and the setter to the Uploader component
  * const handleFileChange = (newFiles) => {
    setFiles(newFiles);
  };
  * <Uploader files={files} setFiles={setFiles} />
 * 
 * Step 3: handle the files in the parent component
 */

const Uploader = ({
  onFileChange,
  files,
  setFiles,
  id,
  name,
  register,
  errors,
}) => {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    onFileChange(selectedFiles);
  };

  const handleUnsetFiles = () => {
    setFiles([]);
    onFileChange([]); // Notify parent component of the new files
  };

  const handleRemoveFile = (i) => {
    const newFiles = [...files];
    newFiles.splice(i, 1);
    setFiles(newFiles);
    onFileChange(newFiles); // Notify parent component of the new files
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFileChange(droppedFiles);
    },
    [onFileChange]
  );

  // Utility function to format file size
  const formatFileSize = (size) => {
    if (size < 1024) return `${size} bytes`;
    else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    else return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{
          border: "2px dashed #ccc",
          borderRadius: "5px",
          padding: "20px",
          textAlign: "center",
          marginBottom: "10px",
        }}
        className="flex flex-col items-center gap-2"
      >
        <Image
          src={CONFIG.IMAGE_UPLOADER_PLACEHOLDER}
          alt={"Drag and drop your images here, or click to select files"}
          width={300}
          height={200}
        ></Image>
        <p className="text-base text-gray-400">
          Kéo và thả ảnh của bạn tại đây, <br /> hoặc bấm vào nút chọn ảnh
          <br />
          (Vui lòng chọn ảnh có dung lượng nhỏ hơn 5MB)
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden-input"
          id={id || name}
          name={name}
          aria-label="Chọn ảnh"
          // required
          // {...register(name)}
          // tabIndex={0}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="underline text-gold cursor-pointer"
        >
          Chọn ảnh{" "}
        </button>
      </div>

      {/* <AnimatePresence>
        {errors[name] && (
          <motion.div
            key={errors[name].message}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-red-400 text-sm font-normal mt-2 mb-2"
          >
            <ExclamationCircleIcon className="w-4 h-4 mr-1 inline" />{" "}
            {errors[name].message}
          </motion.div>
        )}
      </AnimatePresence> */}
      {files.length > 0 && (
        <div className="mb-3">
          <h3>Ảnh tải lên:</h3>
          <ul className="flex flex-col gap-2 mt-3">
            {files.map((file, index) => (
              <li
                key={index}
                className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex gap-2 items-center"
              >
                <button
                  className="rounded-full !text-gray-600 hover:text-gray-800"
                  onClick={() => handleRemoveFile(index)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="truncate w-full text-gray-800">{file.name}</div>
                <div className="min-w-max text-gray-800">
                  ({formatFileSize(file.size)})
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={handleUnsetFiles}
            className="text-red-400 underline hover:text-red-500 mt-3"
          >
            Xóa tất cả
          </button>
        </div>
      )}
    </div>
  );
};

export default Uploader;
