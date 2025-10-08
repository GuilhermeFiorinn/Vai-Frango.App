import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(request: Request) {
  try {
    const dataFile = path.resolve(process.cwd(), 'src', 'data', 'profile.json');
    const fileContents = await fs.readFile(dataFile, 'utf8');
    
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao ler os dados do profile.' }, { status: 500 });
  }
}