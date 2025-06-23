import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Instantiate Prisma once per lambda
const prisma = new PrismaClient();

/**
 * GET /api/vehicles – return list of vehicles
 */
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Failed to fetch vehicles', error);
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
  }
}
