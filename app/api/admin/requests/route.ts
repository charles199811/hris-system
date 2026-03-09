import { NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function GET() {
  const requests = await prisma.request.findMany({
    include: {
      attachments: {
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          attachmentType: true,
        },
      },
      managerEmployee: {
        select: {
          id: true,
          fullName: true,
        },
      },
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  
  return NextResponse.json(requests);
}
