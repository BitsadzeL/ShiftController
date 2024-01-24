import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ){}
  ngOnInit(): void {
    this.createForm();
  }

  createForm(){
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]]
  });
  }

  Login(){
    if(this.loginForm.valid){
      const userData = this.loginForm.value;
      this.userService.logInUser(userData).subscribe({
        next:(response: any) => {
          console.log('logged in successfully: ',response);
          
          const jwtToken = response;
          localStorage.setItem('token', jwtToken);

          const decodedToken= this.decodeToken(jwtToken);
          const role= decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
          console.log(role)
          

          if(role==='1'){
            this.router.navigate(['/admin']);
          }else if(role=== '2'){
            this.router.navigate(['/worker']);
          }
        },
        error:(error) =>{
          console.log('login failed: ',error);
          alert("Incorrect password or email")
        }
      })
    } else{
      alert("Login unsuccessfull!")
    }
  }

  private decodeToken(token: string): any{
    try{
      return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
      console.error('Error decoding JWT token', e);
      return null;
    }
  }

  goToRegister(){
    this.router.navigate(['/register']);
  }

}
