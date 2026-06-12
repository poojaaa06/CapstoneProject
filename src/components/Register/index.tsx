import React, { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, FormikHelpers, FormikProps } from "formik";
import * as Yup from "yup";
import dayjs, { Dayjs } from "dayjs";
import {
  Card,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Button,
  Row,
  Col,
  Steps,
  Typography,
  Upload,
  Avatar,
  message,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

import { registerAPI } from "src/services/registerAPI";
import { validateUsername } from "src/services/validateUsernameAPI";
import { validateEmail } from "src/services/validateEmailAPI";
import { validatePhone } from "src/services/validatePhoneAPI";
import {
  GENDER_OPTIONS,
  COUNTRY_OPTIONS,
} from "../../stubs/registerStubs";
import countryCodes from "src/utils/codes.json";

import "./register.css";

const { Title } = Typography;

const PHONE_PREFIX_OPTIONS = countryCodes.map((c) => ({
  value: c.countryTelephonyCode,
  label: `${c.shortCountryName} (${c.countryTelephonyCode})`,
}));

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface RegisterFormValues {
  user_unique_id: string;
  user_first_name: string;
  user_middle_name?: string;
  user_last_name: string;
  user_gender: string;
  user_dob: Dayjs | null;

  user_email: string;
  prefix: string;
  user_phone: string;
  user_password: string;
  confirm_password: string;

  user_bio?: string;
  user_img?: string;
  user_country: string;
  user_state?: string;
  user_city?: string;
  user_pincode?: string;
  user_landmark?: string;
  user_address?: string[];
  user_agreement: boolean;
}

const initialValues: RegisterFormValues = {
  user_unique_id: "",
  user_first_name: "",
  user_middle_name: "",
  user_last_name: "",
  user_gender: "",
  user_dob: null,
  user_email: "",
  prefix: "91",
  user_phone: "",
  user_password: "",
  confirm_password: "",
  user_bio: "",
  user_img: "",
  user_country: "",
  user_state: "",
  user_city: "",
  user_pincode: "",
  user_landmark: "",
  user_address: [],
  user_agreement: false,
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const minAge = 13;
const minDob = dayjs().subtract(minAge, "year");

// Use 'any' for schema type to avoid complex generic mismatches
const stepSchemas: any[] = [
  // Step 1: identity
  Yup.object({
    user_unique_id: Yup.string()
      .trim()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must be at most 50 characters")
      .matches(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
    user_first_name: Yup.string()
      .trim()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters")
      .matches(/^[a-zA-Z ]+$/, "First name must contain letters only"),
    user_middle_name: Yup.string()
      .trim()
      .max(50, "Middle name must be at most 50 characters")
      .matches(/^[a-zA-Z ]*$/, "Middle name must contain letters only"),
    user_last_name: Yup.string()
      .trim()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be at most 50 characters")
      .matches(/^[a-zA-Z ]+$/, "Last name must contain letters only"),
    user_gender: Yup.string().required("Please select your gender"),
    user_dob: Yup.mixed<Dayjs>()
      .required("Date of birth is required")
      .test("min-age", `You must be at least ${minAge} years old`, (value) =>
        value ? (value as Dayjs).isBefore(minDob) : false
      ),
  }),

  // Step 2: contact + credentials
  Yup.object({
    user_email: Yup.string()
      .trim()
      .required("Email is required")
      .email("Please enter a valid email"),
    prefix: Yup.string().required("Country code is required"),
    user_phone: Yup.string()
      .trim()
      .required("Phone number is required")
      .matches(/^\d{7,15}$/, "Phone must be 7–15 digits, numbers only"),
    user_password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
        "Password must include an uppercase letter, a number and a special character"
      ),
    confirm_password: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("user_password")], "Passwords do not match"),
  }),

  // Step 3: profile/address
  Yup.object({
    user_bio: Yup.string().max(200, "Bio cannot exceed 200 characters"),
    user_img: Yup.string(),
    user_country: Yup.string().required("Please select your country"),
    user_state: Yup.string().max(200, "State too long"),
    user_city: Yup.string().max(200, "City too long"),
    user_pincode: Yup.string().matches(
      /^\d{5,10}$/,
      "Pincode must be 5–10 digits"
    ),
    user_landmark: Yup.string().max(200, "Landmark too long"),
    user_address: Yup.array().of(Yup.string()),
    user_agreement: Yup.boolean().oneOf(
      [true],
      "You must accept the Terms & Conditions"
    ),
  }),
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const TOTAL_STEPS = 3;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(0);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Async server-side validators (debounced via blur)
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleUsernameBlur = useCallback(async (username: string) => {
    if (!username || username.length < 3) return;
    try {
      const res = await validateUsername(username);
      if (res?.success && res.usernameValidation?.exists) {
        setUsernameError("Username already exists, please choose another");
      } else {
        setUsernameError(null);
      }
    } catch (err) {
      console.error("Username validation failed:", err);
    }
  }, []);

  const handleEmailBlur = useCallback(async (email: string) => {
    if (!email) return;
    try {
      const res = await validateEmail(email);
      if (res?.success && res.emailValidation?.exists) {
        setEmailError("Email already exists, please use another");
      } else {
        setEmailError(null);
      }
    } catch (err) {
      console.error("Email validation failed:", err);
    }
  }, []);

  const handlePhoneBlur = useCallback(async (phone: string) => {
    if (!phone) return;
    try {
      const res = await validatePhone(phone);
      if (res?.success && res.phoneValidation?.exists) {
        setPhoneError("Phone number already registered");
      } else {
        setPhoneError(null);
      }
    } catch (err) {
      console.error("Phone validation failed:", err);
    }
  }, []);

  /* ----------------------- submit handler ------------------------- */

  const handleSubmit = async (
  values: RegisterFormValues,
  helpers: FormikHelpers<RegisterFormValues>
): Promise<void> => {
  // Block server-busy duplicates
  if (usernameError || emailError || phoneError) {
    message.error("Please resolve the highlighted errors before submitting.");
    return;
  }

  if (step < TOTAL_STEPS - 1) {
    setStep((s) => s + 1);
    helpers.setTouched({});
    helpers.setSubmitting(false);
    return;
  }

  setSubmitting(true);
  try {
    const userImg = values.user_img || "";
    
    const payload = {
      user_unique_id: values.user_unique_id,
      user_first_name: values.user_first_name,
      user_middle_name: values.user_middle_name || undefined,
      user_last_name: values.user_last_name,
      user_email: values.user_email,
      user_password: values.user_password,
      prefix: values.prefix,
      user_phone: values.user_phone,
      user_dob: values.user_dob ? values.user_dob.toISOString() : null,
      user_gender: values.user_gender,
      user_bio: values.user_bio || undefined,
      user_img: userImg,
      user_country: values.user_country,
      user_state: values.user_state || undefined,
      user_city: values.user_city || undefined,
      user_pincode: values.user_pincode || undefined,
      user_landmark: values.user_landmark || undefined,
      user_address: values.user_address || undefined,
      user_agreement: values.user_agreement,
      user_verified: "false",
      user_active: true,
      user_org_limit: 1,
    };

    const response = await registerAPI(payload);
    const ok =
      response?.status === 200 ||
      response?.status === 201 ||
      response?.success === true;

    if (ok) {
      // ========== SAVE TO LOCALSTORAGE ==========
      const userData = {
        // Personal Info
        user_unique_id: values.user_unique_id,
        user_first_name: values.user_first_name,
        user_middle_name: values.user_middle_name || "",
        user_last_name: values.user_last_name,
        user_gender: values.user_gender,
        user_dob: values.user_dob ? values.user_dob.format("YYYY-MM-DD") : null,
        
        // Contact Info
        user_email: values.user_email,
        user_phone: values.user_phone,
        prefix: values.prefix,
        
        // Profile Info - BOTH fields for compatibility
        user_bio: values.user_bio || "",
        user_img: userImg,        // For RegisterPage
        user_image: userImg,      // For Profile.tsx
        
        // Address Info
        user_country: values.user_country,
        user_state: values.user_state || "",
        user_city: values.user_city || "",
        user_pincode: values.user_pincode || "",
        user_landmark: values.user_landmark || "",
        user_address: values.user_address || [],
        
        // Meta
        registeredAt: new Date().toISOString(),
        isLoggedIn: true
      };
      
      // Save to localStorage
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", values.user_unique_id);
      
      // Also save individual fields for quick access
      localStorage.setItem("userEmail", values.user_email);
      localStorage.setItem("userPhone", values.user_phone);

      // Save to sessionStorage - BOTH image fields
      const sessionUserDetails = {
        user_unique_id: values.user_unique_id,
        user_first_name: values.user_first_name,
        user_middle_name: values.user_middle_name || "",
        user_last_name: values.user_last_name,
        user_email: values.user_email,
        user_phone: values.user_phone,
        user_img: userImg,         // For backward compatibility
        user_image: userImg,       // For Profile.tsx
        user_bio: values.user_bio || "",
        user_country: values.user_country,
        user_state: values.user_state || "",
        user_city: values.user_city || "",
        user_pincode: values.user_pincode || "",
        user_landmark: values.user_landmark || "",
        user_address: values.user_address || [],
        user_gender: values.user_gender,
        user_dob: values.user_dob ? values.user_dob.format("YYYY-MM-DD") : null,
        prefix: values.prefix,
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
          "Rewards"
        ],
      };
      sessionStorage.setItem("userDetails", JSON.stringify(sessionUserDetails));

      // Debug: Log what was saved
      console.log("User data saved to localStorage:", userData);
      console.log("Session details saved:", sessionUserDetails);
      
      // Verify localStorage was set
      const savedData = localStorage.getItem("userData");
      console.log("Verification - saved data:", savedData);
      
      message.success("Registration successful! Redirecting to your profile...");
      navigate("/dashboard");
    } else {
      message.error(response?.message ?? "Registration failed. Try again.");
    }
  } catch (err) {
    console.error("Registration error:", err);
    message.error("Something went wrong. Please try again.");
  } finally {
    setSubmitting(false);
    helpers.setSubmitting(false);
  }
};

  /* ----------------------- render helpers ------------------------- */

  const stepsItems = useMemo(
    () => [
      { title: "Identity" },
      { title: "Account" },
      { title: "Profile" },
    ],
    []
  );

  /* ----------------------- image upload helper --------------------- */
  // Reads the selected image file and converts it to a base64 data URL
  // so it can be stored directly on user_img and rendered immediately
  // as a preview here and later on the Profile page (Avatar src).
  const beforeUploadImage = (file: File): boolean => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Please upload an image file.");
      return false;
    }
    const isUnder2MB = file.size / 1024 / 1024 < 2;
    if (!isUnder2MB) {
      message.error("Image must be smaller than 2MB.");
      return false;
    }
    return true;
  };

  const getCompressedBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 200;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  return (
    <main className="register-page" aria-labelledby="register-heading">
      <Card
        className="register-card"
        title={
          <Title id="register-heading" level={3} style={{ margin: 0 }}>
            Create your account
          </Title>
        }
      >
        <Steps
          className="register-steps"
          current={step}
          items={stepsItems}
          size="small"
          responsive
        />

        <Formik<RegisterFormValues>
          initialValues={initialValues}
          validationSchema={stepSchemas[step]}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
          enableReinitialize={false}
        >
          {(formik: FormikProps<RegisterFormValues>) => {
            const {
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              setFieldTouched,
              submitForm,
            } = formik;

            const fieldStatus = (
              name: keyof RegisterFormValues,
              extra?: string | null
            ): "" | "error" =>
              (touched[name] && (errors as Record<string, string>)[name]) ||
                extra
                ? "error"
                : "";

            const fieldHelp = (
              name: keyof RegisterFormValues,
              extra?: string | null
            ): string | undefined => {
              const e = (errors as Record<string, string>)[name];
              if (touched[name] && e) return e;
              if (extra) return extra;
              return undefined;
            };

            const uploadProps: UploadProps = {
              accept: "image/*",
              maxCount: 1,
              showUploadList: false,
              beforeUpload: beforeUploadImage,
              customRequest: async ({ file, onSuccess, onError }) => {
                try {
                  const base64 = await getCompressedBase64(file as File);
                  setFieldValue("user_img", base64);
                  setFieldTouched("user_img", true);
                  onSuccess?.("ok");
                } catch (err) {
                  onError?.(err as Error);
                  message.error("Failed to read image. Please try again.");
                }
              },
            };

            return (
              <Form
                layout="vertical"
                className="register-form"
                onFinish={submitForm}
                noValidate
                aria-describedby="register-heading"
              >
                {/* ---------------- Step 1 ---------------- */}
                {step === 0 && (
                  <Row gutter={16}>
                    <Col xs={24} sm={24}>
                      <Form.Item
                        label="Username"
                        required
                        validateStatus={fieldStatus(
                          "user_unique_id",
                          usernameError
                        )}
                        help={fieldHelp("user_unique_id", usernameError)}
                      >
                        <Input
                          id="user_unique_id"
                          name="user_unique_id"
                          autoComplete="username"
                          value={values.user_unique_id}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            void handleUsernameBlur(e.target.value.trim());
                          }}
                          aria-required="true"
                          aria-invalid={!!fieldHelp("user_unique_id", usernameError)}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="First name"
                        required
                        validateStatus={fieldStatus("user_first_name")}
                        help={fieldHelp("user_first_name")}
                      >
                        <Input
                          id="user_first_name"
                          name="user_first_name"
                          autoComplete="given-name"
                          value={values.user_first_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-required="true"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Middle name"
                        validateStatus={fieldStatus("user_middle_name")}
                        help={fieldHelp("user_middle_name")}
                      >
                        <Input
                          id="user_middle_name"
                          name="user_middle_name"
                          autoComplete="additional-name"
                          value={values.user_middle_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Last name"
                        required
                        validateStatus={fieldStatus("user_last_name")}
                        help={fieldHelp("user_last_name")}
                      >
                        <Input
                          id="user_last_name"
                          name="user_last_name"
                          autoComplete="family-name"
                          value={values.user_last_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-required="true"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Gender"
                        required
                        validateStatus={fieldStatus("user_gender")}
                        help={fieldHelp("user_gender")}
                      >
                        <Select
                          id="user_gender"
                          aria-label="Gender"
                          placeholder="Select your gender"
                          value={values.user_gender || undefined}
                          onChange={(v) => setFieldValue("user_gender", v)}
                          onBlur={() => setFieldTouched("user_gender", true)}
                          options={GENDER_OPTIONS}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Date of birth"
                        required
                        validateStatus={fieldStatus("user_dob")}
                        help={fieldHelp("user_dob")}
                      >
                        <DatePicker
                          id="user_dob"
                          aria-label="Date of birth"
                          className="register-phone-input"
                          value={values.user_dob}
                          onChange={(d) => setFieldValue("user_dob", d)}
                          onBlur={() => setFieldTouched("user_dob", true)}
                          disabledDate={(current) =>
                            !!current && current.isAfter(dayjs())
                          }
                          format="YYYY-MM-DD"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {/* ---------------- Step 2 ---------------- */}
                {step === 1 && (
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        label="Email"
                        required
                        validateStatus={fieldStatus("user_email", emailError)}
                        help={fieldHelp("user_email", emailError)}
                      >
                        <Input
                          id="user_email"
                          name="user_email"
                          type="email"
                          autoComplete="email"
                          value={values.user_email}
                          onChange={handleChange}
                          onBlur={(e) => {
                            handleBlur(e);
                            void handleEmailBlur(e.target.value.trim());
                          }}
                          aria-required="true"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label="Phone number"
                        required
                        validateStatus={
                          fieldStatus("user_phone", phoneError) ||
                          fieldStatus("prefix")
                        }
                        help={
                          fieldHelp("user_phone", phoneError) ||
                          fieldHelp("prefix")
                        }
                      >
                        <Input
                          id="user_phone"
                          name="user_phone"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          className="register-phone-input"
                          value={values.user_phone}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            setFieldValue("user_phone", digits);
                          }}
                          onBlur={(e) => {
                            handleBlur(e);
                            void handlePhoneBlur(e.target.value.trim());
                          }}
                          aria-required="true"
                          addonBefore={
                            <Select
                              aria-label="Country code"
                              value={values.prefix}
                              onChange={(v) => setFieldValue("prefix", v)}
                              options={PHONE_PREFIX_OPTIONS}
                              style={{ width: 120 }}
                            />
                          }
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Password"
                        required
                        validateStatus={fieldStatus("user_password")}
                        help={fieldHelp("user_password")}
                      >
                        <Input.Password
                          id="user_password"
                          name="user_password"
                          autoComplete="new-password"
                          value={values.user_password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-required="true"
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Confirm password"
                        required
                        validateStatus={fieldStatus("confirm_password")}
                        help={fieldHelp("confirm_password")}
                      >
                        <Input.Password
                          id="confirm_password"
                          name="confirm_password"
                          autoComplete="new-password"
                          value={values.confirm_password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          aria-required="true"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {/* ---------------- Step 3 ---------------- */}
                {step === 2 && (
                  <Row gutter={16}>
                    <Col xs={24}>
                      <Form.Item
                        label="Bio"
                        validateStatus={fieldStatus("user_bio")}
                        help={fieldHelp("user_bio")}
                      >
                        <Input.TextArea
                          id="user_bio"
                          name="user_bio"
                          rows={3}
                          maxLength={200}
                          showCount
                          value={values.user_bio}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label="Profile photo"
                        validateStatus={fieldStatus("user_img")}
                        help={fieldHelp("user_img")}
                      >
                        <div className="register-avatar-upload">
                          <Avatar
                            size={64}
                            src={values.user_img || undefined}
                            icon={!values.user_img ? <UserOutlined /> : undefined}
                          />
                          <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>
                              {values.user_img ? "Change photo" : "Upload photo"}
                            </Button>
                          </Upload>
                          {values.user_img && (
                            <Button
                              type="text"
                              danger
                              onClick={() => setFieldValue("user_img", "")}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Country"
                        required
                        validateStatus={fieldStatus("user_country")}
                        help={fieldHelp("user_country")}
                      >
                        <Select
                          id="user_country"
                          aria-label="Country"
                          placeholder="Select your country"
                          value={values.user_country || undefined}
                          onChange={(v) => setFieldValue("user_country", v)}
                          onBlur={() => setFieldTouched("user_country", true)}
                          options={COUNTRY_OPTIONS}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="State"
                        validateStatus={fieldStatus("user_state")}
                        help={fieldHelp("user_state")}
                      >
                        <Input
                          id="user_state"
                          name="user_state"
                          autoComplete="address-level1"
                          value={values.user_state}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="City"
                        validateStatus={fieldStatus("user_city")}
                        help={fieldHelp("user_city")}
                      >
                        <Input
                          id="user_city"
                          name="user_city"
                          autoComplete="address-level2"
                          value={values.user_city}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Pincode"
                        validateStatus={fieldStatus("user_pincode")}
                        help={fieldHelp("user_pincode")}
                      >
                        <Input
                          id="user_pincode"
                          name="user_pincode"
                          inputMode="numeric"
                          autoComplete="postal-code"
                          value={values.user_pincode}
                          onChange={(e) =>
                            setFieldValue(
                              "user_pincode",
                              e.target.value.replace(/\D/g, "")
                            )
                          }
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Landmark"
                        validateStatus={fieldStatus("user_landmark")}
                        help={fieldHelp("user_landmark")}
                      >
                        <Input
                          id="user_landmark"
                          name="user_landmark"
                          value={values.user_landmark}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        label="Address"
                        validateStatus={fieldStatus("user_address")}
                        help={fieldHelp("user_address")}
                      >
                        <Input.TextArea
                          id="user_address"
                          name="user_address"
                          rows={2}
                          maxLength={255}
                          showCount
                          autoComplete="street-address"
                          value={values.user_address && values.user_address.join(', ')}
                          onChange={(e) => {
                            const addressArray = e.target.value.split(',').map(s => s.trim());
                            setFieldValue("user_address", addressArray);
                          }}
                          onBlur={handleBlur}
                        />
                      </Form.Item>
                    </Col>

                    <Col xs={24}>
                      <Form.Item
                        validateStatus={fieldStatus("user_agreement")}
                        help={fieldHelp("user_agreement")}
                      >
                        <Checkbox
                          id="user_agreement"
                          name="user_agreement"
                          checked={values.user_agreement}
                          onChange={(e) =>
                            setFieldValue("user_agreement", e.target.checked)
                          }
                          onBlur={() =>
                            setFieldTouched("user_agreement", true)
                          }
                          aria-required="true"
                        >
                          I have read the{" "}
                          <a href="/terms" target="_blank" rel="noreferrer">
                            Terms &amp; Conditions
                          </a>
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                )}

                {/* ---------------- Actions ---------------- */}
                <div className="register-actions" role="group" aria-label="Form navigation">
                  <Button
                    onClick={() => navigate("/")}
                    type="link"
                    aria-label="Go to login"
                  >
                    Already have an account? Sign in
                  </Button>

                  <div style={{ display: "flex", gap: 8 }}>
                    {step > 0 && (
                      <Button
                        onClick={() => setStep((s) => Math.max(0, s - 1))}
                        disabled={submitting}
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      onClick={submitForm}
                    >
                      {step < TOTAL_STEPS - 1 ? "Next" : "Create account"}
                    </Button>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </main>
  );
};

export default RegisterPage;