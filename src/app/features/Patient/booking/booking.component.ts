import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DisponibilityService } from '../../Doctor/schedule-timings/service/disponibility.service';
import { DisponibilityDto } from '../../../models/disponibilityDto.model';
import { BookingService } from './services/booking.service';
import { RdvRequest } from '../../../models/RdvRequest.models';
import { UserService } from '../../services/user.service';
import { Users } from '../../../models/users';
import { DoctorDto } from '../../../models/DoctorDto';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterModule], // Add other modules if needed
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  disponibilities: DisponibilityDto[] = [];
  doctor: DoctorDto | null = null;
  groupedDisponibilities: {
    day: string;
    date: string;
    slots: {
      dispId: number;
      slot: string;
    }[];
  }[] = [];

  confirmedAppointments: {
    date: string;        // format: yyyy-MM-dd
    startTime: string;   // format: HH:mm
    endTime: string;     // format: HH:mm
  }[] = [];


  selectedSlot: string | null = null;
  selectedDisponibilityId: number | null = null;
  selectedDoctorId: number | null = null;
  connectedUser: Users | null = null;

  constructor(
    private route: ActivatedRoute,
    private disponibilityService: DisponibilityService,
    private bookingService: BookingService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const doctorIdParam = this.route.snapshot.paramMap.get('doctorId');
    if (doctorIdParam) {
      this.selectedDoctorId = +doctorIdParam;

      this.disponibilityService.getDisponibilitiesByDoctor(this.selectedDoctorId).subscribe({
        next: (data) => {
          this.disponibilities = data;
          this.groupDisponibilities();
        },
        error: (err) => {
          console.error('Error loading disponibilities:', err);
        }
      });

      this.userService.getUserById(this.selectedDoctorId).subscribe({
        next: (doctor: DoctorDto) => {
          this.doctor = doctor;
        },
        error: (err) => {
          console.error('Error loading doctor info:', err);
        }
      });
      // Fetch confirmed appointments for this doctor
      this.bookingService.getConfirmedAppointmentsByDoctor(this.selectedDoctorId).subscribe({
        next: (confirmedRdvList) => {
          this.confirmedAppointments = confirmedRdvList;
        },
        error: (err) => {
          console.error('Error fetching confirmed appointments:', err);
        }
      });
    }

    this.userService.getConnectedUser().subscribe({
      next: (user: Users) => {
        this.connectedUser = user;
      },
      error: (err) => {
        console.error('Error fetching connected user:', err);
      }
    });



  }

  selectSlot(disponibilityId: number, slot: string): void {
    this.selectedSlot = slot;
    this.selectedDisponibilityId = disponibilityId;
  }

  bookSlot(): void {
    if (!this.selectedDisponibilityId || !this.selectedSlot || !this.selectedDoctorId || !this.connectedUser?.id) {
      alert('Missing required information for booking.');
      return;
    }

    const selectedDisp = this.disponibilities.find(d => d.id === this.selectedDisponibilityId);
    if (!selectedDisp) {
      alert('Selected disponibility not found.');
      return;
    }

    const [startTime, endTime] = this.selectedSlot.split(' - ');
    const date = this.getNextDateFromDay(selectedDisp.dayOfWeek);

    if (!date) {
      alert('Invalid day of week in disponibility.');
      return;
    }

    const bookingRequest: RdvRequest = {
      doctorId: this.selectedDoctorId,
      patientId: this.connectedUser.id,
      date: date,
      startTime: startTime.trim(),
      endTime: endTime.trim(),
    };

    this.bookingService.bookAppointment(bookingRequest).subscribe({
      next: () => alert('Appointment booked!'),
      error: err => {
        console.error('Booking failed:', err);
        alert('Failed to book appointment.');
      }
    });
  }
  isSlotBooked(dateStr: string, slot: string): boolean {
    const [startTime, endTime] = slot.split(' - ').map(t => t.trim() + ':00'); // ajoute ":00"
    return this.confirmedAppointments.some(app =>
      app.date === dateStr &&
      app.startTime === startTime &&
      app.endTime === endTime
    );
  }

  private groupDisponibilities(): void {
    const grouped: {
      [key: string]: { day: string; date: string; dateObj: Date; slots: { dispId: number; slot: string }[] }
    } = {};

    for (const disp of this.disponibilities) {
      const dateStr = this.getNextDateFromDay(disp.dayOfWeek);
      if (!dateStr) continue;

      const dateObj = new Date(dateStr);
      const formattedDate = this.formatDateWithDay(dateStr);

      if (!grouped[dateStr]) {
        grouped[dateStr] = {
          day: disp.dayOfWeek,
          date: formattedDate,
          dateObj,
          slots: []
        };
      }

      disp.generatedSlots?.forEach(slot => {
        grouped[dateStr].slots.push({
          dispId: disp.id,
          slot: slot
        });
      });
    }

    this.groupedDisponibilities = Object.values(grouped)
      .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
      .map(group => ({
        day: group.day,
        date: group.date, // string formatée
        dateObj: group.dateObj, // objet Date ajouté ici
        slots: group.slots.sort((a, b) => {
          const [startA] = a.slot.split(' - ');
          const [startB] = b.slot.split(' - ');
          return startA.localeCompare(startB);
        })
      }));

  }

  private getNextDateFromDay(dayOfWeek: string): string | null {
    const daysMap: { [key: string]: number } = {
      'SUNDAY': 0,
      'MONDAY': 1,
      'TUESDAY': 2,
      'WEDNESDAY': 3,
      'THURSDAY': 4,
      'FRIDAY': 5,
      'SATURDAY': 6,
    };

    const today = new Date();
    const todayDay = today.getDay();
    const targetDay = daysMap[dayOfWeek.toUpperCase()];
    if (targetDay === undefined) return null;

    const daysUntilTarget = (targetDay + 7 - todayDay) % 7 || 7;
    const resultDate = new Date(today);
    resultDate.setDate(today.getDate() + daysUntilTarget);

    return resultDate.toISOString().split('T')[0];
  }

  private formatDateWithDay(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }
}
