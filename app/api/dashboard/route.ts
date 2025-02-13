import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

// Create a single PrismaClient instance and reuse it
const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all data concurrently
    const [tasks, categories, statuses] = await Promise.all([
      prisma.task.findMany({
        include: {
          category: true,
          status: true,
        },
      }),
      prisma.category.findMany(),
      prisma.status.findMany(),
    ]);

    return NextResponse.json({ tasks, categories, statuses });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  } finally {
    // No need to disconnect in serverless environment
    // await prisma.$disconnect();
  }
}
