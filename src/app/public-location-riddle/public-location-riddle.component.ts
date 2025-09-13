import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonHeader,
	IonIcon,
	IonImg,
	IonTitle,
	IonToolbar
} from '@ionic/angular/standalone';
import { Coordinate } from 'ol/coordinate';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { PublicLocationRiddleService } from 'src/app/services/public-location-riddle.service';
import { ToastService } from 'src/app/services/toast.service';
import { MapComponent } from 'src/app/shared/map/map.component';

@Component({
	selector: 'app-public-location-riddle',
	standalone: true,
	imports: [
		CommonModule,
		IonContent,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonImg,
		IonButton,
		IonIcon,
		MapComponent
	],
	template: `
		<ion-header>
			<ion-toolbar>
				<ion-title>Find Me - Location Riddle</ion-title>
			</ion-toolbar>
		</ion-header>

		<ion-content class="ion-padding">
			@if (locationRiddle()) {
				<div class="riddle-container">
					@if (showMap()) {
						<div class="map-container">
							<app-map
								(placeMarker)="placeGuess($event)"
								[marker]="marker()"
								[guesses]="guesses()"
								[userGuess]="userGuess()"
								[solution]="solution()"
								[solved]="locationRiddle()!.solved"
								[zoom]="4"
							></app-map>
						</div>
					} @else {
						<ion-img
							class="riddle-image"
							[src]="locationRiddle()!.locationRiddleImage"
						></ion-img>
					}

					<div class="riddle-info">
						<h2>By {{ locationRiddle()!.username }}</h2>
						<p>{{ locationRiddle()!.createdAt | date: 'medium' }}</p>
						<p>Playing as: {{ anonymousUsername() }}</p>
					</div>

					<div class="controls">
						<ion-button
							fill="outline"
							(click)="toggleMap()"
						>
							<ion-icon name="{{ showMap() ? 'image' : 'map' }}-outline"></ion-icon>
							{{ showMap() ? 'Show Image' : 'Show Map' }}
						</ion-button>

						@if (marker() && !hasGuessed()) {
							<ion-button
								color="success"
								(click)="submitGuess()"
							>
								<ion-icon name="checkmark-outline"></ion-icon>
								Submit Guess
							</ion-button>
						}
					</div>

					@if (guessResult()) {
						<ion-card>
							<ion-card-header>
								<ion-card-title>Your Result</ion-card-title>
							</ion-card-header>
							<ion-card-content>
								<p>Distance: {{ guessResult()!.distance.toFixed(2) }} km</p>
								<p>Score: {{ guessResult()!.received_score.toFixed(1) }} points</p>
							</ion-card-content>
						</ion-card>
					}
				</div>
			} @else if (loading()) {
				<div class="loading">
					<p>Loading riddle...</p>
				</div>
			} @else {
				<div class="error">
					<p>Could not load this location riddle. It may not exist or be unavailable.</p>
				</div>
			}
		</ion-content>
	`,
	styles: [`
		.riddle-container {
			max-width: 600px;
			margin: 0 auto;
		}

		.map-container {
			height: 400px;
			border-radius: 16px;
			overflow: hidden;
			margin-bottom: 1rem;
		}

		.riddle-image {
			width: 100%;
			height: auto;
			border-radius: 16px;
			margin-bottom: 1rem;
		}

		.riddle-info {
			margin-bottom: 1rem;
			text-align: center;
		}

		.riddle-info h2 {
			margin: 0;
			color: var(--ion-color-primary);
		}

		.riddle-info p {
			margin: 0.5rem 0;
			color: var(--ion-color-medium);
		}

		.controls {
			display: flex;
			gap: 1rem;
			justify-content: center;
			margin-bottom: 1rem;
		}

		.loading, .error {
			text-align: center;
			padding: 2rem;
		}

		.error {
			color: var(--ion-color-danger);
		}
	`]
})
export class PublicLocationRiddleComponent {
	private route = inject(ActivatedRoute);
	private publicService = inject(PublicLocationRiddleService);
	private toastService = inject(ToastService);

	// State
	private state = signal<{
		locationRiddle: LocationRiddle | null;
		loading: boolean;
		showMap: boolean;
		marker: Coordinate | null;
		guessResult: { distance: number; received_score: number } | null;
	}>({
		locationRiddle: null,
		loading: true,
		showMap: false,
		marker: null,
		guessResult: null
	});

	// Computed values
	locationRiddle = computed(() => this.state().locationRiddle);
	loading = computed(() => this.state().loading);
	showMap = computed(() => this.state().showMap);
	marker = computed(() => this.state().marker);
	guessResult = computed(() => this.state().guessResult);
	anonymousUsername = computed(() => this.publicService.getAnonymousUsername());

	solution = computed(() =>
		this.state().locationRiddle?.solved ? this.state().locationRiddle?.location : undefined
	);

	guesses = computed(() => {
		const anonymousUser = this.anonymousUsername();
		return this.state().locationRiddle?.guesses?.filter((guess) => guess.username !== anonymousUser) || [];
	});

	userGuess = computed(() => {
		const anonymousUser = this.anonymousUsername();
		return this.state().locationRiddle?.guesses?.find((guess) => guess.username === anonymousUser)?.guess || null;
	});

	hasGuessed = computed(() => this.userGuess() !== null);

	constructor() {
		effect(() => {
			const locationRiddleId = this.route.snapshot.paramMap.get('id');
			if (locationRiddleId) {
				this.loadLocationRiddle(locationRiddleId);
			}
		});
	}

	private loadLocationRiddle(id: string) {
		this.state.update(state => ({ ...state, loading: true }));

		this.publicService.getPublicLocationRiddle(id).subscribe({
			next: (locationRiddle) => {
				this.state.update(state => ({
					...state,
					locationRiddle,
					loading: false
				}));
			},
			error: (error) => {
				console.error('Error loading public location riddle:', error);
				this.state.update(state => ({
					...state,
					locationRiddle: null,
					loading: false
				}));
			}
		});
	}

	toggleMap() {
		this.state.update(state => ({
			...state,
			showMap: !state.showMap
		}));
	}

	placeGuess(coordinate: Coordinate) {
		if (!this.hasGuessed()) {
			this.state.update(state => ({
				...state,
				marker: coordinate
			}));
		}
	}

	submitGuess() {
		const marker = this.marker();
		const locationRiddleId = this.route.snapshot.paramMap.get('id');

		if (marker && locationRiddleId) {
			this.publicService.postPublicGuess(locationRiddleId, marker).subscribe({
				next: (result) => {
					this.state.update(state => ({
						...state,
						locationRiddle: result.locationRiddle,
						guessResult: result.guessResult,
						marker: null
					}));
					this.toastService.success(`Great guess! You scored ${result.guessResult.received_score.toFixed(1)} points!`);
				},
				error: (error) => {
					console.error('Error submitting guess:', error);
					this.toastService.error('Failed to submit guess. Please try again.');
				}
			});
		}
	}
}
