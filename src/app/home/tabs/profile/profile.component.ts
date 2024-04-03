import { Component, inject, OnDestroy, signal } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import {
  IonButton,
  IonIcon,
  IonSpinner,
  IonInput,
  IonItem,
} from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';
import { UserFormExceptionsComponent } from '../../../shared/user-form-exceptions/user-form-exceptions.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    IonItem,
    IonInput,
    IonSpinner,
    IonButton,
    IonIcon,
    FormsModule,
    ReactiveFormsModule,
    UserFormExceptionsComponent,
  ],
})
export class ProfileComponent implements OnDestroy {
  // Services
  profileApiService = inject(ProfileApiService);
  authService = inject(AuthService);

  // Class variables
  onDestory = new Subject<void>();

  loading = signal(false);
  profileForm = new FormGroup({
    username: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(20)])
    ),
    firstName: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(20)])
    ),
    lastName: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(20)])
    ),
  });

  constructor() {}

  submitForm() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      this.loading.set(true);
      this.profileApiService
        .updateProfile({
          username: this.profileForm.value.username || '',
          first_name: this.profileForm.value.firstName || '',
          last_name: this.profileForm.value.lastName || '',
        })
        .pipe(takeUntil(this.onDestory))
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.onDestory.next();
    this.onDestory.complete();
  }

  logout(): void {
    this.authService.logout();
  }
}
