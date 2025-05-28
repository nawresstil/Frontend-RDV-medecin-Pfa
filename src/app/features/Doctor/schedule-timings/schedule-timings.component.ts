import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FormBuilder, FormsModule} from '@angular/forms';
import {Disponibility} from '../../../models/disponibility.model';
import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '../../login/services/authentification.service';
import {DisponibilityService} from './service/disponibility.service';
import {Users} from '../../../models/users';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-schedule-timings',
  standalone:true,
  imports: [RouterModule, CommonModule, FormsModule, HttpClientModule],
  templateUrl: './schedule-timings.component.html',
  styleUrl: './schedule-timings.component.css'
})
export class ScheduleTimingsComponent implements OnInit {

  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDay: string = 'Monday';
  slots: Disponibility[] = [];
  newSlot = { startTime: '', endTime: '', slotDurationMinutes:''};
  timeSlots: string[] = [];
  startTimes: string[] = [];
  filteredEndTimes: string[] = [];

  doctorId!: number;

  public userC: Users;

  constructor(private disponibilityService: DisponibilityService, private formBuilder: FormBuilder ,private authService: AuthenticationService, private userService:UserService) {}

  ngOnInit(): void {
    this.getConnected();
    this.newSlot.startTime = localStorage.getItem('slot_startTime') || '';
    this.newSlot.endTime = localStorage.getItem('slot_endTime') || '';
    this.newSlot.slotDurationMinutes = localStorage.getItem('slot_duration') || '30';

    this.generateTimeSlots(); // initialize on load
  }

  selectDay(day: string) {
    this.selectedDay = day;
  }

  loadDisponibilities() {
    this.disponibilityService.getByDoctor(this.doctorId).subscribe((data) => {
      this.slots = data;
    });
  }

  getSlotsForDay(day: string): Disponibility[] {
    return this.slots.filter((slot) => slot.dayOfWeek === day);
  }

  addSlot() {
    console.log('New Slot:', this.newSlot); // DEBUG

    if (this.newSlot.startTime && this.newSlot.endTime) {
      const slot: Disponibility = {
        id: 0,
        dayOfWeek: this.selectedDay,
        startTime: this.newSlot.startTime,
        endTime: this.newSlot.endTime,
        slotDurationMinutes: Number(this.newSlot.slotDurationMinutes),
        generatedSlots: [],
        doctorId: this.doctorId
      };

      console.log('Slot to send:', slot); // DEBUG

      this.disponibilityService.create(slot).subscribe(() => {
        // Reload slots from backend
        this.loadDisponibilities();

        // Clear form
        this.newSlot = { startTime: '', endTime: '', slotDurationMinutes: '' };

        // Wait for loadDisponibilities to finish, then regenerate
        setTimeout(() => this.generateTimeSlots(), 500); // slight delay to ensure data loads
      });
    }
  }


  deleteSlot(id: number) {
    this.disponibilityService.delete(id).subscribe(() => {
      this.loadDisponibilities();
    });
  }

  generateTimeSlots(): void {
    this.startTimes = [];
    this.timeSlots = [];
    const start = this.parseTimeToMinutes(this.newSlot.startTime);
    const end = this.parseTimeToMinutes(this.newSlot.endTime);
    const duration = +this.newSlot.slotDurationMinutes;

    if (!start || !end || duration <= 0 || start >= end) return;

    for (let time = start; time + duration <= end; time += duration) {
      const from = this.minutesToTimeString(time);
      const to = this.minutesToTimeString(time + duration);
      this.startTimes.push(from);
      this.timeSlots.push(`${from} - ${to}`);
    }

    localStorage.setItem('slot_startTime', this.newSlot.startTime);
    localStorage.setItem('slot_endTime', this.newSlot.endTime);
    localStorage.setItem('slot_duration', this.newSlot.slotDurationMinutes.toString());

    this.filterEndTimes();
  }


  filterEndTimes(): void {
    const startMinutes = this.parseTimeToMinutes(this.newSlot.startTime);

    this.filteredEndTimes = this.timeSlots
      .map(slot => slot.split(' - ')[1])
      .filter(end => this.parseTimeToMinutes(end) > startMinutes);
  }

  parseTimeToMinutes(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  minutesToTimeString(minutes: number): string {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  getConnected() {
    this.userService.getConnectedUser().subscribe(
      (response: Users) => {
        this.userC = response;
        this.doctorId = response.id; // Assurez-vous que l’objet Users contient bien un champ id

        this.loadDisponibilities(); // maintenant que doctorId est défini, on peut charger
      }
    );
  }

}
