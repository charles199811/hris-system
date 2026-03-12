import { z } from "zod";
import { formatNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";
import { Country, UserRole } from "@prisma/client";

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

//Schema for updating the user profile
const optionalProfileText = z.string().trim().max(1000).optional();
const optionalProfileLink = z
  .string()
  .trim()
  .url("Enter a valid LinkedIn URL")
  .or(z.literal(""))
  .optional();
const optionalProfileDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .or(z.literal(""))
  .optional();

const updateBasicUserSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),
  email: z.string().trim().email("Enter a valid email"),
});

export const updateProfileSchema = updateBasicUserSchema.extend({
  about: optionalProfileText,
  linkedIn: optionalProfileLink,
  hobbies: optionalProfileText,
  superpowers: optionalProfileText,
  mostFascinatingTrip: optionalProfileText,
  dreamTravelDestination: z.string().trim().max(255).optional(),
  dateOfBirth: optionalProfileDate,
});

//Schema to update user
export const updateUserSchema = updateBasicUserSchema.extend({
  id: z.string().min(1, "ID is required"),
  role: z.nativeEnum(UserRole),
  country: z.nativeEnum(Country).nullable().optional(),
});

// ✅ Schema for admin create user (same as signup form)
export const createUserSchema = signUpFormSchema.and(
  z.object({
    role: z.nativeEnum(UserRole).optional(), // default in action
    country: z.nativeEnum(Country).nullable().optional(),
  })
);
