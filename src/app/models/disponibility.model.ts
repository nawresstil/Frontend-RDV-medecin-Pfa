export interface Disponibility {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  generatedSlots?: string[];
  doctorId: number;
}
