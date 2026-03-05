import { prisma } from "./prisma";
import { DepartmentName } from "@prisma/client";

async function main() {
  for (const departmentName of Object.values(DepartmentName)) {
    await prisma.department.upsert({
      where: { departmentName },
      update: {},
      create: { departmentName },
    });
  }

  console.log("✅ Departments seeded");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });