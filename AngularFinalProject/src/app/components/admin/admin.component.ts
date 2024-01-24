import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'src/app/interfaces/job';
import { User } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  newPositionTitle: string = '';
  showCoWorkersSection: boolean = false;
  showJobsSection: boolean = false;


  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private adminService: AdminService) { }

  ngOnInit() {
    this.fetchUsers();
    this.fetchJobs();
  }

  users: User[] = [];
  jobs: Job[] = [];

  logOut() {
    this.userService.logOut();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response) => {
        console.log('Users fetched successfully:', response);
        this.users = response;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
      }
    });
  }

  fetchJobs(): void {
    this.userService.getJobOptions().subscribe({
      next: (response) => {
        console.log('Job options fetched successfully:', response);
        this.jobs = response;
      },
      error: (error) => {
        console.error('Error fetching job options:', error);
      }
    });
  }

  onDeleteUser(userId: number): void {
    this.adminService.deleteUser(userId).subscribe(
      () => {
        console.log('User deleted successfully');

        this.fetchUsers();
      },
      (error) => {
        console.error('Error deleting user', error);
      }
    );
  }


  onDeleteJob(jobId: number): void {
    this.adminService.deleteJob(jobId).subscribe(
      () => {
        console.log('Job deleted successfully');
        this.fetchJobs();
      },
      (error) => {
        console.error('Error deleting job', error);
      }
    );
  }





  addNewPositionToDatabase() {
    const newPosition = {
      title: this.newPositionTitle,
    };
    this.adminService.addNewPosition(newPosition).subscribe(
      response => {
        console.log('Position added successfully:', response);
        this.newPositionTitle = '';
        this.fetchJobs();
      },
      error => {
        console.error('Error adding position:', error);
      }
    );
  }


  changeUserRole(userIdInput: string, newRoleIdInput: string): void {
    const userId = +userIdInput;
    const newRoleId = +newRoleIdInput;

    this.adminService.updateUserRole(userId, newRoleId).subscribe(
      (result) => {
        console.log('User role updated successfully:', result);

        this.fetchUsers();
      },
      (error) => {
        console.error('Error updating user role:', error);
      }
    );
  }



  toggleSection(section: 'coWorkersSection' | 'jobsSection'): void {
    if (section === 'coWorkersSection') {
      this.showCoWorkersSection = !this.showCoWorkersSection;
    } else if (section === 'jobsSection') {
      this.showJobsSection = !this.showJobsSection;
    }
  }



}



