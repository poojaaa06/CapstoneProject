import React from "react";
import { Button, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";

export const Inventory = () => {
  const navigate = useNavigate();
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <h1>Dashboard inprogress</h1>
        </Col>
        <Col span={12}>
          <Button onClick={() => navigate("/services")}>
            Back to services
          </Button>
        </Col>
      </Row>
    </>
  );
};
