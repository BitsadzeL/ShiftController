import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/interfaces/job';
import { UserService } from 'src/app/services/user.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ScheduleRequest } from 'src/app/interfaces/schedule-request';
import { Schedule } from 'src/app/interfaces/schedule';




@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {


  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private scheduleService: ScheduleService
  ) { }


  
  selectedDate: Date = new Date();
  weekDays: Date[] = [];
  
  schedules: Schedule[] = [];
  selectedShift:string="";
  private currentDate: Date = new Date();
  alljobs: Job[] = [];
  scheduleId!: number;
  roleID!:string;



  ngOnInit() {
    this.getJobs();
    this.updateWeekDays();
    this.scheduleService.getAllSchedules().subscribe(schedules => {
      console.log('All Schedules:', schedules);
      
      this.schedules = schedules.filter(schedule => schedule.isApproved);
    });
    this.updateRole();

  }



  private updateRole() {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const jwt = this.decodeToken(jwtToken);
      this.roleID = jwt?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
  }



  updateWeekDays() {
    this.weekDays = this.getWeekDates();
    
  }



  
  getShifts(roleName: string, day: Date): { title: string, isMorning: boolean }[] {
    const shifts = this.schedules.filter(s => this.compDates(this.getDateObj(s.start_time), day) && roleName == s.jobTitle);
  
    return shifts.map(shift => {
      const shiftStart = this.getDateObj(shift.start_time);
      const isMorning = shiftStart.getHours() >= 8 && shiftStart.getHours() < 16;
      const period = isMorning ? "Morning" : "Evening";
  
      return {
        title: `${period} - ${shift.firstName} ${shift.lastName}`,
        isMorning: isMorning
      };
    }).sort((a, b) => a.isMorning ? -1 : b.isMorning ? 1 : 0);
  }
  


  compDates(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }
  


  getDateObj(date: string) {
    return new Date(date);
  }



  addSchedule(): void {
    const jwtToken = localStorage.getItem('token');
  
    if (jwtToken) {
      const jwt = this.decodeToken(jwtToken);
      const workerID = jwt?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.roleID= jwt?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  
      if (this.selectedDate && this.selectedShift) {
        const startTime: Date = new Date;
        const endTime: Date = new Date;
  
        if (this.selectedShift === 'morning') {
          startTime.setHours(8, 0, 0);
          endTime.setHours(16, 0, 0);
        } else if (this.selectedShift === 'evening') {
          startTime.setHours(16, 0, 0);
          endTime.setHours(24, 0, 0);
        }
  
        const scheduleRequest: ScheduleRequest = {
          start_time: startTime,
          end_time: endTime,
          userId: workerID
        };
  
        this.scheduleService.addScheduleRequest(scheduleRequest).subscribe(
          (response) => {
            console.log('Schedule request added successfully:', response);
            
          },
          (error) => {
            console.error('Error adding schedule request:', error);
          }
        );
      } else {
        console.error('Invalid date or shift selection.');
      }
    }
  }
  
  
  

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding JWT token', e);
      return null;
    }
  }


  updateSelectedDate(event: any): void {
    this.selectedDate = new Date(event);
  }


  getJobs(): void {
    this.userService.getJobOptions().subscribe({
      next: (response) => {
        console.log('Job options fetched successfully:', response);
        this.alljobs = response;
      },
      error: (error) => {
        console.error('Error fetching job options:', error);
      }
    });
  }


  getWeekDates(): Date[] {
    let startOfWeek = this.WeekStart(new Date(this.currentDate));
    let dates = [new Date(startOfWeek)];

    for (let i = 1; i < 7; i++) {
      let nextDay = new Date(startOfWeek);
      nextDay.setDate(nextDay.getDate() + i);
      dates.push(nextDay);
    }

    return dates;
  }

  WeekStart(date: Date): Date {
    let day = date.getDay();
    let diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  }

  PreviousWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateWeekDays();
  }

  NextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateWeekDays();

  }

  CurrentWeek(): string {
    let start = this.WeekStart(new Date(this.currentDate));
    let end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toDateString()} - ${end.toDateString()}`;
  }

}
