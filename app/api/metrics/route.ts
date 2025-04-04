import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock metrics data
    const totalPatients = 150;
    const totalDoctors = 25;
    const totalAppointments = 300;
    const activeAppointments = 50;
    const totalDepartments = 10;
    const totalBeds = 200;
    const occupiedBeds = 120;

    // Format metrics in Prometheus format
    const metrics = `
# HELP hospital_total_patients Total number of registered patients
# TYPE hospital_total_patients gauge
hospital_total_patients ${totalPatients}

# HELP hospital_total_doctors Total number of doctors
# TYPE hospital_total_doctors gauge
hospital_total_doctors ${totalDoctors}

# HELP hospital_total_appointments Total number of appointments
# TYPE hospital_total_appointments gauge
hospital_total_appointments ${totalAppointments}

# HELP hospital_active_appointments Number of active appointments
# TYPE hospital_active_appointments gauge
hospital_active_appointments ${activeAppointments}

# HELP hospital_total_departments Total number of departments
# TYPE hospital_total_departments gauge
hospital_total_departments ${totalDepartments}

# HELP hospital_total_beds Total number of beds
# TYPE hospital_total_beds gauge
hospital_total_beds ${totalBeds}

# HELP hospital_occupied_beds Number of occupied beds
# TYPE hospital_occupied_beds gauge
hospital_occupied_beds ${occupiedBeds}
`;

    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return new NextResponse('Error fetching metrics', { status: 500 });
  }
} 