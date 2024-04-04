import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ProfileApiService } from '../services/api/profile-api.service';
import { Observable, catchError, startWith, timeout } from 'rxjs';
import { Router } from '@angular/router';
import {
  IonTabButton,
  IonTabs,
  IonTabBar,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { UserDto } from '../model/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonIcon,
    IonTabBar,
    IonTabs,
    IonTabButton,
    CommonModule,
  ],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private profileApiService = inject(ProfileApiService);
  private router = inject(Router);

  userNotFound = false;

  authUser$ = this.authService.user$;
  userProfile$: Observable<UserDto | null> = this.profileApiService
    .getProfile()
    .pipe(
      catchError((error) => {
        this.userNotFound = true;
        if (error.status === 404) {
          this.router.navigate(['signup']);
        } else {
          console.error('Error:', error);
        }
        // Necessary to keep the observable alive and prevent infinite loop
        return this.userProfile$;
      })
    );

  constructor() {}
}
