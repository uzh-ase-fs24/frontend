import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonSpinner,
  IonInput,
} from '@ionic/angular/standalone';
import { UserFormExceptionsComponent } from '../shared/user-form-exceptions/user-form-exceptions.component';
import { ProfileApiService } from '../services/api/profile-api.service';
import { Subject, takeUntil, tap, timeout } from 'rxjs';
import { Router } from '@angular/router';

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
    UserFormExceptionsComponent,
  ],
  providers: [ProfileApiService],
})
export class SignupComponent implements OnDestroy {
  // Services
  profileApiService = inject(ProfileApiService);
  router = inject(Router);

  // Class variables
  onDestory = new Subject<void>();

  loading = signal(false);
  signupForm = new FormGroup({
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
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      this.loading.set(true);
      this.profileApiService
        .postProfile({
          username: this.signupForm.value.username || '',
          first_name: this.signupForm.value.firstName || '',
          last_name: this.signupForm.value.lastName || '',
        })
        .pipe(
          takeUntil(this.onDestory),
          tap(() => this.router.navigate(['home']))
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.onDestory.next();
    this.onDestory.complete();
  }
}
