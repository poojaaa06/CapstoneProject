import React from "react";
import { Col, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import {
  BarChartOutlined,
  CodepenOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Text, Link } = Typography;
interface Service {
  name: string;
  url: string;
}

interface ServicesProps {
  services: Service[];
}
export const UserServices = () => {
  const services = [
    //TODO:this will be replaced with BE API
    { name: "Inventory Management", url: "/inventory" },
    { name: "Sales Tracking", url: "/sales" },
    { name: "Out of Stock Alerts", url: "/out-of-stock" },
    { name: "Store Analytics", url: "/analytics" },
  ];

  const navigate = useNavigate();

  const handleCardClick = (url: string) => {
    navigate(url);
  };

  const serviceStyleMapping: any = {
    "Inventory Management": {
      color: "#6AB187",
      icon: <CodepenOutlined />,
    },
    "Sales Tracking": { color: "#488a99", icon: <SettingOutlined /> },
    "Out of Stock Alerts": { color: "#DBAE58", icon: <UserOutlined /> },
    "Store Analytics": { color: "#546E7A", icon: <BarChartOutlined /> },
    // Add more services as needed
  };

  return (
    <Row gutter={[16, 16]}>
      {services.map((service, index) => {
        const { color, icon } = serviceStyleMapping[service.name] || {
          color: "#c5c5c5",
          icon: <CodepenOutlined />,
        }; // Default values

        return (
          <Col key={index} span={8} xs={24} md={12} lg={8}>
            <CustomCard
              backgroundColor={color}
              hoverable
              onClick={() => handleCardClick(service.url)}
              style={{ cursor: "pointer" }}
              height={"50"}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Text> {icon}</Text>
                <Text>{service.name}</Text>
              </div>
            </CustomCard>
          </Col>
        );
      })}
    </Row>
  );
};
