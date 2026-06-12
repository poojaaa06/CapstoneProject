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
      const response = await getSummaryAPI(sessionId);

      const summaryData =
        response?.data?.userSummary ||
        response?.data?.data?.userSummary;

      console.log("Summary data received:", summaryData);

      if (summaryData) {
        const sessionUserDetails = {
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
          user_address: summaryData.user_address || [],
          user_gender: summaryData.user_gender,
          user_dob: summaryData.user_dob,
          prefix: summaryData.prefix || "91",

          roles: ["admin"],

          services: [
            "Manage Machines 3D",
            "Maintenance Orders",
            "Work Instructions",
            "Procurement",
            "My Requests",
            "Services",
            "Dashboard",
            "Profile",
            "Events",
            "Analytics",
            "Rewards",
          ],
        };

        sessionStorage.setItem(
          "userDetails",
          JSON.stringify(sessionUserDetails)
        );

        sessionStorage.setItem("sessionId", sessionId);

        setUserDetails(sessionUserDetails);

        navigate("/dashboard", { replace: true });
      } else {
        throw new Error("No user summary found");
      }
    } catch (error) {
      console.error("Fetch summary error:", error);

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

      const encryptedPassword = CryptoJS.AES.encrypt(
        values.user_password,
        SECRET_KEY
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
                  e.target.checked
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
      </Card>
    </main>
  );
};

export default LoginPage;