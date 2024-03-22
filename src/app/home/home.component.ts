import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { ProfileApiService } from '../services/api/profile-api.service';
import { EMPTY, Observable, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonButton, IonSpinner, CommonModule],
  providers: [ProfileApiService],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private profileApiService = inject(ProfileApiService);
  private router = inject(Router);

  authUser$ = this.authService.user$;
  userProfile$: Observable<any> = this.profileApiService.getProfile().pipe(
    catchError((error) => {
      console.log('Error:', error);
      if (error.status === 404) {
        this.router.navigate(['/signup']);
      } else {
        console.log('Error:', error);
      }
      return EMPTY;
    })
  );
  constructor() {}

  logout(): void {
    this.authService.logout();
  }
}
