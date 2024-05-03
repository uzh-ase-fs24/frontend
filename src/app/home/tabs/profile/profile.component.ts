import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import {
	IonButton,
	IonChip,
	IonContent,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSpinner,
	IonTitle
} from '@ionic/angular/standalone';
import { catchError, EMPTY, tap } from 'rxjs';
import { UserForm } from 'src/app/model/user';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';
import { ToastService } from 'src/app/services/toast.service';
import { LocationRiddlePostComponent } from 'src/app/shared/location-riddle-post/location-riddle-post.component';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	standalone: true,
	imports: [
		IonTitle,
		IonItem,
		IonInput,
		IonSpinner,
		IonButton,
		IonIcon,
		IonLabel,
		FormsModule,
		IonChip,
		IonContent,
		ReactiveFormsModule,
		UserFormComponent,
		LocationRiddlePostComponent,
		CommonModule
	],
	providers: [ToastService]
})
export class ProfileComponent {
	// Services
	profileApiService = inject(ProfileApiService);
	locationRiddleApiService = inject(LocationRiddleApiService);
	authService = inject(AuthService);
	toastService = inject(ToastService);
	destroyRef = inject(DestroyRef);

	// Class variables
	updateProfileView = signal(false);
	profile$ = this.profileApiService.getProfile();
	connections$ = this.profileApiService.getConnections();
	locationRiddles$ = this.locationRiddleApiService.getUserLocationRiddles();

	constructor() {}

	submitForm(user: UserForm) {
		this.profile$ = this.profileApiService.updateProfile(user).pipe(
			takeUntilDestroyed(this.destroyRef),
			tap(() => this.updateProfileView.set(false)),
			tap(() => this.toastService.success('Profile updated successfully!')),
			catchError(() => {
				this.toastService.error('Failed to update profile');
				return EMPTY;
			})
		);
	}

	getInitials(firstName: string, lastName: string): string {
		return (firstName[0] + lastName[0]).toUpperCase();
	}

	logout(): void {
		this.authService.logout();
	}
}
