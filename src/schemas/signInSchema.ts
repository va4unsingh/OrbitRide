import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(5, { message: "Email must be at least 5 characters long" }),
  password: z.string().min(1, { message: "Password is required" }), // Adjust min length if needed
});
