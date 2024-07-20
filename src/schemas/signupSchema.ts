import * as z from "zod";
import { usernameValidation } from "./usernameSchema";

export const signupSchema = z
  .object({
    fullname: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be at most 100 characters"),
    username: usernameValidation,
    mobileno: z
      .string()
      .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be at most 50 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
