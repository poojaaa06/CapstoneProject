import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "src/services/registerAPI";
import { validateUsername } from "src/services/validateUsernameAPI";
import { validateEmail } from "src/services/validateEmailAPI";
import { validatePhone } from "src/services/validatePhoneAPI";
import type { CascaderProps } from "antd";
import {
 
  Checkbox,
  Form,
  Input,

  Select,
  DatePicker,
  Typography,
} from "antd";
import CryptoJS from "crypto-js";
import codes from "../../utils/codes.json";
import CustomCard from "src/asserts/UI_components/Card/card.styled";
import { StyledRegisterPage } from "./register.styled";
import StyledButton from "src/asserts/UI_components/ButtonComponent/button.styled";
import { ToastMessage } from "src/asserts/UI_components/ToastMessage.tsx/toastMessage.styled";

const SECRET_KEY = "CagHKozTTJqLffF8KJChNp4926AQ8pRe";
const { Text } = Typography;
const { Option } = Select;

interface PrefixOption {
  label: string;
  value: string;
  key: string;
}

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

type FormFields = {
  user_unique_id: string;
  user_first_name: string;
  user_middle_name?: string;
  user_last_name: string;
  user_email: string;
  user_password: string;
  confirm_password: string;
  prefix: string;
  user_phone: string;
  user_dob: any;
  user_gender: string;
  user_bio?: string;
  user_img?: string;
  user_country?: string;
  user_state?: string;
  user_city?: string;
  user_pincode?: string;
  user_landmark?: string;
  user_address?: string;
  user_agreement: boolean;
  user_role?: string;
  user_verified?: boolean;
  user_active?: boolean;
  user_org_limit?: number;
};

