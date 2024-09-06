import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatDateTime } from "../_utils/formaters";
import CustomPagination from "./CustomPagination";

function RequestTable({ filter }) {
  const pathname = usePathname();

  const requests = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0123456789",
      email: "a@gmail.com",
      numsOfGuests: 300,
      expectedDate: "2024-08-28T00:00:00.000Z",
      status: 1,
    },
    {
      id: 2,
      name: "Nguyễn Văn B",
      phone: "0123456789",
      email: "b@gmail.com",
      numsOfGuests: 300,
      expectedDate: "2024-08-28T00:00:00.000Z",
      status: 2,
    },
    {
      id: 3,
      name: "Nguyễn Văn C",
      phone: "0123456789",
      email: "c@gmail.com",
      numsOfGuests: 300,
      expectedDate: "2024-08-28T00:00:00.000Z",
      status: 2,
    },
    {
      id: 4,
      name: "Nguyễn Văn D",
      phone: "0123456789",
      email: "d@gmail.com",
      numsOfGuests: 300,
      expectedDate: "2024-08-28T00:00:00.000Z",
      status: 1,
    },
    {
      id: 5,
      name: "Nguyễn Văn E",
      phone: "0123456789",
      email: "e@gmail.com",
      numsOfGuests: 300,
      expectedDate: "2024-08-28T00:00:00.000Z",
      status: 1,
    },
  ];

  const filteredRequests = requests.filter((item) => item.value == filter);

  return (
    <>
      <table className="mt-5 table">
        <thead>
          <tr>
            <th className="text-left">Mã yêu cầu</th>
            <th className="text-left">Tên khách hàng</th>
            <th className="text-left">Số điện thoại</th>
            <th className="text-left">Email</th>
            <th className="text-left">Trạng thái</th>
            <th className="text-left">Ngày tạo</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request, index) => (
            <tr key={index}>
              <td>{request.id}</td>
              <td>{request.name}</td>
              <td>{request.phone}</td>
              <td>{request.email}</td>
              <td>{request.status === 1 ? "Đã xác nhận" : "Chưa xác nhận"}</td>
              <td>{formatDateTime(request.expectedDate)}</td>
              <td className="flex-center">
                <Link
                  href={`${pathname}/${request.id}`}
                  className="text-cyan-400 hover:text-cyan-400 font-bold flex-center"
                >
                  Chi tiết
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <CustomPagination total={requests.length} />
    </>
  );
}

export default RequestTable;
