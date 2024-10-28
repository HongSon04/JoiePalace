// import custom components
import AdminHeader from "@/app/_components/AdminHeader";

function Page({ params: { branchSlug } }) {
  console.log(branchSlug);

  return (
    <div>
      <AdminHeader title={"Thông báo"} showSearchForm={false} />
    </div>
  );
}

export default Page;
