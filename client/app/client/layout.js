import { Col, Row } from "antd";

function layout({ children }) {
  return (
    <div className="p-3 bg-primary min-h-screen">
      <Col className="text-white">
        <main className="h-full">{children}</main>
      </Col>
    </div>
  );
}

export default layout;
