import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NgApexchartsModule, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis?: ApexXAxis;
  labels?: string[];
  title?: ApexTitleSubtitle;
  responsive?: ApexResponsive[];
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzStatisticModule,
    NzProgressModule,
    NzTableModule,
    NgApexchartsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // KPI mock veriler
  workoutsThisWeek = 3;
  weeklyGoal = 5;
  caloriesThisWeek = 8700;
  activeDays = 4;

  // Chart config
  workoutTrend!: Partial<ChartOptions>;
  muscleSplit!: Partial<ChartOptions>;
  nutritionSplit!: Partial<ChartOptions>;

  recentWorkouts = [
    { name: 'Chest Day', date: '2025-09-05', summary: 'Bench Press, Incline DB Press' },
    { name: 'Leg Day', date: '2025-09-07', summary: 'Squats, Leg Press, Calf Raise' },
    { name: 'Pull Day', date: '2025-09-08', summary: 'Deadlift, Pull-ups, Barbell Row' },
  ];

  ngOnInit(): void {
    this.setupCharts();
  }

  setupCharts() {
    // Line chart (workout trend)
    this.workoutTrend = {
      series: [{ name: 'Workouts', data: [1, 0, 1, 0, 1, 0, 2] }],
      chart: { type: 'line', height: 250 },
      xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      title: { text: 'Workouts This Week' }
    };

    // Bar chart (muscle split)
    this.muscleSplit = {
      series: [{ name: 'Sets', data: [12, 9, 7, 5, 4] }],
      chart: { type: 'bar', height: 250 },
      xaxis: { categories: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'] },
      title: { text: 'Muscle Group Split' }
    };

    // Donut chart (nutrition)
    this.nutritionSplit = {
      series: [40, 35, 25],
      chart: { type: 'donut', height: 250 },
      labels: ['Protein', 'Carbs', 'Fat'],
      title: { text: 'Nutrition Breakdown' },
      responsive: [{ breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } }]
    };
  }
}
