import { Col, Row } from "antd";
import 'fullpage.js/dist/fullpage.css';

function layout({ children }) {
  return (
    <div className="bg-primary min-h-screen">
      <Col className="text-white">
        <main className="h-full">{children}</main>
      </Col>
    </div>
  );
}

export default layout;
