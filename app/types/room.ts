export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface Room {
  id: string;
  number: string;
  floor: string;
  type: 'standard' | 'deluxe' | 'suite' | 'icu';
  capacity: number;
  currentOccupancy: number;
  status: RoomStatus;
  price: number;
  facilities: string[];
}

export interface RoomAvailability {
  roomId: string;
  roomNumber: string;
  type: Room['type'];
  availableBeds: number;
  totalBeds: number;
  price: number;
  facilities: string[];
} 