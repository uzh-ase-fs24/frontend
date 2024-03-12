import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonButton],
  providers: [AuthService],
})
export class LoginComponent {
  // services
  private authService = inject(AuthService);

  constructor() {}

  login() {
    this.authService.login();
  }
}
