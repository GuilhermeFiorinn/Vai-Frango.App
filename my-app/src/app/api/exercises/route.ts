import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.resolve(process.cwd(), "src", "data", "exercises.json");

export async function GET() {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    const parsed = JSON.parse(raw);
    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json([]);
  }
}
