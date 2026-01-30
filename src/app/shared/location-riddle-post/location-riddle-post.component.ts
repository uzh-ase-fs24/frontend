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
import { MapComponent } from 'src/app/shared/map/map.component';
import { LocationRiddleStateService } from './data-access/location-riddle-state.service';
import { ToastService } from 'src/app/services/toast.service'; // <--- Import ToastService

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
		IonAlert
	],
	styleUrls: ['./location-riddle-post.component.scss'],
	providers: [LocationRiddleStateService, LocationRiddleApiService, ToastService],
	standalone: true
})
export class LocationRiddlePostComponent {
	// Services
	locationRiddleState = inject(LocationRiddleStateService);

	// Input/Output
	locationRiddle = input.required<LocationRiddle>();

	router = inject(Router);
	route = inject(ActivatedRoute);
  toastService = inject(ToastService);

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

  async share() {
    // Construct the URL using the ?riddleId= format for GitHub Pages
    const url = `https://find-me.click/?riddleId=${this.locationRiddle().locationRiddleId}`;

    try {
      await navigator.clipboard.writeText(url);
      this.toastService.success('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      this.toastService.error('Failed to copy link');
    }
  }
}
