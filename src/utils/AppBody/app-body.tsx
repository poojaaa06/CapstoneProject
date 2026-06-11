import React from "react";
import { Breadcrumb, theme } from "antd";
import { Content } from "antd/es/layout/layout";

const AppBody = (props: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content style={{ padding: "0 48px" }}>
      {/* TODO: Bred cramp this needs to be done a separate and reuseable component */}
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div
        style={{
          padding: 24,
          minHeight: 380,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        {props.children}
      </div>
    </Content>
  );
};

export default AppBody;
