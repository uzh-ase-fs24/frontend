import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth/auth.service';

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
}
