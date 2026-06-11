import * as Yup from "yup";

export const loginSchema = Yup.object({
  user_unique_id: Yup.string().trim().required("Username is required"),
  user_password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])/,
      "Must contain an uppercase letter and a special character",
    ),
  remember: Yup.boolean().required(),
});

export const forgotPasswordSchema = Yup.object({
  user_unique_id: Yup.string().trim().required("Username is required"),
});