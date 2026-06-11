import React, { useEffect, useState } from "react";
import {
  ProductOutlined,
  PartitionOutlined,
  GoldOutlined,
  DashboardOutlined,
  IdcardOutlined,
  TransactionOutlined,
  CodepenOutlined,
  ContainerOutlined,
  ScheduleOutlined,
  SolutionOutlined,
  ExceptionOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Drawer, Layout, Menu, theme } from "antd";
import AppHeader from "./utils/AppHeader/app-header";
import { useAppContext } from "./context/appContext";
import { UserSummary } from "./interfaces/summaryInterface";
import { allAllowedServices } from "./utils/constants";
import { useLocation, useNavigate } from "react-router-dom";

const { Content, Footer, Sider } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { userDetails, isMobile } = useAppContext();
  const [userServices, setUserServices] = useState<
    UserSummary["services"] | null
  >(userDetails?.services);
  const [collapsed, setCollapsed] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const routerLocation = useLocation();

  type Service = (typeof allAllowedServices)[number];
  const navigate = useNavigate();
  const iconMapping: Record<Service, React.ReactNode> = {
    "Manage Machines 3D": <CodepenOutlined />,
    "Maintenance Orders": <ScheduleOutlined />,
    "Work Instructions": <SolutionOutlined />,
    Procurement: <ExceptionOutlined />,
    Reports: <ContainerOutlined />,
    Services: <ProductOutlined />,
    Analytics: <PartitionOutlined />,
    Profile: <IdcardOutlined />,
    Events: <GoldOutlined />,
    Dashboard: <DashboardOutlined />,
    Notifications: <IdcardOutlined />,
    "My Requests": <IdcardOutlined />,
    Rewards: <TransactionOutlined />,
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  function generateSideMenuItems(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode
  ) {
    return {
      key,
      label,
      icon,
    };
  }

  useEffect(() => {
    // Generate items using the services array from summary.json
    setUserServices(userDetails?.services);
  }, [userDetails?.services]);

  let servicesFromDB = userServices;
  if (!servicesFromDB?.includes("Services")) {
    //TODO: these service need to come from BE and Service need to be first
    servicesFromDB?.unshift("Services");
  }
  const items = servicesFromDB
    ?.filter((service: string) => allAllowedServices?.includes(service)) // Only include allowed services
    .map((service, index) =>
      generateSideMenuItems(
        service,
        `${index + 1}`,
        iconMapping[service as Service]
      )
    );

  const { setIsMobile } = useAppContext();
  // Detect screen size to toggle mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile view for width <= 768px
    };
    handleResize(); // Set initially
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {//refresh when
    // Determine the selected menu item based on the current URL
    // const currentPath = routerLocation.pathname.toLocaleLowerCase();
    // const matchedItem = items?.find(
    //   (item) =>
    //     typeof item.label === "string" &&
    //     currentPath.includes(item?.label?.toLocaleLowerCase())
    // );
    // if (matchedItem) {
    //   setSelectedKey(String(matchedItem.key));
    // }

    if (routerLocation.pathname === "/assets") {
      // need to update this and below one in BP code
      setSelectedKey(String(1));
    } else if (routerLocation.pathname === "/maintenance-orders") {
      setSelectedKey(String(2));
    } else if (routerLocation.pathname === "/work-instructions") {
      setSelectedKey(String(3));
    } else if (routerLocation.pathname === "/requests") {
      setSelectedKey(String(4));
    } else if (routerLocation.pathname === "/profile") {
      setSelectedKey(String(5));
    }
  }, [routerLocation?.pathname, items]);

  const handleMenuClick = (e: any) => {
    if (!items) return;

    if (items[e.key - 1]?.key == "1") {
      navigate("/assets");
      setSelectedKey(String(1));
    } else if (items[e.key - 1]?.key == "2") {
      navigate("/maintenance-orders");
      setSelectedKey(String(2));
    } else if (items[e.key - 1]?.key == "3") {
      navigate("/work-instructions");
      setSelectedKey(String(3));
    } else if (items[e.key - 1]?.key == "4") {
      navigate("/dashboard");
      setSelectedKey(String(4));
    } else if (items[e.key - 1]?.key == "5") {
      navigate("/profile");
      setSelectedKey(String(6));
    }
    setOpenMobileMenu(!openMobileMenu);
    // const navigatePath: string =
    //   String(items[e.key - 1]?.label).toLocaleLowerCase() ?? "";
    // navigate(navigatePath);
    // setSelectedKey(e.key); // Update the selected key
  };

  const sideMenuList = () => {
    return (
      <Menu
        theme="dark"
        selectedKeys={[selectedKey]}
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items ?? []}
        onClick={handleMenuClick}
      />
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <AppHeader
        setOpenMobileMenu={setOpenMobileMenu}
        openMobileMenu={openMobileMenu}
      />
      <Layout>
        {isMobile ? (
          <Drawer
            placement="left"
            closable
            onClose={() => {
              setOpenMobileMenu(!openMobileMenu);
            }}
            open={openMobileMenu}
            headerStyle={{ backgroundColor: "#001529" }} //TODO
            bodyStyle={{ padding: 0, backgroundColor: "#001529" }}
            closeIcon={
              <span style={{ color: "#fff", fontSize: "18px" }}>✕</span>
            }
          >
            {sideMenuList()}
          </Drawer>
        ) : (
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical" />
            {sideMenuList()}
          </Sider>
        )}
        <Layout>
          <Content style={{ margin: "0 16px" }}>
            {/* TODO dynamic breadcrumb */}
            {/* <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Services</Breadcrumb.Item>
              <Breadcrumb.Item>Overview</Breadcrumb.Item>
            </Breadcrumb> */}
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Deloitte. ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
