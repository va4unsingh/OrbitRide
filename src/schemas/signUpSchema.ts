import { z } from "zod";

export const signUpZod = z.object({
  fullname: z.object({
    firstname: z
      .string()
      .min(3, { message: "First name must be at least 3 characters long" }),
    lastname: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters long" })
      .optional(),
  }),
  email: z
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" }),
  password: z.string().min(1, { message: "Password is required" }),
});
