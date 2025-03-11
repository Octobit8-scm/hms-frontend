import { NextResponse } from 'next/server';
import type { Room } from '@/app/types/room';

// Test data for rooms
let rooms: Room[] = [
  {
    id: 'R101',
    number: '101',
    floor: '1',
    type: 'standard',
    capacity: 2,
    currentOccupancy: 0,
    status: 'available',
    price: 100,
    facilities: ['bed', 'bathroom', 'tv']
  },
  {
    id: 'R102',
    number: '102',
    floor: '1',
    type: 'deluxe',
    capacity: 1,
    currentOccupancy: 0,
    status: 'available',
    price: 200,
    facilities: ['bed', 'bathroom', 'tv', 'wifi', 'minibar']
  },
  {
    id: 'R201',
    number: '201',
    floor: '2',
    type: 'icu',
    capacity: 1,
    currentOccupancy: 0,
    status: 'available',
    price: 500,
    facilities: ['medical equipment', 'monitoring system', 'oxygen supply']
  }
];

export async function GET() {
  try {
    console.log('GET /api/rooms - Returning rooms:', rooms);
    return NextResponse.json(rooms);
  } catch (error) {
    console.error('Error in GET /api/rooms:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const room = await request.json();
    
    // Validate required fields
    if (!room.number || !room.floor || !room.type || !room.capacity || !room.price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for duplicate room number
    if (rooms.some(r => r.number === room.number)) {
      return NextResponse.json(
        { error: 'Room number already exists' },
        { status: 400 }
      );
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      ...room,
      currentOccupancy: 0,
      status: 'available',
      facilities: room.facilities || []
    };

    rooms.push(newRoom);
    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const roomIndex = rooms.findIndex(r => r.id === id);
    
    if (roomIndex === -1) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    rooms[roomIndex] = {
      ...rooms[roomIndex],
      status
    };

    return NextResponse.json(rooms[roomIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const initialLength = rooms.length;
    rooms = rooms.filter(r => r.id !== id);
    
    if (rooms.length === initialLength) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
  }
} 