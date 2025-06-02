// profile-settings.component.ts
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {UserService} from '../../services/user.service';
import {RouterModule} from '@angular/router';
import {DoctorDto} from '../../../models/DoctorDto';
import Swal from 'sweetalert2';
import {SpecialityService} from '../../../admin/adminFeatures/specialities-admin/service/SpecialityService';

@Component({
  selector: 'app-profile-doctor-settings',
  standalone:true,
  imports: [ CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-doctor-settings.component.css',
  encapsulation: ViewEncapsulation.None

})
export class ProfileSettingsComponent implements OnInit {
  doctorForm: FormGroup;
  profilePicturePreview: string | ArrayBuffer | null = null;
  profilePicture: File | null = null;
  // clinicImages: File[] = [];
  clinicImages: File[] = [];
  @ViewChild('clinicFileInput') clinicFileInput!: ElementRef;
  clinicImagePreviews: string[] = [];
  serviceInput = '';
  newService: string = '';
  specialities: any[] = [];


  constructor(private fb: FormBuilder, private http: HttpClient, private userService: UserService,private el: ElementRef, private specialityService: SpecialityService) {
  }

  ngOnInit(): void {
    this.getConnectedUser();
    this.loadSpecialities();
  }
  loadSpecialities(): void {
    this.specialityService.getAllSpecialities().subscribe({
      next: (response) => {
        this.specialities = response;
      },
      error: (err) => {
        console.error('Error loading specialities', err);
      }
    });
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
      services: this.fb.array(user.services.map(e => this.fb.group({
        services_name: [e.services_name, Validators.required]
    }))),
      specialityIds: [user.specialityIds?.[0] ?? null, Validators.required],
      education: this.fb.array(user.education.map(e => this.fb.group({
        degree: [e.degree, Validators.required],
        institute: [e.institute, Validators.required],
        yearOfCompletion: [e.yearOfCompletion, Validators.required]
      }))),

      experience: this.fb.array(user.experience.map(e => this.fb.group({
        hospitalName: [e.hospitalName, Validators.required],
        fromDate: [e.fromDate, Validators.required],
        toDate: [e.toDate, Validators.required],
        designation: [e.designation, Validators.required]
      }))),

      awards: this.fb.array(user.awards.map(a => this.fb.group({
        name: [a.name, Validators.required],
        year: [a.year, Validators.required]
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
      // this.scrollToFirstInvalidControl();

      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields before submitting.',
      });
      return;
    }
    const dto = {
      ...this.doctorForm.value,
      services: this.services.value,
      education: this.education.value,
      experience: this.experience.value,
      awards: this.awards.value,
    };

    if (typeof dto.specialityIds === 'string') {
      dto.specialityIds = [parseInt(dto.specialityIds, 10)];
    }

    if (!Array.isArray(dto.specialityIds)) {
      dto.specialityIds = [dto.specialityIds];
    }

    console.log('SpecialityIds:', dto.specialityIds); // Should show as array [7]
    console.log('Services being submitted:', this.services.value);
    console.log('Full DTO:', dto);

    const formData = new FormData();
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
  onSpecialityChange(id: number) {
    this.doctorForm.get('specialityIds')?.setValue([id]); // force array
  }
  scrollToFirstInvalidControl() {
    const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
      'form .ng-invalid'
    );
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstInvalidControl.focus();
    }
  }


  addEducation() {
    this.education.push(this.fb.group({
      degree: ['', Validators.required],
      institute: ['', Validators.required],
      yearOfCompletion: ['', Validators.required]
    }));
  }

  addExperience() {
    this.experience.push(this.fb.group({
      hospitalName: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      designation: ['', Validators.required]
    }));
  }

  addAward() {
    this.awards.push(this.fb.group({
      name: ['', Validators.required],
      year: ['', Validators.required]
    }));
  }
  addService() {
      this.services.push(this.fb.group({
        services_name: ['', Validators.required]
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
  get services(): FormArray {
    return this.doctorForm.get('services') as FormArray;
  }
  removeService(index: number) {
    this.services.removeAt(index);
  }



}
