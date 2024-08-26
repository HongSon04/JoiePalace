"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AdminSidebarItem({ item, size }) {
  const pathName = usePathname();

  const isActive = pathName === item.path;

  if (size === "small")
    return (
      <li
        item={item}
        className={`w-full flex-center items-center rounded-md !text-white`}
      >
        <Link
          href={item.path}
          className={`flex flex-1 flex-col justify-center gap-3 hover:glass rounded-md items-center text-white p-3 ${
            isActive ? "glass" : ""
          }`}
        >
          <Image src={item.icon} alt={item.title} className="w-6 h-6" />
          <span className="text-[10px] font-medium">{item.title}</span>
        </Link>
      </li>
    );

  return (
    <li
      item={item}
      className={`flex items-center p-2 hover:glass rounded-md !text-white mb-2 w-[300px] ${
        isActive ? "glass" : ""
      }`}
    >
      <div className="flex items-center gap-2 flex-1 text-white">
        <Image src={item.icon} alt={item.title} className="w-6 h-6 mr-2" />
        <Link href={item.path} className="text-white hover:text-white flex-1">
          {item.title}
        </Link>
      </div>
      {item.qty && (
        <span className="shrink-0 w-5 h-5 bg-red-400 text-sm text-white rounded-full flex-center">
          {item.qty}
        </span>
      )}
    </li>
  );
}

export default AdminSidebarItem;
