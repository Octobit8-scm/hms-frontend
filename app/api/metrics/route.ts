import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get various metrics from the database
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      activeAppointments,
      totalDepartments,
      totalBeds,
      occupiedBeds,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      prisma.department.count(),
      prisma.bed.count(),
      prisma.bed.count({
        where: {
          status: 'OCCUPIED',
        },
      }),
    ]);

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

# HELP hospital_total_beds Total number of hospital beds
# TYPE hospital_total_beds gauge
hospital_total_beds ${totalBeds}

# HELP hospital_occupied_beds Number of occupied beds
# TYPE hospital_occupied_beds gauge
hospital_occupied_beds ${occupiedBeds}

# HELP hospital_bed_occupancy_rate Bed occupancy rate
# TYPE hospital_bed_occupancy_rate gauge
hospital_bed_occupancy_rate ${totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0}
`;

    return new NextResponse(metrics, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error collecting metrics:', error);
    return new NextResponse('Error collecting metrics', { status: 500 });
  }
} 