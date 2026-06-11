import React from "react";
import { Row, Col, Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Result
            status="404"
            title="This is inprogress!"
            subTitle="Thank You"
            extra={[
              <Button
                type="primary"
                key="console"
                onClick={() => {
                  navigate("/assets");
                }}
              >
                Go Back
              </Button>,
            ]}
          />
        </Col>
      </Row>
    </div>
  );
};



export default Dashboard;
