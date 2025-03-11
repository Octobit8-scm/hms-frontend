import { NextResponse } from 'next/server';
import type { Room } from '@/app/types/room';

// In-memory storage for demo purposes
let admissions: any[] = [];
let rooms: Room[] = []; // This would be replaced with a database in production

export async function POST(request: Request) {
  try {
    const admissionData = await request.json();
    const { roomId, patientId } = admissionData;

    // Find the room
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check if room is available
    if (room.status !== 'available') {
      return NextResponse.json(
        { error: 'Room is not available' },
        { status: 400 }
      );
    }

    // Check if room has capacity
    if (room.currentOccupancy >= room.capacity) {
      return NextResponse.json(
        { error: 'Room is at full capacity' },
        { status: 400 }
      );
    }

    // Create admission record
    const admission = {
      id: Date.now().toString(),
      ...admissionData,
      status: 'active',
      admittedAt: new Date().toISOString()
    };

    // Update room status
    const roomIndex = rooms.findIndex(r => r.id === roomId);
    rooms[roomIndex] = {
      ...room,
      currentOccupancy: room.currentOccupancy + 1,
      status: room.currentOccupancy + 1 >= room.capacity ? 'occupied' : 'available'
    };

    admissions.push(admission);

    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const patientId = searchParams.get('patientId');
  const roomId = searchParams.get('roomId');
  const status = searchParams.get('status');

  let filtered = [...admissions];

  if (patientId) {
    filtered = filtered.filter(a => a.patientId === patientId);
  }
  if (roomId) {
    filtered = filtered.filter(a => a.roomId === roomId);
  }
  if (status) {
    filtered = filtered.filter(a => a.status === status);
  }

  return NextResponse.json(filtered);
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const admissionIndex = admissions.findIndex(a => a.id === id);
    
    if (admissionIndex === -1) {
      return NextResponse.json(
        { error: 'Admission record not found' },
        { status: 404 }
      );
    }

    // If discharge
    if (status === 'discharged') {
      const admission = admissions[admissionIndex];
      const room = rooms.find(r => r.id === admission.roomId);
      
      if (room) {
        const roomIndex = rooms.findIndex(r => r.id === room.id);
        rooms[roomIndex] = {
          ...room,
          currentOccupancy: room.currentOccupancy - 1,
          status: 'available'
        };
      }
    }

    admissions[admissionIndex] = {
      ...admissions[admissionIndex],
      status,
      dischargedAt: status === 'discharged' ? new Date().toISOString() : undefined
    };

    return NextResponse.json(admissions[admissionIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 