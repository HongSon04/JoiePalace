"use client";

import { formatRelativeTime } from "../_utils/formaters";
// import customer components
import IconButton from "./IconButton";
import TextButton from "./TextButton";
import { XMarkIcon } from "@heroicons/react/24/outline";

function Notification({ notification }) {
  // newOrder,
  // contact,
  // eventSchedule,
  // payment,
  // partyUpdate,
  // dailyRemind,
  // feedback,
  // other;
  const _type = {
    newOrder: "border-red-500",
    contact: "border-blue-500",
    eventSchedule: "border-purple-500",
    payment: "border-blue-700",
    partyUpdate: "border-yellow-500",
    dailyRemind: "border-green-500",
    feedback: "border-gray-500",
    other: "border-gray-700",
  }[notification.type];

  return (
    <div
      className={`notification border-solid border-l-4 ${_type} flex justify-between items-center gap-5 p-3 bg-whiteAlpha-100 mb-3`}
    >
      <div className="flex-1">
        <h1 className="text-base font-bold">{notification.title}</h1>
        <p className="text-[10px] my-2 text-gray-400">
          {formatRelativeTime(notification.dateTime)}
        </p>
        <p className="text-sm">{notification.content}</p>
      </div>
      <div className="flex flex-col items-end justify-between gap-8 h-full">
        <IconButton className="icon-button" background={"none"} size="xxsm">
          {<XMarkIcon />}
        </IconButton>
        <TextButton className="text-button">Xem</TextButton>
      </div>
    </div>
  );
}

export default Notification;
