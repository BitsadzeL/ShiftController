// schedule.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScheduleRequest } from '../interfaces/schedule-request';
import { Schedule } from '../interfaces/schedule';


@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = 'https://localhost:44330/api/Worker';

  constructor(private http: HttpClient) {}

  addScheduleRequest(request: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-schedule-request`, request);
  }

  getAllSchedules(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`https://localhost:44330/api/User/dashboard`);
  }

  
}
