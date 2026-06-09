// StyledButton.tsx
import styled from "styled-components";
import { Button } from "antd";
import { ButtonProps } from "antd/es/button";

// Define custom props that extend AntD ButtonProps
interface CustomButtonProps extends ButtonProps {
  background?: string;
  hoverBackground?: string;
  hoverColor?: string;
  width?: string;
}

// Extend Ant Design's Button with styled-components and allow custom props
const StyledButtonComponent = styled(Button)<CustomButtonProps>`
  background-color: ${(props) => props.background || null};
  border-radius: 4px;
  padding: 0.5rem 1rem;
  border: none;
  width: ${(props) => props.width || "100%"};
  &:hover {
    background-color: ${(props) => props.hoverBackground || null};
    color: ${(props) => props.hoverColor || null};
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #bfbfbf;
    cursor: not-allowed;
  }
`;

// Create the common button component
const StyledButton = (props: CustomButtonProps) => {
  return <StyledButtonComponent {...props} />;
};

export default StyledButton;
