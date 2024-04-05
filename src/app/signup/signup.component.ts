import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonSpinner,
  IonInput,
} from '@ionic/angular/standalone';
import { ProfileApiService } from '../services/api/profile-api.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { UserFormComponent } from '../shared/user-form/user-form.component';
import { User } from '../model/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonSpinner,
    IonButton,
    IonText,
    CommonModule,
    IonItem,
    IonLabel,
    FormsModule,
    ReactiveFormsModule,
    UserFormComponent,
  ],
  providers: [ProfileApiService],
})
export class SignupComponent implements OnDestroy {
  // Services
  profileApiService = inject(ProfileApiService);
  authService = inject(AuthService);
  router = inject(Router);

  // Class variables
  onDestory = new Subject<void>();

  loading = signal(false);

  constructor() {}

  submitForm(user: User) {
      this.loading.set(true);
      this.profileApiService
        .postProfile({
          username: user.username,
          first_name: user.firstName,
          last_name: user.lastName,
        })
        .pipe(
          takeUntil(this.onDestory),
          tap(() => this.router.navigate(['home'])),
          tap(() => this.authService.userProfileReady.next())
        )
        .subscribe();
  }

  ngOnDestroy() {
    this.onDestory.next();
    this.onDestory.complete();
  }
}
