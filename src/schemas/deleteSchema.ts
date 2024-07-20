import { z } from "zod";

export const deleteSchema = z
  .object({
    message: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.message === "DELETE", {
    message: "You must type DELETE here.",
    path: ["message"],
  });
