import AdminSidebar from "@/app/_components/AdminSidebar";

function layout({ children }) {
  return (
    <div className="p-3 bg-primary admin-main overflow-hidden">
      <div className="flex gap-5">
        <AdminSidebar />
        <div className="flex-1 admin-panel text-white max-h-[100vh]">
          <main className="h-full max-h-[100vh] overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default layout;
