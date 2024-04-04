import { Component, inject } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [IonButton, IonIcon],
})
export class ProfileComponent {
  // Services
  private authService = inject(AuthService);

  constructor() {}

  logout(): void {
    this.authService.logout();
  }
}
