"use server";

import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Country, Gender } from "@prisma/client";

function safeJsonParse(v: string) {
  try {
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

export async function updateEmployeeProfile(formData: FormData) {
  const id = String(formData.get("id") || "");

  const countryRaw = String(formData.get("country") || "");
  const genderRaw = String(formData.get("gender") || "");

  const nationalId = String(formData.get("nationalId") || "").trim() || null;
  const phoneNo = String(formData.get("phoneNo") || "").trim() || null;

  const addressText = String(formData.get("address") || "").trim();
  const address = addressText ? safeJsonParse(addressText) : null;

  // enums (allow empty => null)
  const country = countryRaw ? (countryRaw as Country) : null;
  const gender = genderRaw ? (genderRaw as Gender) : null;

  const departmentId = String(formData.get("departmentId") || "");
  if (!departmentId) throw new Error("Department is required");

  await prisma.employee.update({
    where: { id },
    data: {
      country,
      nationalId,
      phoneNo,
      gender,
      address,
      department: { connect: { id: departmentId } }, 
    },
  });

  // refresh both edit page and employees list
  revalidatePath(`/admin/employees/${id}/edit`);
  revalidatePath(`/admin/employees/employees-with-role`);

  redirect(`/admin/employees/${id}/edit`);
}