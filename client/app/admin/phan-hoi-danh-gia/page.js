import AdminHeader from "@/app/_components/AdminHeader";
import FeedbackBreadcrumbs from "./FeedbackBreadcrumbs";
import FeedbackTabs from "./FeedbackTabs";

function Page() {
  return (
    <div>
      <AdminHeader title="Phản hồi đánh giá" />
      <FeedbackBreadcrumbs />
      <FeedbackTabs />
    </div>
  );
}

export default Page;
