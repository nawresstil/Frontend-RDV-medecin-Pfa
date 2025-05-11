import {Component, ElementRef, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ChartOptions, ChartType, ChartDataset, Chart} from 'chart.js';
type ChartDataLabels = string[];  // Optional if you want to type it
@Component({
  selector: 'app-dashboard-admin',
  standalone:true,
  imports: [RouterModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    const ctx = this.el.nativeElement.querySelector('#myChart'); // Get the canvas element
    new Chart(ctx, {
      type: 'line', // Chart type (can be line, bar, pie, etc.)
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40], // Data for the chart
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
