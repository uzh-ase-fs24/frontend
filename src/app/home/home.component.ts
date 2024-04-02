import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { ProfileApiService } from '../services/api/profile-api.service';
import { EMPTY, Observable, catchError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private authService = inject(AuthService);
  private profileApiService = inject(ProfileApiService);
  private router = inject(Router);

  authUser$ = this.authService.user$;
  userProfile$: Observable<any> = this.profileApiService.getProfile().pipe(
    catchError((error) => {
      if (error.status === 404) {
        this.router.navigate(['/signup']);
      } else {
        console.error('Error:', error);
      }
      return EMPTY;
    })
  );
  constructor() {}
}
