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
	IonModal,
	IonSpinner
} from '@ionic/angular/standalone';
import { catchError, EMPTY, tap } from 'rxjs';
import { User, UserForm } from 'src/app/model/user';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { ModalController } from '@ionic/angular';
import { ConnectionsModalComponent } from './ui/connections-modal/connections-modal.component';

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
		IonLabel,
		IonModal,
		IonContent,
		FormsModule,
		IonChip,
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
	modalController = inject(ModalController);

	// Class variables
	updateProfileView = signal(false);
	profile$ = this.profileApiService.getProfile().pipe(takeUntilDestroyed());
	connections$ = this.profileApiService.getConnections().pipe(takeUntilDestroyed());

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

	async openConnections(connection: 'Following' | 'Followers', connections: User[]) {
		const modal = await this.modalController.create({
			component: ConnectionsModalComponent,
			componentProps: { connection: connection, connections: connections },
			breakpoints: [0, 0.5, 0.8],
			initialBreakpoint: 0.5
		});
		modal.present();
	}

	logout(): void {
		this.authService.logout();
	}
}
