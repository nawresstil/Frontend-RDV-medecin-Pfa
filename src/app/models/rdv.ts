export interface Rdv {
  id: number;
  doctorId: number;       // Match backend's `Long doctorId`
  patientId: number;      // Match backend's `Long patientId`
  date: string;           // Match `LocalDate`, e.g., '2025-05-30'
  startTime: string;      // Match `LocalTime`, e.g., '10:00:00'
  endTime: string;
  createdAt: string;
  status: string;

}
