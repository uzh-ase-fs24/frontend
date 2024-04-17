import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { IonButton, IonIcon, IonInput, IonItem, IonSpinner } from '@ionic/angular/standalone';
import { catchError, EMPTY, tap } from 'rxjs';
import { User } from 'src/app/model/user';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';

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
		UserFormComponent,
		CommonModule
	],
	providers: [ToastService]
})
export class ProfileComponent {
	// Services
	profileApiService = inject(ProfileApiService);
	authService = inject(AuthService);
	toastService = inject(ToastService);
	destroyRef = inject(DestroyRef);

	// Class variables
	updateProfileView = signal(false);
	profile$ = this.profileApiService.getProfile().pipe(takeUntilDestroyed());

	constructor() {}

	submitForm(user: User) {
		this.profile$ = this.profileApiService
			.updateProfile({
				username: user.username,
				first_name: user.firstName,
				last_name: user.lastName
			})
			.pipe(
				takeUntilDestroyed(this.destroyRef),
				tap(() => this.updateProfileView.set(false)),
				tap(() => this.toastService.success('Profile updated successfully!')),
				catchError(() => {
					this.toastService.error('Failed to update profile');
					return EMPTY;
				})
			);
	}

	logout(): void {
		this.authService.logout();
	}
}
