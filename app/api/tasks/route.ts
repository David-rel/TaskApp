import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        dueDate: new Date(body.dueDate),
        priorityId: body.priority,
        categoryId: body.categoryId,
        statusId: body.statusId,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
