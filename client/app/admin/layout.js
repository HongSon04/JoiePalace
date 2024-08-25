import { Col, Row } from "antd";

function layout({ children }) {
  return (
    <div className="p-3 bg-primary min-h-screen">
      <Row>
        <Col span={4}>
          <h1 className="text-white">Admin Sidebar</h1>
        </Col>
        <Col span={20} className="text-white admin-panel">
          <h1>Admin Panel</h1>
          <main className="h-full">{children}</main>
        </Col>
      </Row>
    </div>
  );
}

export default layout;
