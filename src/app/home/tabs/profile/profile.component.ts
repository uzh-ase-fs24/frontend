import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
	IonRefresher,
	IonRefresherContent,
	IonSpinner,
	IonTitle
} from '@ionic/angular/standalone';
import { catchError, EMPTY, tap } from 'rxjs';
import { User, UserForm } from 'src/app/model/user';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';
import { ToastService } from 'src/app/services/toast.service';
import { LocationRiddlePostComponent } from 'src/app/shared/location-riddle-post/location-riddle-post.component';
import { UserFormComponent } from 'src/app/shared/user-form/user-form.component';
import { ModalController } from '@ionic/angular';
import { ConnectionsModalComponent } from './ui/connections-modal/connections-modal.component';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	standalone: true,
	imports: [
		IonRefresherContent,
		IonRefresher,
		IonTitle,
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
	route = inject(ActivatedRoute);
	modalController = inject(ModalController);

	// Class variables
	updateProfileView = signal(false);
	profile$ = this.profileApiService.getProfile(this.route.snapshot.params['username']);
	connections$ = this.profileApiService.getConnections();
	locationRiddles$ = this.locationRiddleApiService.getUserLocationRiddles();

	readonly = this.route.snapshot.params['username'] || false;

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

  refresh(event: any) {
		event.target.complete();
		this.profile$ = this.profileApiService.getProfile();
		this.connections$ = this.profileApiService.getConnections();
		this.locationRiddles$ = this.locationRiddleApiService.getUserLocationRiddles();
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
