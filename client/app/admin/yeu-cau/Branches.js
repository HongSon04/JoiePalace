import Branch from "@/app/_components/Branch";
import { Col, Row } from "antd";

import banner from "@/public/banner.png";
import banner2 from "@/public/banner2.png";

const initialBranches = [
  {
    id: 1,
    name: "Hoàng Văn Thụ",
    image: banner,
    address: "123 Hoàng Văn Thụ, Phường 4, Quận Tân Bình, TP.HCM",
    phone: "0123456789",
    email: "joiepalace.hoangvanthu@gmail.com",
    status: "active",
    slug: "hoang-van-thu",
  },
  {
    id: 2,
    image: banner2,
    name: "Lê Văn Sỹ",
    address: "123 Lê Vă Sỹ, Phường 4, Quận Tân Bình, TP.HCM",
    phone: "0123456789",
    email: "joiepalace.levansy@gmail.com",
    status: "active",
    slug: "le-van-sy",
  },
  {
    id: 3,
    image: banner2,
    name: "Phạm Văn Đồng",
    address: "123 Phạm Văn Đồng, Phường 4, Quận Tân Bình, TP.HCM",
    phone: "0123456789",
    email: "joiepalace.phamvandong@gmail.com",
    status: "active",
    slug: "pham-van-dong",
  },
];

function Branches() {
  return (
    <Row gutter={[16, 16]} className="mt-8">
      {initialBranches.map((branch) => (
        <Col span={8} key={branch.id}>
          <Branch branch={branch} />
        </Col>
      ))}
    </Row>
  );
}

export default Branches;
