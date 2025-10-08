import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataFile = path.resolve(process.cwd(), "src", "data", "calendar.json");

function readData() {
  try {
    const raw = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function writeData(obj: any) {
  try {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(obj, null, 2), "utf-8");
    return true;
  } catch (e) {
    return false;
  }
}

export async function GET() {
  const data = readData();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = readData();
    // O body deve ser { dateKey: string, exercises: [{name,duration},...] }
    if (!body || !body.dateKey) return NextResponse.json({ ok: false }, { status: 400 });
    data[body.dateKey] = body.exercises || [];
    const ok = writeData(data);
    if (!ok) return NextResponse.json({ ok: false }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
