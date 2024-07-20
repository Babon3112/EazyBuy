import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be atleast 8 charecters" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be atleast 8 charecters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
