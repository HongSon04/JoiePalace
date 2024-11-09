'use client'
import { Col, Row } from "antd";
import "fullpage.js/dist/fullpage.css";
import HeaderClient from "../_components/HeaderClient";
import { SessionProvider } from "next-auth/react";

function layout({ children }) {
  return (
    <div className="main-layout bg-primary min-h-screen">
      <Col className="text-white">
        <HeaderClient></HeaderClient>
        <main className="h-full">
          <SessionProvider>{children}</SessionProvider>
        </main>
      </Col>
    </div>
  );
}

export default layout;
