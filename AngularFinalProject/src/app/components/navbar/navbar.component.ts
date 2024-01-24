import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  lang: string = '';

  constructor(private userService: UserService,private translateService:TranslateService) {}

  ngOnInit(): void {
    this.checkLoggedInStatus();
  }

  checkLoggedInStatus(): void {
    this.isLoggedIn = this.userService.isLoggedIn(); 
  }

  logOut(): void {
    this.userService.logOut();
    this.checkLoggedInStatus();
    this.lang = localStorage.getItem('lang') || 'en';
  }


  ChangeLang(lang: any){
    const selectedLanguage = lang.target.value;

    localStorage.setItem('lang', selectedLanguage);

    this.translateService.use(selectedLanguage);
  }
}
