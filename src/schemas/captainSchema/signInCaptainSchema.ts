import { z } from "zod";

export const captainCaptainSchema = z.object({
  email: z.email("Please enter a valid email").toLowerCase().trim(),

  password: z.string().min(1, "Password is required"),
});
