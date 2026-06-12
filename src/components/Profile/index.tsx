import './Profile.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from 'src/context/appContext';
import {
  App,
  Row,
  Col,
  Space,
  Typography,
  notification,
  Divider,
  Select,
  Card,
  Avatar,
  Upload,
  Button,
  DatePicker,
  Dropdown,
  MenuProps,
  Form as AntForm,
} from 'antd';
import {
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  UserOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { updateProfileAPI } from 'src/services/updateProfileAPI';
import { Formik, Form } from 'formik';
import { profileValidationSchema } from './profileValidation';
import dayjs from 'dayjs';
import countryCodes from 'src/utils/codes.json';
const { Text } = Typography;
const { Option } = Select;
export const Profile: React.FC = () => {
  const { userDetails, setUserDetails } = useAppContext();
  const [isEditable, setIsEditable] = useState(false);
  // null → no photo at all (blank avatar)
  // "" → not yet loaded
  // "data:..." → actual image
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const { modal } = App.useApp();
  // Seed profileImage once when userDetails first arrives
  useEffect(() => {
    if (!profileImage && userDetails) {
      setProfileImage(userDetails.user_image || null);
    }
  }, [userDetails]);
  // ── Image upload ────────────────────────────────────────────────────────────
  const handleImageUpload = (info: any) => {
    console.log('Upload info:', info);
    const file = info.file?.originFileObj || info.file;
    if (!(file instanceof File)) {
      console.log('No valid file found');
      return;
    }
    // Allowed image types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      notification.error({
        message: 'Invalid File Type',
        description: 'Only JPG, JPEG, PNG, and WEBP image files are allowed.',
      });
      return;
    }
    // Maximum size: 2 MB
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      notification.error({
        message: 'File Too Large',
        description: 'Image size must not exceed 2 MB.',
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      console.log('FileReader result:', result);
      if (typeof result === 'string') {
        setProfileImage(result);
      }
    };
    reader.onerror = (err) => {
      console.error('FileReader error:', err);
      notification.error({
        message: 'Upload Failed',
        description: 'Unable to read the selected image.',
      });
    };
    reader.readAsDataURL(file);
  };
  const handleRemovePhoto = () => {
    setProfileImage(null);
  };
  const handleDeleteAccount = () => {
    modal.confirm({
      title: 'Delete Account',
      content:
        'Are you sure you want to delete your account? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => {
        sessionStorage.removeItem('userDetails');
        if (setUserDetails) {
          setUserDetails(null);
        }
        api.success({
          message: 'Account Deleted',
          description: 'Your account has been deleted successfully.',
          placement: 'topRight',
          duration: 3,
        });
        setTimeout(() => {
          navigate('/');
        }, 1500);
      },
    });
  };
  // ── Form submit ─────────────────────────────────────────────────────────────
  const handleFormSubmit = async (
    values: any,
    {
      setSubmitting,
      resetForm,
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState?: any) => void;
    },
  ) => {
    console.log('FORM SUBMITTED', values);
    try {
      const payload = {
        ...values,
        user_image: profileImage || '',
      };
      console.log('Payload:', payload);
      const response = await updateProfileAPI(payload);
      console.log('API SUCCESS:', response);
      const updatedUser = { ...userDetails, ...payload };
      if (setUserDetails) {
        setUserDetails(updatedUser);
      }
      sessionStorage.setItem('userDetails', JSON.stringify(updatedUser));
      api.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
        placement: 'topRight',
        duration: 3,
      });
      setIsEditable(false);
      resetForm({ values: updatedUser });
    } catch (error: any) {
      console.error('PROFILE UPDATE ERROR:', error);
      api.error({
        message: 'Update Failed',
        description:
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong while updating your profile.',
        placement: 'topRight',
        duration: 4,
      });
    } finally {
      setSubmitting(false);
    }
  };
  const colLayout = isEditable
    ? { xs: 24, sm: 12, lg: 8 }
    : { xs: 24, sm: 12, lg: 6 };
  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {contextHolder}
      <Formik
        enableReinitialize
        initialValues={{
          user_bio: userDetails?.user_bio || '',
          user_unique_id: userDetails?.user_unique_id || '',
          user_first_name: userDetails?.user_first_name || '',
          user_middle_name: userDetails?.user_middle_name || '',
          user_last_name: userDetails?.user_last_name || '',
          user_email: userDetails?.user_email || '',
          prefix: userDetails?.prefix || '+91',
          user_phone: userDetails?.user_phone || '',
          user_gender: userDetails?.user_gender || '',
          user_dob: userDetails?.user_dob
            ? dayjs(userDetails.user_dob).format('YYYY-MM-DD')
            : '',
          user_pincode: userDetails?.user_pincode || '',
          user_landmark: userDetails?.user_landmark || '',
          user_city: userDetails?.user_city || '',
          user_state: userDetails?.user_state || '',
          user_country: userDetails?.user_country || '',
          user_address: userDetails?.user_address || '',
        }}
        validationSchema={profileValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          resetForm,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => {
          const handleCancel = () => {
            setIsEditable(false);
            resetForm();
            setProfileImage(userDetails?.user_image || null);
          };
          const photoMenuItems: MenuProps['items'] = profileImage
            ? [
                {
                  key: 'change',
                  label: (
                    <Upload
                      accept=".jpg,.jpeg,.png,.webp"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const allowedTypes = [
                          'image/jpeg',
                          'image/jpg',
                          'image/png',
                          'image/webp',
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          notification.error({
                            message: 'Invalid File Type',
                            description:
                              'Only JPG, JPEG, PNG, and WEBP image files are allowed.',
                          });
                          return Upload.LIST_IGNORE;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          notification.error({
                            message: 'File Too Large',
                            description: 'Image size must not exceed 2 MB.',
                          });
                          return Upload.LIST_IGNORE;
                        }
                        return false;
                      }}
                      onChange={handleImageUpload}
                    >
                      <span>
                        <UploadOutlined /> Change Photo
                      </span>
                    </Upload>
                  ),
                },
                {
                  key: 'remove',
                  danger: true,
                  icon: <DeleteOutlined />,
                  label: 'Remove Photo',
                  onClick: handleRemovePhoto,
                },
              ]
            : [
                {
                  key: 'upload',
                  label: (
                    <Upload
                      accept=".jpg,.jpeg,.png,.webp"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const allowedTypes = [
                          'image/jpeg',
                          'image/jpg',
                          'image/png',
                          'image/webp',
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          notification.error({
                            message: 'Invalid File Type',
                            description:
                              'Only JPG, JPEG, PNG, and WEBP image files are allowed.',
                          });
                          return Upload.LIST_IGNORE;
                        }
                        if (file.size > 2 * 1024 * 1024) {
                          notification.error({
                            message: 'File Too Large',
                            description: 'Image size must not exceed 2 MB.',
                          });
                          return Upload.LIST_IGNORE;
                        }
                        return false; // prevent auto upload
                      }}
                      onChange={handleImageUpload}
                    >
                      <span>
                        <UploadOutlined /> Upload Photo
                      </span>
                    </Upload>
                  ),
                },
              ];
          return (
            <div className="profile-container">
              {/* ── Page Header ────────────────────────────────────────────── */}
              <Row
                justify="space-between"
                align="middle"
                className="page-header"
              >
                <Col>
                  <h2>Profile Details</h2>
                </Col>
                <Col>
                  <Space>
                    {!isEditable && (
                      <>
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => setIsEditable(true)}
                        >
                          Edit
                        </Button>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={handleDeleteAccount}
                        >
                          Delete Account
                        </Button>
                      </>
                    )}
                    {isEditable && (
                      <>
                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          htmlType="submit"
                          form="profile-form"
                          loading={isSubmitting}
                        >
                          Save
                        </Button>
                        <Button
                          danger
                          icon={<CloseOutlined />}
                          onClick={handleCancel}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Space>
                </Col>
              </Row>
              {/* ── Profile Header Card ─────────────────────────────────────── */}
              <Card className="profile-header-card">
                <div className="profile-header">
                  <div className="avatar-wrapper">
                    <Avatar
                      className="profile-avatar"
                      size={180}
                      src={profileImage || undefined}
                      icon={!profileImage ? <UserOutlined /> : undefined}
                    />
                    {isEditable && (
                      <Dropdown
                        menu={{ items: photoMenuItems }}
                        trigger={['click']}
                      >
                        <Button
                          shape="circle"
                          icon={<EditOutlined />}
                          className="edit-btn"
                        />
                      </Dropdown>
                    )}
                  </div>
                  <h2 className="profile-name">
                    {userDetails?.user_first_name} {userDetails?.user_last_name}
                  </h2>
                  <p className="profile-email">{userDetails?.user_email}</p>
                  {/* ── Bio Section ───────────────────────────────────── */}
                  <div className="profile-bio">
                    {isEditable ? (
                      <textarea
                        name="user_bio"
                        value={values.user_bio || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="bio-textarea"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p>
                        <i>{userDetails?.user_bio || ''}</i>
                      </p>
                    )}
                  </div>
                </div>
              </Card>
              {/* ── Form Card ───────────────────────────────────────────────── */}
              <Card className="profile-details-card">
                <Form id="profile-form">
                  {/* Personal Information */}
                  <Divider orientation="left">Personal Information</Divider>
                  <Row gutter={[16, 16]}>
                    {/* User ID — always read-only */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="User ID"
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        <Text>{userDetails?.user_unique_id}</Text>
                      </AntForm.Item>
                    </Col>
                    {/* First Name */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label={
                          <>
                            First Name{' '}
                            {isEditable && (
                              <span className="required-star">*</span>
                            )}
                          </>
                        }
                        validateStatus={
                          touched.user_first_name
                            ? errors.user_first_name
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_first_name
                            ? (errors.user_first_name as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_first_name"
                            value={values.user_first_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_first_name}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Middle Name */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="Middle Name"
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_middle_name"
                            value={values.user_middle_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_middle_name || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Last Name */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label={
                          <>
                            Last Name{' '}
                            {isEditable && (
                              <span className="required-star">*</span>
                            )}
                          </>
                        }
                        validateStatus={
                          touched.user_last_name
                            ? errors.user_last_name
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_last_name
                            ? (errors.user_last_name as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_last_name"
                            value={values.user_last_name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_last_name}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Gender */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label={
                          <>
                            Gender{' '}
                            {isEditable && (
                              <span className="required-star">*</span>
                            )}
                          </>
                        }
                        validateStatus={
                          touched.user_gender
                            ? errors.user_gender
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_gender
                            ? (errors.user_gender as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <Select
                            className="select-gender"
                            placeholder="Select Gender"
                            value={values.user_gender || undefined}
                            onChange={(value) =>
                              setFieldValue('user_gender', value)
                            }
                            onBlur={() => setFieldTouched('user_gender', true)}
                          >
                            <Option value="Male">Male</Option>
                            <Option value="Female">Female</Option>
                            <Option value="Other">Others</Option>
                            <Option value="Rather Not Specify">
                              Rather Not Specify
                            </Option>
                          </Select>
                        ) : (
                          <Text>{userDetails?.user_gender || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Date of Birth */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label={
                          <>
                            Date of Birth{' '}
                            {isEditable && (
                              <span className="required-star">*</span>
                            )}
                          </>
                        }
                        validateStatus={
                          touched.user_dob && errors.user_dob ? 'error' : ''
                        }
                        help={
                          touched.user_dob
                            ? (errors.user_dob as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <DatePicker
                            allowClear={false}
                            className="datepicker-dob"
                            format="DD/MM/YYYY"
                            value={
                              values.user_dob ? dayjs(values.user_dob) : null
                            }
                            disabledDate={(current) =>
                              current &&
                              current >
                                dayjs().subtract(13, 'year').endOf('day')
                            }
                            onChange={(date) =>
                              setFieldValue(
                                'user_dob',
                                date ? date.format('YYYY-MM-DD') : '',
                              )
                            }
                          />
                        ) : (
                          <Text>
                            {userDetails?.user_dob
                              ? dayjs(userDetails.user_dob).format('DD/MM/YYYY')
                              : '--'}
                          </Text>
                        )}
                      </AntForm.Item>
                    </Col>
                  </Row>
                  {/* Contact Information */}
                  <Divider orientation="left">Contact Information</Divider>
                  <Row gutter={[16, 16]}>
                    {/* Email */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label={
                          <>
                            Email{' '}
                            {isEditable && (
                              <span className="required-star">*</span>
                            )}
                          </>
                        }
                        validateStatus={
                          touched.user_email
                            ? errors.user_email
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_email
                            ? (errors.user_email as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            type="email"
                            name="user_email"
                            value={values.user_email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_email}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Phone */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label={
                          <>
                            Phone No.{' '}
                            {isEditable && (
                              <span className="required-star">*</span>
                            )}
                          </>
                        }
                        validateStatus={
                          touched.user_phone
                            ? errors.user_phone
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_phone
                            ? (errors.user_phone as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <div className="input-addon-wrapper">
                            <Select
                              showSearch
                              className="country-code-select"
                              value={values.prefix || '+91'}
                              onChange={(value) =>
                                setFieldValue('prefix', value)
                              }
                              optionFilterProp="label"
                              options={countryCodes.map((country) => ({
                                value: country.countryTelephonyCode,
                                label: `${country.fullCountryName} (${country.countryTelephonyCode})`,
                              }))}
                              optionLabelProp="value"
                            />
                            <input
                              className="ant-input addon-input"
                              name="user_phone"
                              maxLength={10}
                              value={values.user_phone}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                          </div>
                        ) : (
                          <Text>
                            {userDetails?.prefix} {userDetails?.user_phone}
                          </Text>
                        )}
                      </AntForm.Item>
                    </Col>
                  </Row>
                  {/* Address Information */}
                  <Divider orientation="left">Address Information</Divider>
                  <Row gutter={[16, 16]}>
                    {/* Address */}
                    <Col span={24}>
                      <AntForm.Item
                        label="Address"
                        validateStatus={
                          touched.user_address
                            ? errors.user_address
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_address
                            ? (errors.user_address as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <textarea
                            className="ant-input address-textarea"
                            name="user_address"
                            rows={4}
                            value={values.user_address}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_address || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Landmark */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="Landmark"
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_landmark"
                            value={values.user_landmark}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_landmark || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Pincode */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="Pincode"
                        validateStatus={
                          touched.user_pincode
                            ? errors.user_pincode
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_pincode
                            ? (errors.user_pincode as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_pincode"
                            value={values.user_pincode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_pincode || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* City */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="City"
                        validateStatus={
                          touched.user_city
                            ? errors.user_city
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_city
                            ? (errors.user_city as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_city"
                            value={values.user_city}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_city || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* State */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="State"
                        validateStatus={
                          touched.user_state
                            ? errors.user_state
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_state
                            ? (errors.user_state as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_state"
                            value={values.user_state}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_state || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                    {/* Country */}
                    <Col {...colLayout}>
                      <AntForm.Item
                        label="Country"
                        validateStatus={
                          touched.user_country
                            ? errors.user_country
                              ? 'error'
                              : 'success'
                            : ''
                        }
                        help={
                          touched.user_country
                            ? (errors.user_country as string)
                            : undefined
                        }
                        labelCol={{
                          className: isEditable ? '' : 'label-no-padding',
                        }}
                      >
                        {isEditable ? (
                          <input
                            className="ant-input"
                            name="user_country"
                            value={values.user_country}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        ) : (
                          <Text>{userDetails?.user_country || '--'}</Text>
                        )}
                      </AntForm.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </div>
          );
        }}
      </Formik>
    </>
  );
};
export default Profile;
