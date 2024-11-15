"use client";
import React, { useState } from "react";
import { Image } from "@chakra-ui/react";

const WeddingPackages = () => {
    const [openSection, setOpenSection] = useState({});
    const [selected, setSelected] = useState(null);

    const handleClick = (button) => {
        setSelected(button);
    };

  const toggleDropdown = (packageId, sectionName) => {
    setOpenSection((prev) => ({
      ...prev,
      [`${packageId}-${sectionName}`]: !prev[`${packageId}-${sectionName}`],
    }));
  };

  const listItemPackages = [
    {
      id: 1,
      premium: false,
      name: "GÓI TIỆC CƯỚI NGỌT NGÀO",
      description: "Thường dành cho tiệc khoảng 100 khách.",
      priceform: 50000000,
      priceto: 100000000,
      services: [
        {
          id: 1,
          name: "Trang trí",
          content: [
            { id: 1, content: "Màu sắc tự chọn theo chủ đề" },
            { id: 2, content: "Hoa tươi tự chọn" },
            { id: 3, content: "Backdrop đơn giản, có thể tuỳ thiết kế" },
          ],
        },
        {
          id: 2,
          name: "Bàn tiệc",
          content: [
            { id: 1, content: "Loại bàn và ghế tự chọn" },
            { id: 2, content: "Khăn trải bàn theo chủ đề" },
          ],
        },
        { id: 3, name: "MC" },
        { id: 4, name: "Âm thanh" },
        { id: 5, name: "Bánh cưới" },
        { id: 6, name: "Nước uống" },
      ],
    },
    {
      id: 2,
      premium: true,
      name: "GÓI TIỆC CƯỚI NGỌT NGÀO",
      description: "Thường dành cho tiệc khoảng 100 khách.",
      priceform: 50000000,
      priceto: 100000000,
      services: [
        {
          id: 1,
          name: "Trang trí",
          content: [
            { id: 1, content: "Màu sắc tự chọn theo chủ đề" },
            { id: 2, content: "Hoa tươi tự chọn" },
            { id: 3, content: "Backdrop đơn giản, có thể tuỳ thiết kế" },
          ],
        },
        {
          id: 2,
          name: "Bàn tiệc",
          content: [
            { id: 1, content: "Loại bàn và ghế tự chọn" },
            { id: 2, content: "Khăn trải bàn theo chủ đề" },
          ],
        },
        { id: 3, name: "MC" },
        { id: 4, name: "Âm thanh" },
        { id: 5, name: "Bánh cưới" },
        { id: 6, name: "Nước uống" },
      ],
    },
    {
      id: 3,
      premium: false,
      name: "GÓI TIỆC CƯỚI NGỌT NGÀO",
      description: "Thường dành cho tiệc khoảng 100 khách.",
      priceform: 50000000,
      priceto: 100000000,
      services: [
        {
          id: 1,
          name: "Trang trí",
          content: [
            { id: 1, content: "Màu sắc tự chọn theo chủ đề" },
            { id: 2, content: "Hoa tươi tự chọn" },
            { id: 3, content: "Backdrop đơn giản, có thể tuỳ thiết kế" },
          ],
        },
        {
          id: 2,
          name: "Bàn tiệc",
          content: [
            { id: 1, content: "Loại bàn và ghế tự chọn" },
            { id: 2, content: "Khăn trải bàn theo chủ đề" },
          ],
        },
        { id: 3, name: "MC" },
        { id: 4, name: "Âm thanh" },
        { id: 5, name: "Bánh cưới" },
        { id: 6, name: "Nước uống" },
      ],
    },
  ];
  services: [
    {
      id: 1,
      name: "Trang trí",
      content: [
        { id: 1, content: "Màu sắc tự chọn theo chủ đề" },
        { id: 2, content: "Hoa tươi tự chọn" },
        { id: 3, content: "Backdrop đơn giản, có thể tuỳ thiết kế" },
      ],
    },
    {
      id: 2,
      name: "Bàn tiệc",
      content: [
        { id: 1, content: "Loại bàn và ghế tự chọn" },
        { id: 2, content: "Khăn trải bàn theo chủ đề" },
      ],
    },
    { id: 3, name: "MC" },
    { id: 4, name: "Âm thanh" },
    { id: 5, name: "Bánh cưới" },
    { id: 6, name: "Nước uống" },
  ];
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-between">
      <div className="flex my-8 gap-4 items-center justify-center">
        {/* <h1 className="text-4xl font-bold text-center mb-2 text-gold uppercase">DỊCH VỤ TRỌN GÓI</h1> */}
        <div className="flex space-x-4 m-auto p-1 mt-2 bg-whiteAlpha-200 rounded-full w-fit">
          <button className="bg-gold px-6 py-2 rounded-full font-semibold">
            TIỆC CƯỚI
          </button>
          <button className="text-[#d3e2db] px-6 py-2 rounded-full font-semibold">
            HỘI NGHỊ
          </button>
        </div>
        <div className="font-bold text-4xl leading-[48px] text-left font-inte text-gold">
          DỊCH VỤ TRỌN GÓI
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full ">
        {dataPackage.map((pkg, index) => (
          <div
            key={pkg.id}
            onClick={() => setPackageFocus(index)}
            className={`overflow-y-hidden h-[500px]  p-3 rounded-lg flex flex-col items-center space-y-4 cursor-pointer ${
              packageFocus === index ? "border border-gold" : ""
            }`}
          >
            <div className="affterLine mr-[290px] z-10"></div>
            {packageFocus === index && (
              <div className="absolute top-[120px] max-md:hidden">
                <Image src="/premium.png" alt="Premium" />
              </div>
            )}
            <h2 className="text-lg font-bold text-center z-20">{pkg?.name}</h2>
            <p className="text-center text-2xl font-semibold uppercase z-20">
              {pkg?.price.toLocaleString()} TRIỆU VND
            </p>
            <p className="text-center z-20 ">{pkg?.short_description}</p>

            {listItemPackages[0].services?.map((service) => (
              <div key={service.id} className="w-full z-20">
                <button
                  className="w-full text-left font-semibold mb-2 flex items-center justify-between"
                  onClick={() => toggleDropdown(pkg.id, service.name)}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM19.2071 8.70711C19.5976 8.31658 19.5976 7.68342 19.2071 7.29289C18.8166 6.90237 18.1834 6.90237 17.7929 7.29289L10.5428 14.543L7.24741 10.8356C6.88049 10.4229 6.24842 10.3857 5.83564 10.7526C5.42285 11.1195 5.38567 11.7516 5.75259 12.1644L9.75259 16.6644C9.93556 16.8702 10.1953 16.9915 10.4706 16.9996C10.7459 17.0077 11.0124 16.9019 11.2071 16.7071L19.2071 8.70711Z"
                        fill="white"
                      />
                    </svg>
                    <p>{service.name}</p>
                  </div>
                  <span>
                    {openSection[`${pkg.id}-${service.name}`] ? "▲" : "▼"}
                  </span>
                </button>
                {service.content && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openSection[`${pkg.id}-${service.name}`]
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="text-left space-y-2 pl-4 py-2">
                      {service.content.map((item) => (
                        <li key={item.id}>• {item.content}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center items-center gap-4">
              <button className="flex justify-center items-center gap-2 bg-gold text-white px-4 py-2 rounded-lg font-semibold ">
                LIÊN HỆ NGAY{" "}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.0254 4.94189L17.0837 10.0002L12.0254 15.0586"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.91602 10H16.941"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button className="flex justify-center items-center gap-2 bg-whiteAlpha-200 text-white px-4 py-2 rounded-lg font-semibold ">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.194 10.8165C16.2273 10.5498 16.2523 10.2832 16.2523 9.99984C16.2523 9.7165 16.2273 9.44984 16.194 9.18317L17.9523 7.80817C18.1106 7.68317 18.1523 7.45817 18.0523 7.27484L16.3856 4.3915C16.3106 4.25817 16.169 4.18317 16.019 4.18317C15.969 4.18317 15.919 4.1915 15.8773 4.20817L13.8023 5.0415C13.369 4.70817 12.9023 4.43317 12.394 4.22484L12.0773 2.0165C12.0523 1.8165 11.8773 1.6665 11.669 1.6665H8.33564C8.12731 1.6665 7.95231 1.8165 7.92731 2.0165L7.61064 4.22484C7.10231 4.43317 6.63564 4.7165 6.20231 5.0415L4.12731 4.20817C4.07731 4.1915 4.02731 4.18317 3.97731 4.18317C3.83564 4.18317 3.69397 4.25817 3.61897 4.3915L1.95231 7.27484C1.84397 7.45817 1.89397 7.68317 2.05231 7.80817L3.81064 9.18317C3.77731 9.44984 3.75231 9.72484 3.75231 9.99984C3.75231 10.2748 3.77731 10.5498 3.81064 10.8165L2.05231 12.1915C1.89397 12.3165 1.85231 12.5415 1.95231 12.7248L3.61897 15.6082C3.69397 15.7415 3.83564 15.8165 3.98564 15.8165C4.03564 15.8165 4.08564 15.8082 4.12731 15.7915L6.20231 14.9582C6.63564 15.2915 7.10231 15.5665 7.61064 15.7748L7.92731 17.9832C7.95231 18.1832 8.12731 18.3332 8.33564 18.3332H11.669C11.8773 18.3332 12.0523 18.1832 12.0773 17.9832L12.394 15.7748C12.9023 15.5665 13.369 15.2832 13.8023 14.9582L15.8773 15.7915C15.9273 15.8082 15.9773 15.8165 16.0273 15.8165C16.169 15.8165 16.3106 15.7415 16.3856 15.6082L18.0523 12.7248C18.1523 12.5415 18.1106 12.3165 17.9523 12.1915L16.194 10.8165ZM14.544 9.3915C14.5773 9.64984 14.5856 9.82484 14.5856 9.99984C14.5856 10.1748 14.569 10.3582 14.544 10.6082L14.4273 11.5498L15.169 12.1332L16.069 12.8332L15.4856 13.8415L14.4273 13.4165L13.5606 13.0665L12.8106 13.6332C12.4523 13.8998 12.1106 14.0998 11.769 14.2415L10.8856 14.5998L10.7523 15.5415L10.5856 16.6665H9.41897L9.12731 14.5998L8.24397 14.2415C7.88564 14.0915 7.55231 13.8998 7.21897 13.6498L6.46064 13.0665L5.57731 13.4248L4.51897 13.8498L3.93564 12.8415L4.83564 12.1415L5.57731 11.5582L5.46064 10.6165C5.43564 10.3582 5.41897 10.1665 5.41897 9.99984C5.41897 9.83317 5.43564 9.6415 5.46064 9.3915L5.57731 8.44984L4.83564 7.8665L3.93564 7.1665L4.51897 6.15817L5.57731 6.58317L6.44397 6.93317L7.19397 6.3665C7.55231 6.09984 7.89397 5.89984 8.23564 5.75817L9.11897 5.39984L9.25231 4.45817L9.41897 3.33317H10.5773L10.869 5.39984L11.7523 5.75817C12.1106 5.90817 12.444 6.09984 12.7773 6.34984L13.5356 6.93317L14.419 6.57484L15.4773 6.14984L16.0606 7.15817L15.169 7.8665L14.4273 8.44984L14.544 9.3915ZM10.0023 6.6665C8.16064 6.6665 6.66897 8.15817 6.66897 9.99984C6.66897 11.8415 8.16064 13.3332 10.0023 13.3332C11.844 13.3332 13.3356 11.8415 13.3356 9.99984C13.3356 8.15817 11.844 6.6665 10.0023 6.6665ZM10.0023 11.6665C9.08564 11.6665 8.33564 10.9165 8.33564 9.99984C8.33564 9.08317 9.08564 8.33317 10.0023 8.33317C10.919 8.33317 11.669 9.08317 11.669 9.99984C11.669 10.9165 10.919 11.6665 10.0023 11.6665Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeddingPackages;
