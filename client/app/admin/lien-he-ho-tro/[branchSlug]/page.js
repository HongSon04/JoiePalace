"use client";

import AdminHeader from "@/app/_components/AdminHeader";

import SupportForm from "./SupportForm";
import HistoryBox from "./HistoryBox";
import { Col, Row } from "antd";

function Page({ params: branchSlug }) {
  return (
    <div>
      <AdminHeader title="Liên hệ hỗ trợ" />
      <Row gutter={[20, 20]}>
        <Col span={10}>
          <SupportForm />
        </Col>
        <Col span={14}>
          <HistoryBox />
        </Col>
      </Row>
    </div>
  );
}

export default Page;
