import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const medicineCount = await prisma.medicine.count();

  return NextResponse.json({
    status: "ok",
    database: "connected",
    medicineCount
  });
}
