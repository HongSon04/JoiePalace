"use client";

import { useEffect, useState, useRef } from 'react';
import { Box, Image, Button } from '@chakra-ui/react';
import axios from 'axios';

const AdminThemChiNhanhImg = ({ title, inputId, onImagesChange, name }) => {
  const [images, setImages] = useState([]);
  const imagesRef = useRef(images);

  useEffect(() => {
    if (imagesRef.current !== images) { 
      onImagesChange(name, images);
      imagesRef.current = images; 
    }
  }, [images, onImagesChange, name]);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'pictures');
    formData.append('upload_preset', 'bzs31ttb'); // Thay thế bằng upload preset của bạn

    const response = await axios.post(`https://api.cloudinary.com/v1_1/dx22tntue/image/upload`, formData);
    return response.data.secure_url; // URL của hình ảnh đã upload
  };

  const handleImageUpload = async (event) => {
    try {
      const files = Array.from(event.target.files);
      const uploadPromises = files.map(file => uploadImageToCloudinary(file));
      const newImages = await Promise.all(uploadPromises);
      setImages(prevImages => [...prevImages, ...newImages]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1 p-4 bg-whiteAlpha-200 rounded-lg h-fit">
      <h3 className="font-bold text-white leading-6 text-base">{title}</h3>
      <div className="grid grid-cols-2 gap-5 mt-[10px] w-full">
        {images.map((src, index) => (
          <Box key={index} className='relative'>
            <Image src={src} alt={`carousel-img-${index}`} className="rounded-lg object-cover w-full" h='180px' />
            <Button
              className="absolute bottom-0 left-0"
              colorScheme="red"
              onClick={() => handleDeleteImage(index)}
            >
              X
            </Button>
          </Box>
        ))}
        <Box display="flex" alignItems="center" justifyContent="center" cursor="pointer" as="label" htmlFor={inputId} className="bg-whiteAlpha-200 rounded-lg" h='180px'>
          <div className="p-3 rounded-full bg-whiteAlpha-600 flex items-center justify-center align-middle mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
              <path d="M16.3333 11.3333H11.3333V16.3333H9.66663V11.3333H4.66663V9.66663H9.66663V4.66663H11.3333V9.66663H16.3333V11.3333Z" fill="#4B5563"/>
            </svg>
          </div>
          <input id={inputId} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} multiple />
        </Box>
      </div>
    </div>
  );
};

export default AdminThemChiNhanhImg;
