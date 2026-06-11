import React from "react";
import { Popover } from "antd";

// CustomPopover Component
type CustomPopoverProps = {
  content: React.ReactNode;
  title?: string;
  children: React.ReactNode; // Trigger element
  trigger?: "hover" | "focus" | "click";
  placement?:
    | "top"
    | "left"
    | "right"
    | "bottom"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
  width?: string;
};

const CustomPopover: React.FC<CustomPopoverProps> = ({
  content,
  title,
  children,
  trigger = "hover",
  placement = "top",
}) => {
  return (
    <Popover
      content={content}
      title={title}
      trigger={trigger}
      placement={placement}
      overlayClassName="custom-popover"
    >
      {children}
    </Popover>
  );
};

export default CustomPopover;
