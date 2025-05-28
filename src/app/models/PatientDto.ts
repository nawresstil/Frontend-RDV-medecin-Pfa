// src/app/models/patient.model.ts

export interface PatientDto {
  id?: number;

  firstname: string;
  lastname: string;

  dateOfBirth: Date;

  email: string;
  phone: string;
  address: string;

  city: string;
  state: string;
  zipCode: string;
  country: string;

  joiningDate: string;

  username: string;
  password: string;
  confirmPassword?: string;
  oldPassword?: string;

  role: string;

  profilePicture: string;

  bloodGroup: string;
}
