"use client";
import "@/app/_styles/header.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchBranchesFromApi } from "../_services/branchesServices";
import { useRouter } from "next/navigation";
import { HiOutlinePhone } from "react-icons/hi";
import Cookies from "js-cookie";
import {
  AiOutlineUser,
  AiOutlineUnorderedList,
  AiOutlineUserAdd,
  AiOutlineLogin,
} from "react-icons/ai";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BsCardChecklist } from "react-icons/bs";
import { signOut } from "next-auth/react";

const listMenu = [
  { id: 2, name: "Sự kiện", categories: "su-kien", href: "su-kien" },
  { id: 3, name: "Hội nghị", categories: "hoi-nghi", href: "hoi-nghi" },
  { id: 4, name: "Tiệc cưới", categories: "tiec-cuoi", href: "tiec-cuoi" },
  { id: 5, name: "Tin tức", categories: "tin-tuc", href: "tin-tuc" },
  { id: 6, name: "Ưu đãi", categories: "uu-dai", href: "uu-dai" },
  { id: 7, name: "Liên hệ", categories: "lien-he", href: "lien-he" },
];
const listLocation = [
  { id: 1, name: "Joice Palace Hoàng Văn Thụ" },
  { id: 2, name: "Joice Palace Phạm Văn Đồng" },
  { id: 3, name: "Joice Palace Võ Văn Kiệt" },
];

