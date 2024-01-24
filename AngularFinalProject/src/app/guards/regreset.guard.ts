import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterComponent } from '../components/register/register.component';

@Injectable({
  providedIn: 'root'
})
export class RegresetGuard implements CanDeactivate<RegisterComponent> {
  canDeactivate(component: RegisterComponent): boolean {
    return component.canGoBack();
  }
}
