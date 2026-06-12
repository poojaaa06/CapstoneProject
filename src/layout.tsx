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
import { Drawer, Layout, Menu, theme } from "antd";
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
  const { userDetails, isMobile, setIsMobile } = useAppContext();
 
  const [userServices, setUserServices] = useState<
    UserSummary["services"] | null
  >(userDetails?.services);
 
  const [collapsed, setCollapsed] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
 
  const navigate = useNavigate();
  const routerLocation = useLocation();
 
  type Service = (typeof allAllowedServices)[number];
 
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
 
  const routeMap: Record<string, string> = {
    Dashboard: "/dashboard",
    Services: "/assets",
    "Maintenance Orders": "/maintenance-orders",
    "Work Instructions": "/work-instructions",
    "My Requests": "/requests",
    Profile: "/profile",
  };
 
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
 
  const generateSideMenuItems = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode
  ) => ({
    key,
    label,
    icon,
  });
 
  useEffect(() => {
    setUserServices(userDetails?.services);
  }, [userDetails?.services]);
 
  const servicesFromDB = [...(userServices || [])];
 
  if (!servicesFromDB.includes("Services")) {
    servicesFromDB.unshift("Services");
  }
 
  const items = servicesFromDB
    .filter((service: string) => allAllowedServices.includes(service))
    .map((service) =>
      generateSideMenuItems(
        service,
        service,
        iconMapping[service as Service]
      )
    );
 
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
 
    handleResize();
 
    window.addEventListener("resize", handleResize);
 
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setIsMobile]);
 
  useEffect(() => {
    const selectedService = Object.keys(routeMap).find(
      (service) => routeMap[service] === routerLocation.pathname
    );
 
    if (selectedService) {
      setSelectedKey(selectedService);
    }
  }, [routerLocation.pathname]);
 
  const handleMenuClick = (e: any) => {
    const route = routeMap[e.key];
 
    if (route) {
      navigate(route);
      setSelectedKey(e.key);
    }
 
    setOpenMobileMenu(false);
  };
 
  const sideMenuList = () => (
    <Menu
      theme="dark"
      selectedKeys={[selectedKey]}
      defaultSelectedKeys={["Dashboard"]}
      mode="inline"
      items={items}
      onClick={handleMenuClick}
    />
  );
 
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
            open={openMobileMenu}
            onClose={() => setOpenMobileMenu(false)}
            headerStyle={{ backgroundColor: "#001529" }}
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
 
 