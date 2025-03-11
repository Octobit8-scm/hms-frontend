export interface StaffBase {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on_leave';
}

export interface Doctor extends StaffBase {
  specialization: string;
  qualification: string;
  licenseNumber: string;
  experience: number;
  department: string;
  consultationFee: number;
  availableSlots: {
    day: string;
    slots: string[];
  }[];
}

export interface Pharmacist extends StaffBase {
  licenseNumber: string;
  qualification: string;
  experience: number;
  shift: 'morning' | 'evening' | 'night';
  specialization: string[];
} 