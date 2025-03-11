export type AdmissionType = 'emergency' | 'planned';
export type AdmissionStatus = 'active' | 'discharged';

export interface Admission {
  id: string;
  patientId: string;
  roomId: string;
  admissionDate: string;
  admissionType: AdmissionType;
  status: AdmissionStatus;
  expectedDuration: number;
  notes: string;
  dischargedAt?: string;
}

export interface AdmissionFormData {
  patientId: string;
  roomId: string;
  admissionType: AdmissionType;
  expectedDuration: number;
  notes: string;
} 