const HeaderClient = () => {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(null);
  const [listBranches, setListBranches] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [nameUser, setNameUser] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const fecthData = async () => {
      const branches = await fetchBranchesFromApi();
      setListBranches(branches);
    };
    fecthData();

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setIsLogin(true);
      const nameParts = (user?.name).split(" ");
      const firstName = nameParts[nameParts.length - 1];
      setNameUser(firstName);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNavigation = () => {
    signOut();
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    Cookies.remove("accessToken");
  };
  const handleShowMenu = () => {
    isShowMenu ? setIsShowMenu(false) : setIsShowMenu(true);
  };
  if (!listBranches) return;
  const listNavLogin = [
    {
      id: 1,
      name: "Tài khoản của tôi",
      link: "/client/nguoi-dung",
      icon: <AiOutlineUser fill="black" />,
    },
    {
      id: 2, 
      name: "Tiệc của tôi",
      link: "/client/nguoi-dung/lich-su-tiec",
      icon: <AiOutlineUnorderedList fill="black" />,
    },
    {
      id: 3,
      name: "Gói tiệc của tôi",
      link: "/client/nguoi-dung/combo-cua-ban",
      icon: <BsCardChecklist fill="black" />,
    },
    {
      id: 4,
      name: "Thực đơn của tôi",
      link: "/client/nguoi-dung/thuc-don-cua-ban",
      icon: <MdOutlineRestaurantMenu fill="black" />,
    },
    {
      id: 5,
      name: "Đăng xuất",
      link: "",
      icon: <AiOutlineLogin fill="red" />,
    },
  ];
  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 text-white ${
        scrolled && "backdrop-blur-xl "
      }`}
    >
      <div className="py-4 px-5 w-full h-[90px] flex flex-row-reverse justify-between items-center bg-transparent">
        <div className="h-full flex items-center gap-4 flex-row-reverse">
          <div className="flex items-center h-full px-4 gap-2 hover:text-[#C0995A] cursor-pointer max-sm:hidden ">
            <HiOutlinePhone className="!text-2xl" />

            <span className="uppercase text-base font-normal cursor-pointer hover:text-[#C0995A] max-lg:hidden">
              liên hệ
            </span>
          </div>
          <button
            id="buttonAccount"
            className="px-4 bg-white py-3 text-black flex justify-center items-center gap-4 rounded-xl relative max-sm:p-2"
          >
            <span className="text-sm font-semibold text-black">
              {isLogin ? `Hi! ${nameUser}` : "Tài khoản"}
            </span>
            <div
              className={`absolute top-[calc(100%+2px)] left-0 bg-white shadow-lg rounded-lg w-auto max-sm:hidden`}
              id="menuAccountDropdown"
            >
              {isLogin ? (
                <ul className="flex flex-col rounded-lg overflow-hidden w-[200%]">
                  {listNavLogin.map((item, index) => (
                    <li
                      onClick={() =>
                        item.id !== 5
                          ? router.push(item.link)
                          : handleNavigation()
                      }
                      key={item.id}
                      className={`bg-white text-black py-2 text-sm font-base cursor-pointer flex items-center gap-2 px-4 border border-t-1 ${
                        item.id === 5 && "text-red-500"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="flex flex-col rounded-lg overflow-hidden w-[150%]">
                  <li
                    onClick={() => {
                      router.push("/client/dang-ky");
                    }}
                    className="bg-white text-black py-2 text-sm font-base cursor-pointer flex items-center gap-2 px-4"
                  >
                    <AiOutlineUserAdd
                      fill="black"
                      width={"!24px"}
                      height={"!24px"}
                    />
                    Đăng ký
                  </li>
                  <li
                    onClick={() => {
                      router.push("/client/dang-nhap");
                    }}
                    className="bg-white text-black py-2 text-sm font-base cursor-pointer flex items-center gap-2 px-4 border border-t-1"
                  >
                    <AiOutlineUser
                      fill="black"
                      width={"!24px"}
                      height={"!24px"}
                    />
                    Đăng nhập
                  </li>
                </ul>
              )}
            </div>
          </button>
        </div>
        <div className="cursor-pointer">
          <span
            onClick={() => router.push("/")}
            className="font-normal text-4xl max-lg:text-2xl !cursor-poiter"
          >
            JOIE PALACE
          </span>
        </div>
        <div className="h-full flex items-center gap-4 flex-row-reverse">
          <div className="flex items-center gap-2 max-lg:hidden">
            <span className="px-2 text-white h-6 flex justify-center items-center rounded-md cursor-pointer">
              en
            </span>
            <span className="px-2 bg-white text-black h-6 flex justify-center items-center rounded-md cursor-pointer">
              vn
            </span>
          </div>
          <button
            className="flex px-4 gap-2 items-center flex-row-reverse"
            onClick={handleShowMenu}
          >
            <span className="uppercase text-base font-normal leading-6 max-lg:hidden">
              menu
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M2.40039 4.00001C2.40039 3.78784 2.48468 3.58436 2.63471 3.43433C2.78473 3.2843 2.98822 3.20001 3.20039 3.20001H12.8004C13.0126 3.20001 13.216 3.2843 13.3661 3.43433C13.5161 3.58436 13.6004 3.78784 13.6004 4.00001C13.6004 4.21219 13.5161 4.41567 13.3661 4.5657C13.216 4.71573 13.0126 4.80001 12.8004 4.80001H3.20039C2.98822 4.80001 2.78473 4.71573 2.63471 4.5657C2.48468 4.41567 2.40039 4.21219 2.40039 4.00001ZM2.40039 8.00001C2.40039 7.78784 2.48468 7.58436 2.63471 7.43433C2.78473 7.2843 2.98822 7.20001 3.20039 7.20001H12.8004C13.0126 7.20001 13.216 7.2843 13.3661 7.43433C13.5161 7.58436 13.6004 7.78784 13.6004 8.00001C13.6004 8.21219 13.5161 8.41567 13.3661 8.5657C13.216 8.71573 13.0126 8.80001 12.8004 8.80001H3.20039C2.98822 8.80001 2.78473 8.71573 2.63471 8.5657C2.48468 8.41567 2.40039 8.21219 2.40039 8.00001ZM2.40039 12C2.40039 11.7878 2.48468 11.5844 2.63471 11.4343C2.78473 11.2843 2.98822 11.2 3.20039 11.2H8.00039C8.21256 11.2 8.41605 11.2843 8.56608 11.4343C8.71611 11.5844 8.80039 11.7878 8.80039 12C8.80039 12.2122 8.71611 12.4157 8.56608 12.5657C8.41605 12.7157 8.21256 12.8 8.00039 12.8H3.20039C2.98822 12.8 2.78473 12.7157 2.63471 12.5657C2.48468 12.4157 2.40039 12.2122 2.40039 12Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* popup menu */}
      <div
        className={`menu px-5 w-full h-screen bg-primary z-50 absolute left-0 flex flex-col gap-4 transition duration-300 ease-in-out ${
          isShowMenu ? "showMenu" : ""
        }`}
      >
        <div className="w-full h-[90px] flex flex-row-reverse justify-between items-center bg-transparent border-b-[1px] border-white">
          <div className="flex items-center h-full px-4 gap-2 hover:text-[#C0995A] cursor-pointer max-sm:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="hover:fill-[#C0995A]"
            >
              <path d="M3.20731 1.01272C3.1105 0.993357 2.99432 0.993353 2.91687 1.03208C1.87128 1.4387 1.21294 2.92964 1.05804 3.95587C0.573969 7.28627 3.20731 10.1713 5.62766 12.0689C7.77694 13.7534 11.9012 16.5223 14.3409 13.8503C14.6507 13.5211 15.0186 13.037 14.9993 12.553C14.9412 11.7397 14.186 11.1588 13.6051 10.7135C13.1598 10.3843 12.2304 9.47427 11.6495 9.49363C11.1267 9.51299 10.7975 10.0551 10.4684 10.3843L9.88748 10.9652C9.79067 11.062 8.55145 10.2488 8.41591 10.152C7.91248 9.8228 7.4284 9.45491 7.00242 9.04829C6.57644 8.64167 6.18919 8.19632 5.86002 7.73161C5.7632 7.59607 4.96933 6.41495 5.04678 6.31813C5.04678 6.31813 5.72448 5.58234 5.91811 5.2919C6.32473 4.67229 6.63453 4.18822 6.16982 3.45243C5.99556 3.18135 5.78257 2.96836 5.55021 2.73601C5.14359 2.34875 4.73698 1.94213 4.27227 1.61296C4.02055 1.41933 3.59457 1.07081 3.20731 1.01272Z" />
            </svg>
            <span className="uppercase text-base font-normal cursor-pointer hover:text-[#C0995A] ">
              liên hệ
            </span>
          </div>
          <div className="">
            <span
              onClick={() => router.push("/")}
              className="font-normal text-4xl max-sm:hidden cursor-pointer"
            >
              JOIE PALACE
            </span>
          </div>
          <div className="h-full flex flex-row-reverse items-center gap-4 max-sm:w-full max-sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 text-white h-6 flex justify-center items-center rounded-md cursor-pointer">
                en
              </span>
              <span className="px-2 bg-white text-black h-6 flex justify-center items-center rounded-md cursor-pointer">
                vn
              </span>
            </div>
            <button
              className="flex px-4 gap-2 items-center flex-row-reverse"
              onClick={handleShowMenu}
            >
              <span className="uppercase text-base font-normal leading-6">
                đóng
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex lg:justify-center gap-16 max-lg: justify-between">
          <div>
            <ul className="flex flex-col !overflow-y-auto">
              {listMenu.map((menu) => (
                <div key={menu.id}>
                  <li className="font-normal h-16 text-3xl flex items-center max-lg:text-2xl max-lg:h-12 max-sm:text-2xl max-sm:h-8">
                    <Link
                      onClick={handleShowMenu}
                      className="hover:text-[#C0995A]"
                      href={`/client/${menu.href}`}
                    >
                      {menu.name}
                    </Link>
                  </li>
                  {menu.categories === "dia-diem" && (
                    <ul className="lg:hidden mt-[16px]">
                      {listLocation.map((i) => (
                        <li
                          onClick={handleShowMenu}
                          key={i.id}
                          className="text-xl my-[16px] font-light"
                        >
                          {i.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {!isLogin ? (
                <>
                  <li className="font-normal h-16 text-3xl flex items-center max-lg:text-3xl max-lg:h-12 max-sm:text-2xl max-sm:h-8">
                    <Link
                      onClick={handleShowMenu}
                      className="hover:text-[#C0995A]"
                      href={`/client/dang-ky`}
                    >
                      Đăng ký
                    </Link>
                  </li>
                  <li className="font-normal h-16 text-3xl flex items-center max-lg:text-3xl max-lg:h-12 max-sm:text-2xl max-sm:h-8">
                    <Link
                      onClick={handleShowMenu}
                      className="hover:text-[#C0995A]"
                      href={`/client/dang-nhap`}
                    >
                      Đăng nhập
                    </Link>
                  </li>
                </>
              ) : null}
            </ul>
          </div>
          <span className="w-[1px] h-full bg-white"></span>
          <div className="max-lg:hidden w-[40%]">
            <ul className="flex flex-wrap gap-8">
              {listBranches.map((location) => (
                <li
                  key={location.id}
                  className="font-normal w-fit h-16 text-2xl flex items-center"
                >
                  <Link
                    onClick={handleShowMenu}
                    className="relative group hover:text-[#C0995A]"
                    href={`/client/chi-nhanh/${location.slug}`}
                  >
                    {location.name}
                    <span className="absolute w-full h-[2px] bg-white bottom-[-2px] left-0 transition-all duration-300 group-hover:bg-gold"></span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderClient;
