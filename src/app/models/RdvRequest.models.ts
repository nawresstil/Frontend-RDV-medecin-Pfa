export interface RdvRequest {
  doctorId: number;
  patientId: number;
  date: string; // ex: "2025-05-23"
  startTime: string;
  endTime: string;
}
