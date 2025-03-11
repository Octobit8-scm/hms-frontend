import { NextResponse } from 'next/server';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact: string;
}

// Test data for patients
const patients: Patient[] = [
  {
    id: 'P1001',
    name: 'John Doe',
    age: 45,
    gender: 'male',
    contact: '+1-555-0101'
  },
  {
    id: 'P1002',
    name: 'Jane Smith',
    age: 32,
    gender: 'female',
    contact: '+1-555-0102'
  },
  {
    id: 'P1003',
    name: 'Robert Johnson',
    age: 58,
    gender: 'male',
    contact: '+1-555-0103'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log('GET /api/patients - Query params:', { id });

    if (id) {
      const patient = patients.find(p => p.id === id);
      if (!patient) {
        console.log('Patient not found:', id);
        return NextResponse.json(
          { error: 'Patient not found' },
          { status: 404 }
        );
      }
      console.log('Returning patient:', patient);
      return NextResponse.json(patient);
    }

    console.log('Returning all patients:', patients);
    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error in GET /api/patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 