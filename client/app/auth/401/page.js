"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/"); // Redirect to home page or login page
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-darkGreen-primary">
      <div className="text-center p-8 rounded-lg bg-whiteAlpha-200 shadow-lg flex flex-col gap-6 flex-center">
        <ExclamationCircleIcon className="w-52 h-w-52 text-white" />
        <h1 className="text-6xl font-bold text-white ">401</h1>
        <p className="text-base text-white">
          Rất tiếc! Bạn không có quyền truy cập trang này
          <br />
          Nếu bạn là người quản trị, vui lòng liên hệ với nhân viên kỹ thuật để
          được hỗ trợ
        </p>
        <button
          onClick={handleGoBack}
          className="px-6 py-3 w-fit bg-white text-darkGreen-primary font-semibold rounded-lg shadow-md hover:bg-gray-200"
        >
          Trang chủ
        </button>

        <div className="flex flex-center gap-8">
          <Link href="/auth/chon-chi-nhanh" className="text-gold underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Page;
