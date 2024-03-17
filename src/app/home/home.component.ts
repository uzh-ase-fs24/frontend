import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';
import { ProfileApiService } from '../services/api/profile-api.service';
import { EMPTY, catchError, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonButton, IonSpinner, CommonModule],
  // providers: [ProfileApiService],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private profileApiService = inject(ProfileApiService);
  private router = inject(Router);

  authUser$ = this.authService.getUser();
  userProfile$ = this.profileApiService.getProfile().pipe(
    catchError((error) => {
      console.log('Error:', error);
      if (error.status === 404) {
        this.router.navigate(['/signup']);
      } else {
        console.log('Error:', error);
      }
      // TODO: Return empty when the API is ready
      return of({ username: 'test' });
    })
  );
  constructor() {}

  logout(): void {
    this.authService.logout();
  }
}
