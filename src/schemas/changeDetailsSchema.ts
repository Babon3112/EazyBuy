import * as z from "zod";
import { usernameValidation } from "./usernameSchema";

export const changeDeatailSchema = z.object({
  fullname: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),
  username: usernameValidation,
  mobileno: z
    .string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  email: z.string().email("Invalid email address"),
});
