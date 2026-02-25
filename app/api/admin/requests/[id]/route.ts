import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params; // ✅ await params
    const body = await req.json();

    const updated = await prisma.request.update({
      where: { id },
      data: { status: body.status },
    });

    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: "Request Status Updated",
        message: `Your request status is now ${body.status}`,
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 },
    );
  }
}
