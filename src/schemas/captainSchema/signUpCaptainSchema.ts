import { z } from "zod";

export const signUpCaptainZod = z.object({
  fullname: z.object({
    firstname: z
      .string()
      .min(3, "Firstname must be at least 3 characters long")
      .trim(),
    lastname: z
      .string()
      .min(3, "Lastname must be at least 3 characters long")
      .trim(),
  }),

  email: z.email("Please enter a valid email").toLowerCase().trim(),

  password: z.string().min(6, "Password must be at least 6 characters long"),

  vehicle: z.object({
    color: z.string().min(3, "Color must be at least 3 characters long").trim(),
    plate: z
      .string()
      .min(3, "Plate must be at least 3 characters long")
      .trim()
      .toUpperCase(),
    capacity: z
      .number()
      .min(1, "Capacity must be at least 1")
      .int("Capacity must be a whole number"),
    vehicleType: z.enum(["car", "motorcycle", "auto"], {
      message: "Vehicle type must be car, motorcycle, or auto",
    }),
  }),
});
