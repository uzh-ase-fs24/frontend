import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import {
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
	IonModal,
	IonAlert
} from '@ionic/angular/standalone';
import { Coordinate } from 'ol/coordinate';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { MapComponent } from 'src/app/shared/map/map.component';
import { LocationRiddleStateService } from './data-access/location-riddle-state.service';
import { RatingComponent } from './ui/rating/rating.component';
import { ActivatedRoute, Router } from '@angular/router';
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
	username = input.required<string>();

	submitGuess = output<Coordinate>();
	commentLocationRiddle = output<string>();
	rateLocationRiddle = output<number>();

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

	constructor() {
		effect(
			() => {
				this.locationRiddleState.setLocationRiddle.next(this.locationRiddle());
			},
			{ allowSignalWrites: true }
		);
		effect(
			() => {
				this.locationRiddleState.setUsername.next(this.username());
			},
			{ allowSignalWrites: true }
		);
	}

	get ratingError() {
		if (!this.locationRiddle().solved) {
			return 'You can only rate a solved riddle';
		} else if (this.locationRiddle().username === this.username()) {
			return 'You cannot rate your own riddle';
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
			this.submitGuess.emit(this.locationRiddleState.marker() || []);
			this.locationRiddleState.submittedGuess.next();
		}
	}

	isDarkMode(): string {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark-mode';
		}
		return 'light-mode';
	}

	isCurrentUser(): boolean {
		return this.locationRiddle().username === this.username() && !this.route.snapshot.params['username'];
	}
}
