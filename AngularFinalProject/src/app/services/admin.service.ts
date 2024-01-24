import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'https://localhost:44330/api/Admin';

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }



  deleteUser(userId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.apiUrl}/delete-user/${userId}`, { headers });
  }


  deleteJob(jobId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${this.apiUrl}/delete-job/${jobId}`, { headers });
  }


  addNewPosition(newPosition: any): Observable<any> {
    const url = `${this.apiUrl}/add-new-job`;
    return this.http.post(url, newPosition);
  }


  updateUserRole(userId: number, newRoleId: number): Observable<User> {
    const params = { userId: userId, newRoleId: newRoleId };
    const url = `${this.apiUrl}/change-user-role`;
    return this.http.post<User>(url, params);
  }




}








