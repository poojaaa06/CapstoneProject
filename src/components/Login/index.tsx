import React from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import CryptoJS from "crypto-js";
import {
  Card,
  Form,
  Input,
  Checkbox,
  Button,
  Row,
  Col,
  Typography,
  notification,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
 
import { useAppContext } from "src/context/appContext";
import { loginSchema } from "src/validations/loginSchema";
import { loginAPI } from "src/services/loginApi";
import { getSummaryAPI } from "src/services/summaryAPi";
import {
  LoginFormValues,
  LoginApiResponse,
  SummaryApiResponse,
} from "src/types/auth.type";
 
import "./login.css";
 
const SECRET_KEY: string = process.env.REACT_APP_SECRET_KEY ?? "";
 
const initialValues: LoginFormValues = {
  user_unique_id: "",
  user_password: "",
  remember: true,
};
 
const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setUserDetails } = useAppContext();
 
  const fetchSummary = async (sessionId: string): Promise<void> => {
    try {
      const summary: SummaryApiResponse = await getSummaryAPI(sessionId);
 
      setUserDetails(summary.userSummary);
 
      sessionStorage.setItem(
        "userDetails",
        JSON.stringify(summary.userSummary),
      );
 
      sessionStorage.setItem("sessionId", sessionId);
 
      navigate("/dashboard", { replace: true });
    } catch {
      notification.error({
        message: "Unable to load your profile. Please try again.",
      });
    }
  };
 
  const formik = useFormik<LoginFormValues>({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      if (!SECRET_KEY) {
        notification.error({
          message: "Configuration error. Contact support.",
        });
        return;
      }
 
      const encryptedPassword: string = CryptoJS.AES.encrypt(
        values.user_password,
        SECRET_KEY,
      ).toString();
 
      try {
        const response = await loginAPI({
          user_unique_id: values.user_unique_id,
          user_password: encryptedPassword,
        });
 
        const data: LoginApiResponse | undefined = response?.data;
 
        if (
          response &&
          [200, 201].includes(response.status) &&
          data?.sessionId
        ) {
          await fetchSummary(data.sessionId);
        } else {
          notification.error({
            message: "Invalid credentials.",
          });
        }
      } catch {
        notification.error({
          message: "Something went wrong. Please try again.",
        });
      }
    },
  });
 
  return (
    <main className="lp-wrapper" aria-labelledby="lp-title">
      <Row justify="center" align="middle" className="lp-row">
        <Col xs={24} sm={20} md={14} lg={10} xl={8}>
          <Card className="lp-card" variant="outlined">
            <Typography.Title
              level={1}
              id="lp-title"
              className="lp-title"
            >
              Login
            </Typography.Title>
 
            <p className="lp-subtitle">
              Use your account credentials
            </p>
 
            <Form
              layout="vertical"
              onFinish={() => formik.handleSubmit()}
              noValidate
            >
              <Form.Item
                label="Username"
                htmlFor="user_unique_id"
                validateStatus={
                  formik.touched.user_unique_id &&
                  formik.errors.user_unique_id
                    ? "error"
                    : ""
                }
                help={
                  formik.touched.user_unique_id &&
                  formik.errors.user_unique_id
                }
              >
                <Input
                  id="user_unique_id"
                  name="user_unique_id"
                  prefix={<UserOutlined aria-hidden />}
                  autoComplete="username"
                  aria-label="Username"
                  aria-required="true"
                  value={formik.values.user_unique_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
 
              <Form.Item
                label="Password"
                htmlFor="user_password"
                validateStatus={
                  formik.touched.user_password &&
                  formik.errors.user_password
                    ? "error"
                    : ""
                }
                help={
                  formik.touched.user_password &&
                  formik.errors.user_password
                }
              >
                <Input.Password
                  id="user_password"
                  name="user_password"
                  prefix={<LockOutlined aria-hidden />}
                  autoComplete="current-password"
                  aria-label="Password"
                  aria-required="true"
                  value={formik.values.user_password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
 
              <Form.Item>
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={formik.values.remember}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "remember",
                      e.target.checked,
                    )
                  }
                >
                  Remember me
                </Checkbox>
              </Form.Item>
 
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="lp-submit"
                  loading={formik.isSubmitting}
                  aria-label="Sign in to your account"
                >
                  Sign in
                </Button>
              </Form.Item>
 
              <div className="lp-actions-row">
                <Button
                  type="link"
                  className="lp-link-btn"
                  onClick={() => alert("forgot-password")}
                >
                  Forgot password?
                </Button>
 
                <Button
                  type="link"
                  className="lp-link-btn"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </main>
  );
};
 
export default LoginPage;
 