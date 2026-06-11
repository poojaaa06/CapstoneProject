import React from "react";
import { useNavigate } from "react-router-dom";
import "./app-header.css";
import {
  UserOutlined,
  BellOutlined,
  MenuOutlined,
  OpenAIOutlined,
} from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { Button, Switch } from "antd";
import { useTheme } from "../../../src/theme/antdTheme";
import { Avatar } from "antd";
import { useAppContext } from "src/context/appContext";
import CustomPopover from "src/asserts/UI_components/PooverComponent/popver.styled";

// TODO: Required?
const size = {
  mobileL: "320px",
  tablet: "768px",
  laptop: "1024px",
  laptopL: "1440px",
  desktop: "2560px",
};

export const device = {
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop: `(min-width: ${size.laptop})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
  desktopL: `(min-width: ${size.desktop})`,
};

// const items = new Array(6).fill(null).map((_, index) => ({
//   key: index + 1,
//   label: `nav ${index + 1}`,
// }));

const AppHeader = (props: any) => {
  const { toggleTheme } = useTheme();
  const { setOpenMobileMenu, openMobileMenu } = props;
  const { userDetails, isMobile, setOpenProfile } = useAppContext();

   const navigate = useNavigate();

  const logoutHandler = () => {
    sessionStorage.removeItem("userDetails");
    navigate("/", { replace: true });
    }

  const ProfilePopoverContent = () => {
  
    return (
      <div style={{ padding: "8px" }}>
        <p>
          For more profile details,{" "}
          <a href="/profile" style={{ textDecoration: "underline" }}>
            click here
          </a>
          .
        </p>
        <div
          style={{
            borderTop: "1px solid #f0f0f0",
            marginTop: "8px",
            paddingTop: "8px",
          }}
        >
          <Button type="primary" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="demo-logo">
          {isMobile && (
            <div
              style={{
                display: "inline-block",
                position: "relative",
                bottom: 8,
                right: 26,
              }}
            >
              <Avatar
                icon={<MenuOutlined />}
                onClick={() => setOpenMobileMenu(!openMobileMenu)}
              />
            </div>
          )}
          {/* <Avatar
            size={"large"}
            icon={<OpenAIOutlined />}
            onClick={() => setOpenMobileMenu(!openMobileMenu)}
          /> */}
          <div style={{ display: "inline-block", marginTop: 16 }}>
            <img
              src="/icons/deloittelogo.svg"
              alt="Deloitte"
              style={{ height: "24px" }}
            />
          </div>
        </div>
        {/* <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        /> */}
        <div>
          <CustomPopover
            content={<ProfilePopoverContent />}
            title={"Hi " + userDetails?.user_first_name}
            trigger="hover"
            placement="bottom"
          >
            <Avatar
              style={{ cursor: "pointer" }}
              icon={<UserOutlined />}
              onClick={() => setOpenProfile(true)}
            />
          </CustomPopover>
          {/* <CustomPopover
            content={<div>This is a helpful popover message.</div>}
            title={"Notifications"}
            trigger="hover"
            placement="bottom"
          >
            <Avatar style={{ cursor: "pointer" }} icon={<BellOutlined />} />
          </CustomPopover> */}
          {/* <Switch onChange={toggleTheme} /> */}
        </div>
      </Header>
    </>
  );
};

export default AppHeader;
