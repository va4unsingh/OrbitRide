import { z } from "zod";

export const signInCaptainZod = z.object({
  email: z.email("Please enter a valid email").toLowerCase().trim(),

  password: z.string().min(1, "Password is required"),
});
