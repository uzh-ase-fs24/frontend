import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton, CommonModule],
})
export class LoginComponent {
  authService = inject(AuthService);

  constructor() {}

  login(): void {
    this.authService.login().pipe(takeUntilDestroyed()).subscribe();
  }
}
