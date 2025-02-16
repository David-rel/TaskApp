import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const status = await prisma.status.create({
      data: {
        name: body.name,
        color: body.color,
      },
    });
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create status" },
      { status: 500 }
    );
  }
}
