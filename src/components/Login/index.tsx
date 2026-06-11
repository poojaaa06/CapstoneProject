import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/context/appContext";
import type { FormProps } from "antd";
import { Checkbox, Form, Input } from "antd";
import CryptoJS from "crypto-js";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import { StyledLoginPage } from "./login.styled";
import StyledButton from "src/asserts/UI_components/ButtonComponent/button.styled";
import { ToastMessage } from "src/asserts/UI_components/ToastMessage.tsx/toastMessage.styled";
import { loginAPI } from "src/services/loginApi";
import { getSummaryAPI } from "src/services/summaryAPi";

const SECRET_KEY = "CagHKozTTJqLffF8KJChNp4926AQ8pRe"; //TODO: DO secret key needs to move to .env?

type FieldType = {
  user_unique_id?: string;
  user_password?: string;
  remember?: string;
};

type sessionId = string;

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUserDetails } = useAppContext();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const user_unique_id = values?.user_unique_id ? values.user_unique_id : "";
    const user_password = values?.user_password ? values.user_password : "";

    const encryptedPassword = CryptoJS.AES.encrypt(
      user_password,
      SECRET_KEY
    ).toString();

    const formData = {
      user_unique_id,
      user_password: encryptedPassword,
    };

    try {
      const response = await loginAPI(formData);
      const sessionId = response?.data.sessionId;
      if ((response && response?.status === 200) || response?.status === 201) {
        getSummary(sessionId);
      } else {
        ToastMessage.error("Please add valid credentials", 3);
      }
    } catch (err) {
      ToastMessage.error("Something went wrong please try again", 3);
    }
  };



  const getSummary = async (sessionId: sessionId) => {
    try {
      const summaryResponse = await getSummaryAPI(sessionId);
      if (summaryResponse) {
        //TODO: If response is success
        setUserDetails(summaryResponse.userSummary);
        sessionStorage.setItem(
          "userDetails",
          JSON.stringify(summaryResponse.userSummary),
        );
        console.log("res data", summaryResponse.userSummary);
        navigate("assets");
      } else {
        ToastMessage.error("Something went wrong please try again", 3);
      }
    } catch (error) {
      ToastMessage.error("Something went wrong please try again", 3);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    console.log("Failed:", errorInfo);
  };

  const actions: React.ReactNode[] = [
    <StyledButton onClick={() => alert("--------")}>
      Forget Password
    </StyledButton>,
    <StyledButton
      onClick={() => {
        navigate("/register");
      }}
    >
      Register
    </StyledButton>,
  ];

  return (
    <StyledLoginPage>
      <CustomCard title="Login" width={"300px"} actions={actions}>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
        
          <Form.Item<FieldType>
            label="Username"
            name="user_unique_id"
            rules={[
              {
                required: true,
                message: "Please enter a valid username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          

          <Form.Item<FieldType>
            label="Password"
            name="user_password"
            rules={[
              {
                required: true,
                message: "Please enter a valid username!",
              },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                message:
                  "Password must contain at least one uppercase letter and one special character!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          

          <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 0, span: 16 }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
            <StyledButton type="primary" htmlType="submit">
              Submit
            </StyledButton>
          </Form.Item>
        </Form>
      </CustomCard>
    </StyledLoginPage>
  );
}
