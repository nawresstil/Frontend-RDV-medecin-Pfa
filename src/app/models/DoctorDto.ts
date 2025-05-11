export interface DoctorDto {
  id: number;
  firstname: string;
  lastname: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  joiningDate: string;
  username: string;
  password?: string;
  confirmPassword?: string;
  oldPassword?: string;
  role: string;
  profilePicture: string;

  aboutMe: string;
  biography: string;

  clinicName: string;
  clinicAddress: string;
  clinicLogo: string;
  clinicImages: string[];
  clinicContact: string;

  isFree: boolean;
  customPrice: number;

  services: string[];
  specialityIds: number[];

  education: any[];  // you can define EducationDto model similarly
  experience: any[];
  awards: any[];
  memberships: string[];
  registrations: any[];
}
