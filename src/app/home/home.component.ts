import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [IonButton, CommonModule],
})
export class HomeComponent {
  private authService = inject(AuthService);

  user$ = this.authService.getUser();

  constructor() {}

  logout(): void {
    this.authService.logout();
  }
}
