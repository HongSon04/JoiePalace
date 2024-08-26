// import custom components
import IconButton from "./IconButton";

// import next components
import Image from "next/image";

// import icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import notificationIcon from "@/public/thong-bao.svg";
import dashboardIcon from "@/public/bang-dieu-khien.svg";
import SearchForm from "./SearchForm";

function AdminHeader({
  title,
  showBackButton = true,
  showHomeButton = true,
  showNotificationButton = true,
  showSearchForm = true,
}) {
  return (
    <div className="admin-header flex w-full justify-between items-center gap-5">
      {showBackButton && (
        <IconButton>
          <ArrowLeftIcon width={20} height={20} />
        </IconButton>
      )}
      <h1 className="text-2xl font-bold leading-8 flex-1 text-left">{title}</h1>
      <div className="flex items-center gap-5">
        {showSearchForm && <SearchForm />}
        {showHomeButton && (
          <IconButton>
            <Image
              src={dashboardIcon}
              width={20}
              height={20}
              alt="icon dashboard"
            />
          </IconButton>
        )}
        {showNotificationButton && (
          <IconButton>
            <Image
              src={notificationIcon}
              width={20}
              height={20}
              alt="icon notification"
            />
          </IconButton>
        )}
      </div>
    </div>
  );
}

export default AdminHeader;
