import React from "react";
import styled from "styled-components";
import { Card as AntCard, CardProps as AntCardProps } from "antd";

// Define props for customization, extending Ant Design's CardProps
interface CardProps extends AntCardProps {
  backgroundColor?: string;
  padding?: string;
  borderRadius?: string;
  shadow?: boolean;
  width?: string;
  minWidth?: string;
  height?: string;
}

// Styled Card component
const StyledCard = styled(AntCard)<CardProps>`
  background-color: ${(props) => props.backgroundColor || null};
  padding: ${(props) => props.padding || "20px"};
  border-radius: ${(props) => props.borderRadius || "8px"};
  width: ${(props) => props.width || "100%"};
  min-width: ${(props) => props.minWidth || "300px"}
  height: ${(props) => props.height || "auto"};
  box-shadow: ${(props) =>
    props.shadow ? "0 4px 8px rgba(0, 0, 0, 0.1)" : "none"};
`;

const CustomCard: React.FC<CardProps> = ({
  backgroundColor,
  padding,
  borderRadius,
  shadow = true,
  width,
  height,
  children,
  ...rest // Pass any additional props to AntCard
}) => {
  return (
    <StyledCard
      backgroundColor={backgroundColor}
      padding={padding}
      borderRadius={borderRadius}
      shadow={shadow}
      width={width}
      height={height}
      {...rest} // Pass additional props like title or extra
    >
      {children}
    </StyledCard>
  );
};

export default CustomCard;
