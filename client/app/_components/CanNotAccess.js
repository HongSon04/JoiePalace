import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

function CanNotAccess({ retryUrl }) {
  return (
    <div className="absolute h-full inset-0 p-16 flex-col flex-center text-white gap-5">
      <ExclamationCircleIcon className="w-16 h-16 mx-auto text-red-400" />
      <h1 className="text-xl text-center text-red-400">
        Bạn không thể truy cập dữ liệu này
      </h1>
      <Link
        href={retryUrl || "/"}
        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-400"
      >
        Thử lại
      </Link>
      <p className="text-center text-gray-400 text-sm">
        <Link
          href="/admin/lien-he-ho-tro"
          className="text-gray-400 underline hover:text-gray-300 text-sm"
        >
          Liên hệ
        </Link>{" "}
        với bộ phận kỹ thuật nếu bạn cho rằng đây là lỗi
      </p>
    </div>
  );
}

export default CanNotAccess;
