// This is a mock implementation. In a real application, this would make an API call
export async function checkRoomAvailability(
  roomType: string,
  floor: string,
  roomNumber: string
): Promise<boolean> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For testing purposes, return true for all rooms except room 201
  return roomNumber !== '201';
} 