import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
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
import { MapComponent } from 'src/app/shared/map/map.component';
import { LocationRiddleStateService } from './data-access/location-riddle-state.service';
import { RatingComponent } from './ui/rating/rating.component';
@Component({
	selector: 'app-location-riddle-post',
	templateUrl: './location-riddle-post.component.html',
	imports: [
		IonImg,
		IonIcon,
		IonFab,
		IonFabButton,
		IonCardContent,
		IonCardTitle,
		IonCardHeader,
		IonCard,
		IonAvatar,
		IonModal,
		IonContent,
		IonInput,
		IonItem,
		IonLabel,
		IonButton,
		CommonModule,
		MapComponent,
		RatingComponent,
		IonAlert
	],
	styleUrls: ['./location-riddle-post.component.scss'],
	providers: [LocationRiddleStateService, LocationRiddleApiService],
	standalone: true
})
export class LocationRiddlePostComponent {
	// Services
	locationRiddleState = inject(LocationRiddleStateService);

	// Input/Output
	locationRiddle = input.required<LocationRiddle>();

	router = inject(Router);
	route = inject(ActivatedRoute);

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
				this.locationRiddleState.setLocationRiddle.next(this.locationRiddle());
			},
			{ allowSignalWrites: true }
		);
	}

	get ratingError() {
		if (!this.locationRiddleState.locationRiddle()?.solved) {
			return 'You can only rate a solved riddle';
		} else if (
			this.locationRiddleState.locationRiddle()?.username === this.locationRiddleState.loggedInUsername()
		) {
			return 'You cannot rate your own riddle';
		} else if (this.locationRiddleState.locationRiddle()?.rated) {
			return 'You have already rated this riddle';
		} else {
			return undefined;
		}
	}

	comment(commentInputRef: IonInput) {
		if (commentInputRef.value) {
			this.locationRiddleState.commentOnLocationRiddle.next(commentInputRef.value.toString());
			commentInputRef.value = '';
		}
	}

	submit() {
		if (this.locationRiddleState.marker()) {
			// The flow prevents the guess from being null, but for the sake of typing we define a fallback
			this.locationRiddleState.submitGuess.next();
		}
	}

	isCurrentUser(): boolean {
		return (
			this.locationRiddle().username === this.locationRiddleState.loggedInUsername() &&
			!this.route.snapshot.params['username']
		);
	}
}
