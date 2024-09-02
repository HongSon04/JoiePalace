"use client";

// import custom components
import IconButton from "./IconButton";

// import next components
import Image from "next/image";

// import icons
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import dashboardIcon from "@/public/bang-dieu-khien.svg";
import SearchForm from "./SearchForm";
import NotificationButton from "./NotificationButton";
import { useRouter } from "next/navigation";

function AdminHeader({
  title,
  showBackButton = true,
  showHomeButton = true,
  showNotificationButton = true,
  showSearchForm = true,
}) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleDashboard = () => {
    router.replace("/admin/bang-dieu-khien");
  };

  return (
    <div className="admin-header flex w-full justify-between items-center gap-5">
      {showBackButton && (
        <IconButton onClick={handleBack}>
          <ArrowLeftIcon width={20} height={20} />
        </IconButton>
      )}
      <h1 className="text-2xl font-bold leading-8 flex-1 text-left">{title}</h1>
      <div className="flex items-center gap-5 relative">
        {showSearchForm && <SearchForm />}
        {showHomeButton && (
          <IconButton onClick={handleDashboard}>
            <Image
              src={dashboardIcon}
              width={20}
              height={20}
              alt="icon dashboard"
            />
          </IconButton>
        )}
        {showNotificationButton && <NotificationButton />}
      </div>
    </div>
  );
}

export default AdminHeader;
