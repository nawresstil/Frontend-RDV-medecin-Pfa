// profile-settings.component.ts
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {RouterModule} from '@angular/router';
import {DoctorDto} from '../../../models/DoctorDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-doctor-settings',
  standalone:true,
  imports: [ CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-doctor-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit {
  doctorForm: FormGroup;
  profilePicturePreview: string | ArrayBuffer | null = null;
  profilePicture: File | null = null;
  // clinicImages: File[] = [];
  clinicImages: File[] = [];
  @ViewChild('clinicFileInput') clinicFileInput!: ElementRef;
  clinicImagePreviews: string[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient, private userService: UserService) {
    // this.doctorForm = this.fb.group({
    //   id: [304],
    //   firstname: ['imen'],
    //   lastname: ['ben ahmed'],
    //   dateOfBirth: ['1980-05-20'],
    //   email: ['imen@gmail.com'],
    //   phone: ['1234567'],
    //   address: ['123 Street'],
    //   city: ['Paris'],
    //   state: ['Ile-de-France'],
    //   zipCode: ['75000'],
    //   country: ['France'],
    //   joiningDate: ['2022-01-01'],
    //   username: ['doctor2.doctor'],
    //   oldPassword: ['123456'],
    //   password: ['123456'],
    //   confirmPassword: ['123456'],
    //   gender: ['female'],
    //   aboutMe: ['Dentistt'],
    //   biography: ['Very patient doctor'],
    //   clinicName: ['Heart Center'],
    //   clinicAddress: ['123 Clinic Street'],
    //   clinicContact: ['987654321'],
    //   free: [false],
    //   customPrice: [75.0],
    //   services: [['Cardiology', 'General Checkup']],
    //   specialityIds: [[1, 2]],
    //   education: [[{ degree: 'MBBSd', institute: 'Harvardd', yearOfCompletion: 2015 }]],
    //   experience: [[{ hospitalName: 'NY Hospital', designation: 'Doctor', fromDate: '2015', toDate: '2020' }]],
    //   awards: [[{ name: 'Best Doctor Awardd', year: 2020 }]],
    //   memberships: [['Medical Association USAAAAAAA']],
    // });
  }

  ngOnInit(): void {
    this.getConnectedUser();
  }

  getConnectedUser(): void {
    this.userService.getConnectedUser().subscribe((user: DoctorDto) => {
      this.initForm(user);
      this.profilePicturePreview = user.profilePicture;

      // Set clinic images previews from backend
      if (user.clinicImages && user.clinicImages.length > 0) {
        this.clinicImagePreviews = user.clinicImages;
      }
    });
  }

  initForm(user: DoctorDto): void {
    this.doctorForm = this.fb.group({
      id: [user.id],
      firstname: [user.firstname, Validators.required],
      lastname: [user.lastname, Validators.required],
      dateOfBirth: [new Date(user.dateOfBirth).toISOString().substring(0, 10)],
      email: [user.email],
      phone: [user.phone, Validators.required],
      address: [user.address],
      city: [user.city],
      state: [user.state],
      zipCode: [user.zipCode],
      country: [user.country],
      joiningDate: [user.joiningDate],
      username: [user.username],
      oldPassword: [''],
      password: [''],
      confirmPassword: [''],
      gender: [user.gender],
      aboutMe: [user.aboutMe],
      biography: [user.biography],
      clinicName: [user.clinicName],
      clinicAddress: [user.clinicAddress],
      clinicContact: [user.clinicContact],
      free: [user.isFree],
      customPrice: [user.customPrice],
      services: [user.services],
      specialityIds: [user.specialityIds],
      education: this.fb.array(user.education.map(e => this.fb.group({
        degree: [e.degree],
        institute: [e.institute],
        yearOfCompletion: [e.yearOfCompletion]
      }))),

      experience: this.fb.array(user.experience.map(e => this.fb.group({
        hospitalName: [e.hospitalName],
        fromDate: [e.fromDate],
        toDate: [e.toDate],
        designation: [e.designation]
      }))),

      awards: this.fb.array(user.awards.map(a => this.fb.group({
        name: [a.name],
        year: [a.year]
      })))
    });
  }
  onProfilePictureChange(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.profilePicture = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicturePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onClinicImagesChange(event: any) {
    const files: FileList = event.target.files;
    this.clinicImages = [];
    this.clinicImagePreviews = [];

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.clinicImages.push(file); // Keep file for upload

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.clinicImagePreviews.push(e.target.result); // Keep base64 for preview
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeClinicImage(index: number) {
    this.clinicImages.splice(index, 1);
    this.clinicImagePreviews.splice(index, 1);
    if (this.clinicFileInput) {
      this.clinicFileInput.nativeElement.value = '';
    }
  }


  onSubmit() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();

      Swal.fire({
        icon: 'error',
        title: 'Form Invalid',
        text: 'Please fill in all required fields correctly.',
      });
      return;
    }
    const formData = new FormData();

    const dto = this.doctorForm.value;
    formData.append('doctorDto', JSON.stringify(dto));

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }

    this.clinicImages.forEach((file, index) => {
      formData.append('clinicImages', file);
    });

    this.http.put('http://localhost:8083/user/doctor/profile', formData).subscribe({
      next: (response) => {
        console.log('Success', response),
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          text: 'Your profile has been updated successfully!',
        });
      },
      error: (error) => {
         console.error('Error', error),

          Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: 'Something went wrong while updating your profile.',
        });
        console.error('Update error:', error);

      }
    });
  }

  addEducation() {
    this.education.push(this.fb.group({
      degree: [''],
      institute: [''],
      yearOfCompletion: ['']
    }));
  }

  addExperience() {
    this.experience.push(this.fb.group({
      hospitalName: [''],
      fromDate: [''],
      toDate: [''],
      designation: ['']
    }));
  }

  addAward() {
    this.awards.push(this.fb.group({
      name: [''],
      year: ['']
    }));
  }
  get education(): FormArray {
    return this.doctorForm.get('education') as FormArray;
  }
  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  get experience(): FormArray {
    return this.doctorForm.get('experience') as FormArray;
  }
  removeExperience(index: number) {
    this.experience.removeAt(index);
  }
  get awards(): FormArray {
    return this.doctorForm.get('awards') as FormArray;
  }
  removeAward(index: number) {
    this.awards.removeAt(index);
  }
}
