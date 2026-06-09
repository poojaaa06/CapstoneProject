import React, { useState, useEffect } from "react";
import { useAppContext } from "src/context/appContext";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  Typography,
  message,
  Divider,
  Select,
} from "antd";
import { EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { updateProfileAPI } from "src/services/updateProfileAPI";
// import { OrganizationForm } from "./orgProfile";

const { Text } = Typography;

export const Profile = () => {
  const { userDetails } = useAppContext(); // Replace with your global state management
  const [form] = Form.useForm();
  const [isEditable, setIsEditable] = useState(false);
  const { Option } = Select;

  useEffect(() => {
    // Pre-fill form with user data when the component mounts
    if (userDetails) {
      form.setFieldsValue({
        ...userDetails,
      });
    }
  }, [userDetails]);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleFormSubmit = async (values: any) => {
    // Simulate API call to update user profile
    console.log("====================", values);
    updateProfileAPI(values)
    message.success("Profile updated successfully!");
    setIsEditable(false);
  };

  const handleCancel = () => {
    setIsEditable(false);
    form.setFieldsValue(userDetails); // Reset the form values
  };

  const colLayout = isEditable
    ? { xs: 24, sm: 12, lg: 8 }
    : { xs: 24, sm: 12, lg: 6 };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <h2>Profile Details</h2>
        </Col>
        <Col>
          <Space>
            <Button
              icon={isEditable ? <SaveOutlined /> : <EditOutlined />}
              type="primary"
              onClick={() => (isEditable ? form.submit() : handleEditToggle())}
            >
              {isEditable ? "Save" : "Edit"}
            </Button>
            {isEditable && (
              <Button icon={<CloseOutlined />} danger onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Space>
        </Col>
      </Row>
      <Divider />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={userDetails}
      >
        <Row gutter={[16, 8]}>
          {/* User ID */}
          <Col {...colLayout}>
            <Form.Item
              label="User ID"
              name="user_unique_id"
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? (
                <Input disabled />
              ) : (
                <Text>{userDetails?.user_unique_id}</Text>
              )}
            </Form.Item>
          </Col>

          {/* First Name */}
          <Col {...colLayout}>
            <Form.Item
              label="First Name"
              name="user_first_name"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "First name is required",
                },
              ]}
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_first_name}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Middle Name */}
          <Col {...colLayout}>
            <Form.Item
              label="Middle Name"
              name="user_middle_name"
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_middle_name || "--"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Last Name */}
          <Col {...colLayout}>
            <Form.Item
              label="Last Name"
              name="user_last_name"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Last name is required",
                },
              ]}
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_last_name}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Email */}
          <Col {...colLayout}>
            <Form.Item
              label="Email"
              name="user_email"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Email is required",
                },
                { type: "email", message: "Enter a valid email" },
              ]}
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? <Input /> : <Text>{userDetails?.user_email}</Text>}
            </Form.Item>
          </Col>

          {/* Phone */}
          <Col {...colLayout}>
            <Form.Item
              label="Phone"
              name="user_phone"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Phone number is required",
                },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Enter a valid phone number",
                },
              ]}
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? (
                <Input addonBefore={userDetails?.prefix} />
              ) : (
                <Text>{`${userDetails?.prefix || ""}${
                  userDetails?.user_phone
                }`}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Gender Dropdown */}
          <Col {...colLayout}>
            <Form.Item
              label="Gender"
              name="user_gender"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Gender is required",
                },
              ]}
              labelCol={{
                style: {
                  fontWeight: "bold",
                  padding: !isEditable ? 0 : "",
                },
              }}
            >
              {isEditable ? (
                <Select placeholder="Select Gender">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              ) : (
                <Text>{userDetails?.user_gender || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              label="Pincode"
              name="user_pincode"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Pincode is required",
                },
                {
                  pattern: /^[0-9]{6}$/,
                  message: "Enter a valid 6-digit pincode",
                },
              ]}
              labelCol={{
                style: {
                  fontWeight: "bold",
                  padding: !isEditable ? 0 : "",
                },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_pincode || "--"}</Text>
              )}
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              label="Landmark"
              name="user_landmark"
              labelCol={{
                style: {
                  fontWeight: "bold",
                  padding: !isEditable ? 0 : "",
                },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_landmark || "--"}</Text>
              )}
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              label="City"
              name="user_city"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "City is required",
                },
              ]}
              labelCol={{
                style: {
                  fontWeight: "bold",
                  padding: !isEditable ? 0 : "",
                },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_city || "--"}</Text>
              )}
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              label="State"
              name="user_state"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "State is required",
                },
              ]}
              labelCol={{
                style: {
                  fontWeight: "bold",
                  padding: !isEditable ? 0 : "",
                },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_state || "--"}</Text>
              )}
            </Form.Item>
          </Col>

          <Col {...colLayout}>
            <Form.Item
              label="Country"
              name="user_country"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Country is required",
                },
              ]}
              labelCol={{
                style: {
                  fontWeight: "bold",
                  padding: !isEditable ? 0 : "",
                },
              }}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{userDetails?.user_country || "--"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Address */}
          <Col xs={24}>
            <Form.Item
              label="Address"
              name="user_address"
              rules={[
                {
                  required: isEditable ? true : false,
                  message: "Address is required",
                },
                { max: 250, message: "Address must not exceed 250 characters" },
              ]}
              labelCol={{
                style: { fontWeight: "bold", padding: !isEditable ? 0 : "" },
              }}
            >
              {isEditable ? (
                <Input.TextArea rows={3} />
              ) : (
                <Text>{userDetails?.user_address || "--"}</Text>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
      {/* <Divider />
      <OrganizationForm /> */}
    </div>
  );
};
