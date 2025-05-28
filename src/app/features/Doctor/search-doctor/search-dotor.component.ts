import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink, RouterModule} from '@angular/router';
import {DoctorDto} from '../../../models/DoctorDto';
import {SearchDoctorsService} from './services/searchDoctors.service';
import {FormBuilder, FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-search-dotor',
  standalone:true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './search-dotor.component.html',
  styleUrl: './search-dotor.component.css'
})
export class SearchDotorComponent implements OnInit {
  public doctors: DoctorDto[] = [];
  public filteredDoctors: DoctorDto[] = [];
  public searchTerm: string = '';

  selectedSpecialities: string[] = [];

  availableSpecialities: string[] = []; // Loaded from your doctors list

  availableGenders: string[] = ['Male', 'Female'];

  selectedGenders: string[] = [];
  constructor(
    private doctorService: SearchDoctorsService,
    private actvroute: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors() {
    this.doctorService.getAllDoctors().subscribe({
      next: (response: DoctorDto[]) => {
        this.doctors = response;
        this.filteredDoctors = response;

        const allSpecialities = response.map(doc => doc.specialities.map(s => s.name)).flat();
        this.availableSpecialities = [...new Set(allSpecialities)] as string[];

        this.availableGenders = ['Male', 'Female'];
      },
      error: (err) => {
        console.error('Error while getting doctors:', err);
      }
    });
  }


  onSearchChange() {
    const keyword = this.searchTerm.toLowerCase().trim();

    this.filteredDoctors = this.doctors.filter(doctor => {
      const firstname = doctor.firstname?.toLowerCase().trim() || '';
      const lastname = doctor.lastname?.toLowerCase().trim() || '';
      const city = doctor.city?.toLowerCase().trim() || '';
      const fullName1 = `${firstname} ${lastname}`;
      const fullName2 = `${lastname} ${firstname}`;

      return (
        firstname.includes(keyword) ||
        lastname.includes(keyword) ||
        city.includes(keyword) ||
        fullName1.includes(keyword) ||
        fullName2.includes(keyword)
      );
    });
  }

  // onSpecialityFilterChange(event: any) {
  //   const speciality = event.target.value;
  //
  //   if (event.target.checked) {
  //     this.selectedSpecialities.push(speciality);
  //   } else {
  //     this.selectedSpecialities = this.selectedSpecialities.filter(
  //       (s) => s !== speciality
  //     );
  //   }
  //
  //   this.applyFilters();
  // }

  // onGenderFilterChange(event: any) {
  //   const gender = event.target.value.toLowerCase(); // normalize
  //
  //   if (event.target.checked) {
  //     this.selectedGenders.push(gender);
  //   } else {
  //     this.selectedGenders = this.selectedGenders.filter(g => g !== gender);
  //   }
  //
  //   this.applyFilters();
  // }

  applyFilters() {
    this.filteredDoctors = this.doctors.filter((doctor) => {
      const matchesSearch = this.searchTerm
        ? (doctor.firstname + ' ' + doctor.lastname)
          .toLowerCase()
          .includes(this.searchTerm.toLowerCase())
        : true;

      const matchesSpeciality =
        this.selectedSpecialities.length === 0 ||
        doctor.specialities.some((s) =>
          this.selectedSpecialities.includes(s.name)
        );

      const matchesGender =
        this.selectedGenders.length === 0 ||
        this.selectedGenders.includes(doctor.gender);

      return matchesSearch && matchesSpeciality && matchesGender;
    });
  }
  onGenderCheckboxChange(event: any) {
    const gender = event.target.value.toLowerCase();

    if (event.target.checked) {
      this.selectedGenders.push(gender);
    } else {
      this.selectedGenders = this.selectedGenders.filter(g => g !== gender);
    }
  }

  onSpecialityCheckboxChange(event: any) {
    const speciality = event.target.value;

    if (event.target.checked) {
      this.selectedSpecialities.push(speciality);
    } else {
      this.selectedSpecialities = this.selectedSpecialities.filter(
        (s) => s !== speciality
      );
    }
  }
  onApplyFilters() {
    this.applyFilters();
  }

  // applyFilters() {
  //   this.filteredDoctors = this.doctors.filter((doctor) => {
  //     // const genderMatch =
  //     //   this.selectedGenders.length === 0 ||
  //     //   this.selectedGenders.includes(doctor.gender);
  //
  //     const specialityMatch =
  //       this.selectedSpecialities.length === 0 ||
  //       doctor.speciality.some((spec) =>
  //         this.selectedSpecialities.includes(spec.name)
  //       );
  //
  //     return specialityMatch
  //   });
  // }
  // onSearch(keyword: string) {
  //   if (keyword.trim() === '') {
  //     this.getDoctors(); // Affiche tous les médecins si la recherche est vide
  //   } else {
  //     this.doctorService.searchDoctors(keyword).subscribe({
  //       next: (response: DoctorDto[]) => {
  //         this.doctors = response;
  //       },
  //       error: (err) => {
  //         console.error('Error while searching doctors:', err);
  //       }
  //     });
  //   }
  // }

}
