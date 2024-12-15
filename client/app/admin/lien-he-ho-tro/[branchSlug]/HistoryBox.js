import Image from "next/image";
import emptyMailBox from "@/public/empty-mailbox-svgrepo-com.svg";

function HistoryBox() {
  return (
    <div className="mt-8">
      <h1 className="text-white">Lịch sử</h1>
      <Image src={emptyMailBox} alt="empty mail box" height={100} width={100} />
      <div></div>
    </div>
  );
}

export default HistoryBox;
