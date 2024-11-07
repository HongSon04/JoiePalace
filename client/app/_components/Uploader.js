// app/components/ImageUpload.js
"use client"; // This is a client component

import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { useCallback } from "react";
import { CONFIG } from "../_utils/config";

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
  const fileInputRef = React.createRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
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
      setFiles(droppedFiles);
      onFileChange(droppedFiles); // Notify parent component of the dropped files
    },
    [onFileChange, setFiles]
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
        {errors && errors[name] ? (
          <p className="text-red-400">{errors[name].message}</p>
        ) : (
          <p className="text-base text-gray-400">
            Kéo và thả ảnh của bạn tại đây, <br /> hoặc bấm vào nút chọn ảnh
          </p>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ opacity: "0" }} // Hide the default file input
          id={id || name}
          name={name}
          aria-label="Chọn ảnh"
          {...register(name)}
        />
        <button
          type="button"
          className="underline text-gold"
          onClick={() => fileInputRef.current.click()}
        >
          Chọn ảnh{" "}
        </button>
      </div>
      {files.length > 0 && (
        <div>
          <h3>Ảnh tải lên:</h3>
          <ul className="flex flex-col gap-2 mt-3">
            {files.map((file, index) => (
              <li
                key={index}
                className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 flex gap-2 items-center"
              >
                <button
                  className="rounded-full text-gray-600 hover:text-gray-800"
                  onClick={() => handleRemoveFile(index)}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
                <div className="truncate w-full">{file.name}</div>
                <div className="min-w-max">({formatFileSize(file.size)})</div>
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
