import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const priority = await prisma.priority.create({
      data: {
        name: body.name,
        color: body.color,
      },
    });
    return NextResponse.json(priority);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create priority" },
      { status: 500 }
    );
  }
}
