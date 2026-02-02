import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";


//Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 charachters"),
});

//Schema for signUp users in
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name should be at least 3 charachters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 charachters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 charachters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

