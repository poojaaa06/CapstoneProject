import * as Yup from "yup";
import type { ForgotPasswordFormValues } from "src/types/auth.type";

export const forgotPasswordSchema: Yup.ObjectSchema<ForgotPasswordFormValues> =
  Yup.object({
    user_unique_id: Yup.string()
      .trim()
      .required("Username is required"),
  });