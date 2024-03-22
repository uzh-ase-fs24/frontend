import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { SignupFormExceptionsComponent } from './ui/signup-form-exceptions/signup-form-exceptions.component';
import { ProfileApiService } from '../services/api/profile-api.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonButton,
    IonText,
    IonContent,
    CommonModule,
    IonTitle,
    IonHeader,
    IonToolbar,
    IonContent,
    IonItem,
    IonLabel,
    IonSpinner,
    FormsModule,
    ReactiveFormsModule,
    SignupFormExceptionsComponent,
  ],
  // providers: [ProfileApiService],
})
export class SignupComponent {
  profileApiService = inject(ProfileApiService);
  router = inject(Router);

  loading = signal(false);
  signupForm = new FormGroup({
    username: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ])
    ),
    firstName: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ])
    ),
    lastName: new FormControl(
      '',
      Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ])
    ),
  });

  constructor() {}

  submitForm() {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      this.loading.update((value) => true);
      this.profileApiService
        .postProfile({
          username: this.signupForm.value.username || '',
          firstName: this.signupForm.value.firstName || '',
          lastName: this.signupForm.value.lastName || '',
          userId: 0,
        })
        .pipe(
          tap((user) => {
            this.router.navigate(['/home']);
          })
        )
        .subscribe();
    }
  }
}
