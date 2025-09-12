import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	IonAlert,
	IonAvatar,
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonFab,
	IonFabButton,
	IonIcon,
	IonImg,
	IonInput,
	IonItem,
	IonLabel,
	IonModal
} from '@ionic/angular/standalone';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { ToastService } from 'src/app/services/toast.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { LocationRiddleStateService } from './data-access/location-riddle-state.service';
import { PublicLocationRiddleStateService } from './data-access/public-location-riddle-state.service';

@Component({
	selector: 'app-location-riddle-post',
	templateUrl: './location-riddle-post.component.html',
	imports: [
		IonImg,
		IonIcon,
		IonModal,
		IonContent,
		IonInput,
		IonItem,
		IonLabel,
		IonButton,
		CommonModule,
		MapComponent,
		IonAlert
	],
	styleUrls: ['./location-riddle-post.component.scss'],
	providers: [LocationRiddleStateService, PublicLocationRiddleStateService, LocationRiddleApiService],
	standalone: true
})
export class LocationRiddlePostComponent {
	// Services
	locationRiddleState = inject(LocationRiddleStateService);
	publicLocationRiddleState = inject(PublicLocationRiddleStateService);
	toastService = inject(ToastService);

	// Input/Output
	locationRiddle = input.required<LocationRiddle>();
	isPublicView = input<boolean>(false);

	router = inject(Router);
	route = inject(ActivatedRoute);

	// Get the appropriate state service based on view mode
	get currentState() {
		return this.isPublicView() ? this.publicLocationRiddleState : this.locationRiddleState;
	}

	public alertButtons = [
		{
			text: 'Cancel',
			role: 'cancel'
		},
		{
			text: 'Delete',
			role: 'confirm',
			handler: () => {
				this.locationRiddleState.deleteLocationRiddle.next(this.locationRiddle().locationRiddleId);
			}
		}
	];
	// Variables
	commentsModalOpen = false;

	constructor() {
		effect(
			() => {
				this.currentState.setLocationRiddle.next(this.locationRiddle());
			},
			{ allowSignalWrites: true }
		);
	}

	comment(commentInputRef: IonInput) {
		if (commentInputRef.value && !this.isPublicView()) {
			this.locationRiddleState.commentOnLocationRiddle.next(commentInputRef.value.toString());
			commentInputRef.value = '';
		}
	}

	submit() {
		if (this.currentState.marker()) {
			this.currentState.submitGuess.next();
		}
	}

	sharePost() {
		const shareUrl = `${window.location.origin}/post/${this.locationRiddle().locationRiddleId}`;
		if (navigator.share) {
			navigator.share({
				title: 'Check out this location riddle!',
				url: shareUrl
			});
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(shareUrl).then(() => {
				this.toastService.success('Link copied to clipboard!');
			}).catch(() => {
				this.toastService.error('Failed to copy link');
			});
		}
	}

	isCurrentUser(): boolean {
		if (this.isPublicView()) {
			return false;
		}
		return (
			this.locationRiddle().username === this.locationRiddleState.loggedInUsername() &&
			!this.route.snapshot.params['username']
		);
	}
}
