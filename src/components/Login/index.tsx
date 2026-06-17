import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
//import CryptoJS from "crypto-js";
import {
  App,
  Card,
  Form as AntForm,
  Input,
  Checkbox,
  Button,
  Typography,
  //notification
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

import { useAppContext } from "src/context/appContext";
import { loginSchema } from "src/validations/loginSchema";
import { loginAPI } from "src/services/loginApi";
import { getSummaryAPI } from "src/services/summaryAPi";
import {
  LoginFormValues,
  LoginApiResponse,
  UserSummary,
} from "src/types/auth.type";

import "./login.css";

const SECRET_KEY: string = process.env.REACT_APP_SECRET_KEY ?? "";

const initialValues: LoginFormValues = {
  user_unique_id: "",
  user_password: "",
  remember: true,
};

const LoginPage: React.FC = () => {
  const { notification } = App.useApp();

  const navigate = useNavigate();
  const { setUserDetails } = useAppContext();

  const fetchSummary = async (sessionId: string): Promise<void> => {
    try {
      const response = await getSummaryAPI(sessionId);

      const summaryData =
        response?.data?.userSummary || response?.data?.data?.userSummary;

      console.log("Summary data received:", summaryData);

      if (summaryData) {
        const sessionUserDetails: UserSummary = {
          user_unique_id: summaryData.user_unique_id,
          user_first_name: summaryData.user_first_name,
          user_middle_name: summaryData.user_middle_name || "",
          user_last_name: summaryData.user_last_name,
          user_email: summaryData.user_email,
          user_phone: summaryData.user_phone,
          user_img: summaryData.user_img || "",
          user_image: summaryData.user_img || "",
          user_bio: summaryData.user_bio || "",
          user_country: summaryData.user_country || "",
          user_state: summaryData.user_state || "",
          user_city: summaryData.user_city || "",
          user_pincode: summaryData.user_pincode || "",
          user_landmark: summaryData.user_landmark || "",
          user_address: summaryData.user_address || "",
          user_gender: summaryData.user_gender,
          user_dob: summaryData.user_dob,
          prefix: summaryData.prefix || "91",

          roles: summaryData.roles || [],

          services: summaryData.services || [],
        };

        sessionStorage.setItem(
          "userDetails",
          JSON.stringify(sessionUserDetails),
        );

        sessionStorage.setItem("sessionId", sessionId);

        setUserDetails(sessionUserDetails);

        navigate("/dashboard", { replace: true });
      } else {
        notification.error({
          message: "User profile mismatch.",
        });
      }
    } catch (error) {
      console.error("Fetch summary error:", error);

      notification.error({
        message: "Unable to load your profile. Please try again.",
      });
    }
  };

  return (
    <main className="lp-wrapper" aria-labelledby="lp-title">
      <Card className="lp-card" variant="outlined">
        <Typography.Title level={1} id="lp-title" className="lp-title">
          Login
        </Typography.Title>

        <p className="lp-subtitle">Use your account credentials</p>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            if (!SECRET_KEY) {
              notification.error({
                message: "Configuration error. Contact support.",
              });
              return;
            }

            // const encryptedPassword = CryptoJS.AES.encrypt(
            //   values.user_password,
            //   SECRET_KEY,
            // ).toString();

            try {
              const response = await loginAPI({
                user_unique_id: values.user_unique_id,
                user_password: values.user_password,
              });

              const data: LoginApiResponse | undefined = response?.data;

              if (
                response &&
                [200, 201].includes(response.status) &&
                data?.sessionId
              ) {
                notification.success({
                  message: "Login Successful",
                  description: "Welcome back!",
                  placement: "topRight",
                  duration: 2,
                  onClose: async () => {
                    await fetchSummary(data.sessionId);
                  },
                });
              } else {
                notification.error({
                  message: "Invalid credentials.",
                });
              }
            } catch (error: any) {
              notification.error({
                message:
                  error.message ||
                  "Something went wrong. Please try again.",
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <AntForm.Item
                label="Username"
                validateStatus={
                  touched.user_unique_id && errors.user_unique_id
                    ? "error"
                    : ""
                }
                help={
                  touched.user_unique_id
                    ? errors.user_unique_id
                    : undefined
                }
              >
                <Input
                  id="user_unique_id"
                  name="user_unique_id"
                  prefix={<UserOutlined aria-hidden />}
                  autoComplete="username"
                  aria-label="Username"
                  aria-required="true"
                  value={values.user_unique_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntForm.Item>

              <AntForm.Item
                label="Password"
                validateStatus={
                  touched.user_password && errors.user_password
                    ? "error"
                    : ""
                }
                help={
                  touched.user_password
                    ? errors.user_password
                    : undefined
                }
              >
                <Input.Password
                  id="user_password"
                  name="user_password"
                  prefix={<LockOutlined aria-hidden />}
                  autoComplete="current-password"
                  aria-label="Password"
                  aria-required="true"
                  value={values.user_password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </AntForm.Item>

              <AntForm.Item>
                <Checkbox
                  id="remember"
                  name="remember"
                  checked={values.remember}
                  onChange={(e) =>
                    setFieldValue("remember", e.target.checked)
                  }
                >
                  Remember me
                </Checkbox>
              </AntForm.Item>

              <AntForm.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="lp-submit"
                  loading={isSubmitting}
                  aria-label="Sign in to your account"
                >
                  Sign in
                </Button>
              </AntForm.Item>

              <div className="lp-actions-row">
                <Button
                  type="link"
                  className="lp-link-btn"
                  onClick={() => navigate("/forgot-password")}
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
          )}
        </Formik>
      </Card>
    </main>
  );
};

export default LoginPage;
