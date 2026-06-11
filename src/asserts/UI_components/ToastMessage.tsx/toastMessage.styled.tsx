import { message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, WarningOutlined, LoadingOutlined } from "@ant-design/icons";

export const ToastMessage = (() => {
  const defaultDuration = 3; // Default duration for messages

  const showToast = (content: string, type: "success" | "error" | "info" | "warning" | "loading", duration: number = defaultDuration) => {
    const icons = {
      success: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      error: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
      info: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
      warning: <WarningOutlined style={{ color: "#faad14" }} />,
      loading: <LoadingOutlined style={{ color: "#595959" }} />,
    };

    message.open({
      content: content,
      duration,
      icon: icons[type],
    });
  };

  return {
    success: (content: string, duration?: number) => showToast(content, "success", duration),
    error: (content: string, duration?: number) => showToast(content, "error", duration),
    info: (content: string, duration?: number) => showToast(content, "info", duration),
    warning: (content: string, duration?: number) => showToast(content, "warning", duration),
    loading: (content: string, duration?: number) => showToast(content, "loading", duration),
  };
})();
