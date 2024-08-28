import { Col, Row } from "antd";
import 'fullpage.js/dist/fullpage.css';
import HeaderClient from "../_components/HeaderClient";
import Footer from "../_components/FooterClient";


function layout({ children }) {
  return (
    <div className="bg-primary min-h-screen">
      <Col className="text-white">
        <HeaderClient></HeaderClient>
        <main className="h-full">{children}</main>
        <Footer />
      </Col>
    </div>
  );
}

export default layout;