const residences: CascaderProps<DataNodeType>["options"] = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake",
          },
        ],
      },
    ],
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men",
          },
        ],
      },
    ],
  },
];

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isPhoneAvailable, setIsPhoneAvailable] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const handleUsernameBlur = async (username: string) => {
    console.log("username", username);
    try {
      // Call the validateUsername API with the entered username
      const response = await validateUsername(username);

      if (response.success && response.usernameValidation) {
        if (response.usernameValidation.exists) {
          setIsUsernameAvailable(false);
          setUsernameError(
            "Username already exists, Please select another one"
          );
        } else {
          setIsUsernameAvailable(true);
          setUsernameError(null);
        }
      }
    } catch (error) {
      console.error("Error validating username:", error);
    }
  };

  const handleEmailBlur = async (email: string) => {
    console.log("email", email);
    try {
      // Call the validateEmail API with the entered email
      const response = await validateEmail(email);
      
      if (response.success && response.emailValidation) {
        if (response.emailValidation.exists) {
          setIsEmailAvailable(false);
          setEmailError("email already exists, Please select another one");
        } else {
          setIsEmailAvailable(true);
          setEmailError(null);
        }
      }
    } catch (error) {
      console.error("Error validating email:", error);
    }
  };
  const handlePhoneBlur = async (phone: string) => {
    console.log("phone", phone);
    try {
      // Call the validatePhone API with the entered phone
      const response = await validatePhone(phone);
      
      if (response.success && response.phoneValidation) {
        if (response.usernameValidation.exists) {
          setIsPhoneAvailable(false);
          setPhoneError("Phone already exists, Please select another one");
        } else {
          setIsPhoneAvailable(true);
          setPhoneError(null);
        }
      }
    } catch (error) {
      console.error("Error validating phone:", error);
    }
  };

  const [formCurrentStep, setFormCurrentStep] = useState(1);
  const [finalFormFieldsData, setFinalFormFieldsData] = useState<FormFields>({
    user_unique_id: "",
    user_first_name: "",
    user_middle_name: "",
    user_last_name: "",
    user_email: "",
    user_password: "",
    confirm_password: "",
    prefix: "",
    user_phone: "",
    user_dob: "",
    user_gender: "",
    user_bio: "",
    user_img: "",
    user_country: "",
    user_state: "",
    user_city: "",
    user_pincode: "",
    user_landmark: "",
    user_address: "",
    user_agreement: false,
    user_role: "",
    user_verified: false,
    user_active: true,
    user_org_limit: 1,
  });
  const [prefixOptions, setPrefixOptions] = useState<PrefixOption[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("Final Step Data Updated:", finalFormFieldsData);
    console.log("username: ", finalFormFieldsData.user_unique_id);
    console.log("user first name: ", finalFormFieldsData.user_first_name);
    console.log("user middle name: ", finalFormFieldsData.user_middle_name);
    console.log("user last name: ", finalFormFieldsData.user_last_name);
    console.log("email: ", finalFormFieldsData.user_email);
    console.log("password: ", finalFormFieldsData.user_password);
    console.log("confirm: ", finalFormFieldsData.confirm_password);
    console.log("prefix: ", finalFormFieldsData.prefix);
    console.log("phone: ", finalFormFieldsData.user_phone);
    console.log("dob: ", finalFormFieldsData?.user_dob);
    console.log("gender: ", finalFormFieldsData.user_gender);
    console.log("bio: ", finalFormFieldsData.user_bio);
    console.log("image: ", finalFormFieldsData.user_img);
    console.log("user_country: ", finalFormFieldsData.user_country);
    console.log("user_state: ", finalFormFieldsData.user_state);
    console.log("user_city: ", finalFormFieldsData.user_city);
    console.log("user_pincode: ", finalFormFieldsData.user_pincode);
    console.log("user_landmark: ", finalFormFieldsData.user_landmark);
    console.log("address: ", finalFormFieldsData.user_address);
    console.log("agreement: ", finalFormFieldsData.user_agreement);
  }, [finalFormFieldsData, formCurrentStep]);

  const onFinish = async (values: any) => {
    const currentValues = form.getFieldsValue();

    if (formCurrentStep === 1) {
      console.log("Step 1 values:", form.getFieldsValue(), finalFormFieldsData);
      setFinalFormFieldsData({ ...finalFormFieldsData, ...currentValues });
      setFormCurrentStep(2);
      return;
    } else if (formCurrentStep === 2) {
      console.log("Step 2 values:", form.getFieldsValue(), finalFormFieldsData);
      setFinalFormFieldsData({ ...finalFormFieldsData, ...currentValues });
      setFormCurrentStep(3);
      return;
    } else {
      setFinalFormFieldsData({ ...finalFormFieldsData, ...currentValues });
      const mergedFinalFormData = { ...finalFormFieldsData, ...currentValues };
      // Encrypt the password
      const encryptedPassword = CryptoJS.AES.encrypt(
        mergedFinalFormData.user_password || "",
        SECRET_KEY
      ).toString();
      const formData = {
        user_unique_id: mergedFinalFormData.user_unique_id,
        user_first_name: mergedFinalFormData.user_first_name,
        user_middle_name: mergedFinalFormData.user_middle_name,
        user_last_name: mergedFinalFormData.user_last_name,
        user_email: mergedFinalFormData.user_email,
        user_password: encryptedPassword,
        prefix: mergedFinalFormData.prefix,
        user_phone: mergedFinalFormData.user_phone,
        user_dob: mergedFinalFormData.user_dob
          ? mergedFinalFormData.user_dob.$d
          : null,
        user_gender: mergedFinalFormData.user_gender,
        user_bio: mergedFinalFormData.user_bio,
        user_img: mergedFinalFormData.user_img,
        user_country: mergedFinalFormData.user_country,
        user_state: mergedFinalFormData.user_state,
        user_city: mergedFinalFormData.user_city,
        user_pincode: mergedFinalFormData.user_pincode,
        user_landmark: mergedFinalFormData.user_landmark,
        user_address: mergedFinalFormData.user_address,
        user_agreement: mergedFinalFormData.user_agreement,
        // user_role set as admin in BE
        user_verified: "false", // need to change based on verification
        user_active: true,
        user_org_limit: 1,
      };

      try {
        const response = await registerAPI(formData);
        console.log("---res", response);
        if (
          (response && response?.status === 200) ||
          response?.status === 201 ||
          response?.success === true //TODO: status is not coming: CHAITANYA
        ) {
          // TODO: which all status codes will come?
          // setUserDetails(response.data) TODO: After register user needs to start from login
          ToastMessage.success("User created successfully", 3);
          navigate("/");
        }
      } catch (err) {
        ToastMessage.error("Something went wrong please try again", 3);
      }
    }
  };

  useEffect(() => {
    // Load the country prefix codes from the JSON file
    const loadPrefixOptions = () => {
      const options = codes.map((country) => ({
        label: `${country.countryTelephonyCode} (${country.fullCountryName})`,
        value: country.countryTelephonyCode,
        key: country.shortCountryName,
      }));
      setPrefixOptions(options);
    };

    loadPrefixOptions();
  }, []);

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 75 }}>
        {prefixOptions.map((option) => (
          <Option key={option.key} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  const gerRegisterActions = () => {
    if (formCurrentStep === 1) {
      return [
        <StyledButton onClick={() => navigate("/")}>
          Back to Login
        </StyledButton>,
        <Form.Item {...tailFormItemLayout}>
          <StyledButton color="default" variant="text" htmlType="submit">
            Next
          </StyledButton>
        </Form.Item>,
      ];
    }
    if (formCurrentStep === 2) {
      return [
        <StyledButton
          onClick={() => {
            setFormCurrentStep(1);
          }}
        >
          Back
        </StyledButton>,

        <Form.Item {...tailFormItemLayout}>
          <StyledButton variant="text" htmlType="submit">
            Next
          </StyledButton>
        </Form.Item>,
      ];
    }
    if (formCurrentStep === 3) {
      return [
        <StyledButton
          type="text"
          onClick={() => {
            setFormCurrentStep(2);
          }}
        >
          Back
        </StyledButton>,
        <Form.Item {...tailFormItemLayout}>
          <StyledButton variant="text" htmlType="submit">
            Submit
          </StyledButton>
        </Form.Item>,
      ];
    }
  };

  return (
    <StyledRegisterPage>
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        initialValues={{
          residence: ["zhejiang", "hangzhou", "xihu"], //TODO: what is this?
          prefix: "91",
        }}
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <CustomCard
          title="Register"
          width={"400px"}
          actions={gerRegisterActions()}
        >
          {formCurrentStep === 1 && (
            <>
              <Form.Item
                name="user_unique_id"
                label="User Name"
                tooltip="Username should be unique"
                validateStatus={usernameError ? "error" : ""}
                help={usernameError}
                rules={[
                  {
                    required: true,
                    message: "Please input your username!",
                    whitespace: true,
                  },
                  {
                    min: 3,
                    max: 50,
                    message: "Username must be between 3 and 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z0-9]+$/,
                    message: "Username must be alphanumeric",
                  },
                ]}
              >
                <Input onBlur={(e) => handleUsernameBlur(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="user_first_name"
                label="First Name"
                tooltip="What do you want us to call you?"
                rules={[
                  {
                    required: true,
                    message: "Please input your first name!",
                    whitespace: true,
                  },
                  {
                    min: 2,
                    max: 50,
                    message: "First name must be between 2 and 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "First name must contain only letters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_middle_name"
                label="Middle Name"
                rules={[
                  {
                    whitespace: true,
                    max: 50,
                    message: "Middle name cannot exceed 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "First name must contain only letters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_last_name"
                label="Last Name"
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                    whitespace: true,
                  },
                  {
                    min: 2,
                    max: 50,
                    message: "Last name must be between 2 and 50 characters",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message: "Last name must contain only letters",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="user_gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                    message: "Please select gender!",
                  },
                ]}
              >
                <Select placeholder="Select your gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Date of Birth"
                name="user_dob"
                rules={[
                  {
                    required: true,
                    message: "Please input your date of birth!",
                  },
                  {
                    type: "date",
                    message: "Please select a valid date",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.resolve();
                      }
                      const today = new Date();
                      const thirteenYearsAgo = new Date(
                        today.getFullYear() - 13,
                        today.getMonth(),
                        today.getDate()
                      );
                      if (value.valueOf() > thirteenYearsAgo.getTime()) {
                        return Promise.reject(
                          new Error("You must be at least 13 years old.")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker
                  width={300}
                  disabledDate={(current) =>
                    current && current.valueOf() > Date.now()
                  }
                />
              </Form.Item>
            </>
          )}

          {formCurrentStep === 2 && (
            <>
              <Form.Item
                name="user_email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid email",
                  },
                  {
                    required: true,
                    message: "Please input your email!",
                  },
                ]}
              >
                <Input onBlur={(e) => handleEmailBlur(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="user_phone"
                label="Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                  {
                    pattern: /^\d{7,15}$/,
                    message: "Phone number must be between 7 and 15 digits",
                  },
                ]}
              >
                <Input  />
                <Input addonBefore={prefixSelector} style={{ width: "100%" }} onBlur={(e) => handlePhoneBlur(e.target.value)} />
              </Form.Item>

              <Form.Item
                name="user_password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                  {
                    min: 8,
                    message: "Password must be at least 8 characters",
                  },
                  {
                    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                    message:
                      "Password must contain an uppercase letter, a number, and a special character",
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm_password"
                label="Confirm Password"
                dependencies={["user_password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("user_password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}

          {formCurrentStep === 3 && (
            <>
              <Form.Item
                name="user_bio"
                label="Bio"
                rules={[
                  {
                    whitespace: true,
                    max: 200,
                    message: "Bio cannot exceed 200 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_img"
                label="Image"
                rules={[
                  {
                    message: "Please input a valid image URL!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_country"
                label="Country"
                rules={[
                  {
                    required: true,
                    message: "Please select your country!",
                  },
                ]}
              >
                <Select placeholder="Select your country">
                  <Option value="india">India</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="user_state"
                label="State"
                rules={[
                  {
                    whitespace: true,
                    max: 200,
                    message: "Please input your state!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="user_city"
                label="City"
                rules={[
                  {
                    whitespace: true,
                    max: 200,
                    message: "Please input your city!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_pincode"
                label="Pincode"
                rules={[
                  {
                    whitespace: true,
                    max: 10,
                    pattern: /^\d{5,10}$/,
                    message: "Pincode must be between 5 and 10 digits",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_landmark"
                label="Landmark"
                rules={[
                  {
                    whitespace: true,
                    max: 200,
                    message: "Please input your landmark!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_address"
                label="Address"
                rules={[
                  {
                    whitespace: true,

                    message: "Please input your address!",
                  },
                  {
                    max: 255,
                    message: "Address cannot exceed 255 characters",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="user_agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(
                            new Error("Should accept Terms & Conditions")
                          ),
                  },
                ]}
                {...tailFormItemLayout}
              >
                <Checkbox>
                  I have read the <a href="#">Terms & Conditions</a>
                </Checkbox>
              </Form.Item>
            </>
          )}
        </CustomCard>
      </Form>
    </StyledRegisterPage>
  );
}
