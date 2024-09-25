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
import AdminSidebarButton from "./AdminSidebarButton";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../_lib/features/sidebar/sidebarSlice";

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

  const { size } = useSelector((state) => state.sidebar);
  const dispatch = useDispatch();
  const onSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="admin-header flex w-full justify-between items-center gap-5 relative z-40">
      <AdminSidebarButton
        onSidebar={onSidebar}
        size={size}
        // className={"absolute"}
      />
      {showBackButton && (
        <IconButton onClick={handleBack}>
          <ArrowLeftIcon width={20} height={20} className="text-gray-600" />
        </IconButton>
      )}
      <h1 className="text-2xl font-bold leading-8 flex-1 text-left text-gray-600">
        {title}
      </h1>
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
