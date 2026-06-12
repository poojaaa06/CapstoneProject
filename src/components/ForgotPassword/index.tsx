// alert("Forgot Password Page");

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Form, Input, Button, notification } from "antd";
import { MailOutlined, UserOutlined } from "@ant-design/icons";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import { forgotPasswordSchema } from "src/validations/forgotPasswordSchema";
import { forgotPasswordAPI } from "src/services/forgotPasswordAPI";
import type { ForgotPasswordFormValues } from "src/types/auth.type";
import "./forgotPassword.css";

const initialValues: ForgotPasswordFormValues = { user_unique_id: "" };

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const formik = useFormik<ForgotPasswordFormValues>({
    initialValues,
    validationSchema: forgotPasswordSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const res = await forgotPasswordAPI({
          user_unique_id: values.user_unique_id.trim(),
        });
        
        console.log("Forgot Password API response:", res);
        
        // Check if the response indicates success (handle both formats)
        const isSuccess = res?.success === true || res?.data?.success === true;
        
        if (isSuccess) {
          const message = res?.message || res?.data?.message || "Reset link sent to your email";
          
          api.success({
            message: "Reset Link Sent",
            description: message,
            placement: "topRight",
            duration: 3,
            onClose: () => {
              navigate("/", { replace: true });
            },
          });
          resetForm();
        } else {
          // Handle unsuccessful response
          const errorMessage = res?.message || res?.data?.message || "Please try again later.";
          api.error({
            message: "Unable to send reset link",
            description: errorMessage,
            placement: "topRight",
          });
        }
      } catch (err) {
        console.error("Forgot password error:", err);
        const description =
          err instanceof Error ? err.message : "Please try again later.";
        api.error({
          message: "Unable to send reset link",
          description,
          placement: "topRight",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <main className="forgot-password-page" aria-labelledby="fp-title">
      {contextHolder}
      <CustomCard className="forgot-password-card">
        <h1 id="fp-title" className="forgot-password-title">
          Forgot password
        </h1>
        <p className="forgot-password-subtitle">
          Enter your username and we&apos;ll send a reset link to your
          registered email.
        </p>

        <Form layout="vertical" onFinish={formik.handleSubmit} noValidate>
          <Form.Item
            label="Username"
            required
            validateStatus={formik.errors.user_unique_id ? "error" : ""}
            help={formik.errors.user_unique_id}
          >
            <Input
              name="user_unique_id"
              prefix={<UserOutlined aria-hidden />}
              placeholder="Enter your username"
              autoComplete="username"
              value={formik.values.user_unique_id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-label="Username"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            icon={<MailOutlined />}
            loading={formik.isSubmitting}
            className="forgot-password-submit"
            block
          >
            Send reset link
          </Button>

          <div className="forgot-password-footer">
            <Link to="/">← Back to login</Link>
          </div>
        </Form>
      </CustomCard>
    </main>
  );
};

export default ForgotPassword;