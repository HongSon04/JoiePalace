import AdminHeader from "@/app/_components/AdminHeader";
import FeedbackBreadcrumbs from "../FeedbackBreadcrumbs";
import FeedbackTabs from "../FeedbackTabs";

export const metadata = {
  title: "Quản lý phản hồi & đánh giá",
  description:
    "Quản lý phản hồi và đánh giá từ khách hàng đến nhà hàng tiệc cưới Joie Palace",
};

function Page() {
  return (
    <div>
      <AdminHeader title="Phản hồi & đánh giá" />
      <FeedbackBreadcrumbs />
      <FeedbackTabs />  
    </div>
  );
}

export default Page;
