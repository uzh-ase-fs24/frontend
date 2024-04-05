import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ProfileApiService } from '../services/api/profile-api.service';
import { EMPTY, Observable, catchError, of, startWith, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import {
  IonTabButton,
  IonTabs,
  IonTabBar,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { User } from '../model/user';

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

  authUser$ = this.authService.user$;
  userProfile$: Observable<User | null> =
    this.authService.userProfileReady.pipe(
      startWith(null),
      switchMap((user) =>
        this.profileApiService.getProfile().pipe(
          catchError((error) => {
            if (error.status === 404) {
              this.router.navigate(['signup']);
            } else {
              console.error('Error:', error);
            }
            return EMPTY;
          })
        )
      )
    );

  constructor() {}
}
