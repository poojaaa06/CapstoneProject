import * as Yup from "yup";
import dayjs from "dayjs";

const thirteenYearsAgo = dayjs()
  .subtract(13, "year")
  .endOf("day")
  .toDate();

export const profileValidationSchema = Yup.object({
  user_first_name: Yup.string()
    .trim()
    .required("First Name is required"),

  user_last_name: Yup.string()
    .trim()
    .required("Last Name is required"),

  user_email: Yup.string()
    .email("Invalid Email")
    .required("Email is required"),

  user_phone: Yup.string()
    .nullable()
    .test(
      "phone",
      "Phone must be 10 digits",
      (value) =>
        !value || /^[0-9]{10}$/.test(value)
    ),

  user_pincode: Yup.string()
    .nullable()
    .test(
      "pincode",
      "Pincode must be 6 digits",
      (value) =>
        !value || /^[0-9]{6}$/.test(value)
    ),

  user_dob: Yup.date()
    .required("Date of Birth is required")
    .max(
      thirteenYearsAgo,
      "User must be at least 13 years old"
    ),
});