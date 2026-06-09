import React, { useEffect, useRef } from "react";
import { Row, Col, Typography, Modal } from "antd";


const { Title } = Typography;

type Model = {
  title: string;
  modelName: string;
};



const Assets: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Title level={3} style={{ marginTop: 0 }}>
        Dashboard
      </Title>
      <Row gutter={[24, 24]}>
       
      </Row>
    </div>
  );
};

export default Assets;

