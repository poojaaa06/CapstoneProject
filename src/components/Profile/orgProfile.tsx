import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Typography,
  Space,
  message,
} from "antd";
import { SaveOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const OrganizationForm: React.FC = () => {
  const [form] = Form.useForm();
  const [isEditable, setIsEditable] = useState(false);

  // Initial organization details
  const [orgDetails, setOrgDetails] = useState({
    org_name: "",
    org_email: "",
    org_description: "",
    org_type_id: "",
    org_scale_id: "",
    org_category_id: "",
    org_pincode: "",
    org_landmark: "",
    org_city: "",
    org_state: "",
    org_country: "",
    org_address: "",
    org_services: "",
  });

  useEffect(() => {
    // Pre-fill the form with existing organization details
    form.setFieldsValue(orgDetails);
  }, [orgDetails]);

  const handleEditToggle = () => {
    setIsEditable(!isEditable);
  };

  const handleFormSubmit = async (values: any) => {
    console.log("Updated Organization Details:", values);
    setOrgDetails(values); // Update state with new organization details
    message.success("Organization details updated successfully!");
    setIsEditable(false);
  };

  const handleCancel = () => {
    form.setFieldsValue(orgDetails); // Reset the form to previous values
    setIsEditable(false);
  };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <h2>Organization Details</h2>
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={orgDetails}
      >
        <Row gutter={[16, 16]}>
          {/* Organization Name */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Organization Name"
              name="org_name"
              rules={[
                { required: true, message: "Organization name is required" },
              ]}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{orgDetails.org_name || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Organization Email */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Organization Email"
              name="org_email"
              rules={[
                { type: "email", message: "Enter a valid email" },
                { required: true, message: "Email is required" },
              ]}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{orgDetails.org_email || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Organization Type */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Organization Type"
              name="org_type_id"
              rules={[
                { required: true, message: "Organization type is required" },
              ]}
            >
              {isEditable ? (
                <Select>
                  <Option value="LLP">
                    Limited Liability Partnership (LLP)
                  </Option>
                  <Option value="Pvt Ltd">
                    Private Limited Company (Pvt Ltd)
                  </Option>
                  <Option value="Plc">Public Limited Company (Plc)</Option>
                  <Option value="Sole Proprietorship">
                    Sole Proprietorship
                  </Option>
                  <Option value="Partnership">Partnership</Option>
                  <Option value="Nonprofit Organization">
                    Nonprofit Organization
                  </Option>
                  <Option value="Cooperative">Cooperative</Option>
                  <Option value="Trust">Trust</Option>
                  <Option value="Association">Association</Option>
                  <Option value="Government-Owned Corporation">
                    Government-Owned Corporation
                  </Option>
                  <Option value="Unregistered">Unregistered</Option>
                </Select>
              ) : (
                <Text>{orgDetails.org_type_id || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Organization Scale */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Organization Scale"
              name="org_scale_id"
              rules={[
                { required: true, message: "Organization scale is required" },
              ]}
            >
              {isEditable ? (
                <Select>
                  <Option value="Microenterprise">Microenterprise</Option>
                  <Option value="SMEs">
                    Small and Medium-sized Enterprises (SMEs)
                  </Option>
                  <Option value="Large Enterprises">Large Enterprises</Option>
                  <Option value="MNC">Multinational Corporation (MNC)</Option>
                  <Option value="Global Corporation">Global Corporation</Option>
                  <Option value="Startups">Startups</Option>
                </Select>
              ) : (
                <Text>{orgDetails.org_scale_id || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Organization Category */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Organization Category"
              name="org_category_id"
              rules={[
                {
                  required: true,
                  message: "Organization category is required",
                },
              ]}
            >
              {isEditable ? (
                <Select>
                  <Option value="Technology and IT">
                    Technology and Information Technology (IT)
                  </Option>
                  <Option value="Healthcare and Pharmaceuticals">
                    Healthcare and Pharmaceuticals
                  </Option>
                  <Option value="Retail and Consumer Goods">
                    Retail and Consumer Goods
                  </Option>
                  <Option value="Manufacturing and Industrial">
                    Manufacturing and Industrial
                  </Option>
                  <Option value="Hospitality and Tourism">
                    Hospitality and Tourism
                  </Option>
                  <Option value="Real Estate and Property">
                    Real Estate and Property
                  </Option>
                  <Option value="Transportation and Logistics">
                    Transportation and Logistics
                  </Option>
                  <Option value="Energy and Utilities">
                    Energy and Utilities
                  </Option>
                  <Option value="Professional Services">
                    Professional Services
                  </Option>
                  <Option value="Education and Training">
                    Education and Training
                  </Option>
                  <Option value="Media and Entertainment">
                    Media and Entertainment
                  </Option>
                  <Option value="Agriculture and Agribusiness">
                    Agriculture and Agribusiness
                  </Option>
                  <Option value="Nonprofit and Social Services">
                    Nonprofit and Social Services
                  </Option>
                </Select>
              ) : (
                <Text>{orgDetails.org_category_id || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* City */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="City"
              name="org_city"
              rules={[{ required: true, message: "City is required" }]}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{orgDetails.org_city || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>

          {/* Pincode */}
          <Col xs={24} sm={12} lg={8}>
            <Form.Item
              label="Pincode"
              name="org_pincode"
              rules={[{ required: true, message: "Pincode is required" }]}
            >
              {isEditable ? (
                <Input />
              ) : (
                <Text>{orgDetails.org_pincode || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>
          {/* Organization Description */}
          <Col xs={24}>
            <Form.Item
              label="Organization Description"
              name="org_description"
              rules={[{ required: true, message: "Description is required" }]}
            >
              {isEditable ? (
                <TextArea rows={3} />
              ) : (
                <Text>{orgDetails.org_description || "N/A"}</Text>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
