"use client";

import { Col, Row } from "antd";

function FeedbackItem({ feedback }) {
  return (
    <Row>
      <Col span={12}>{feedback.feedback}</Col>
      <Col span={3}>{feedback.bookingId}</Col>
      <Col span={3}>{feedback.satisLevel}</Col>
      <Col span={3}>{feedback.dateTime}</Col>
      <Col span={3}>Hành động</Col>
    </Row>
  );
}

export default FeedbackItem;
