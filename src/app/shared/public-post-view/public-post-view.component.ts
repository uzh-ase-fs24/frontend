import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSpinner } from '@ionic/angular/standalone';
import { switchMap } from 'rxjs';
import { LocationRiddle } from 'src/app/model/location-riddle';
import { LocationRiddleApiService } from 'src/app/services/api/location-riddle-api.service';
import { GuestUserService } from 'src/app/services/guest-user.service';
import { LocationRiddlePostComponent } from '../location-riddle-post/location-riddle-post.component';

@Component({
	selector: 'app-public-post-view',
	templateUrl: './public-post-view.component.html',
	imports: [
		CommonModule,
		IonContent,
		IonHeader,
		IonTitle,
		IonToolbar,
		IonSpinner,
		LocationRiddlePostComponent
	],
	styleUrls: ['./public-post-view.component.scss'],
	providers: [LocationRiddleApiService, GuestUserService],
	standalone: true
})
export class PublicPostViewComponent implements OnInit {
	private route = inject(ActivatedRoute);
	private locationRiddleApiService = inject(LocationRiddleApiService);
	private guestUserService = inject(GuestUserService);

	locationRiddle = signal<LocationRiddle | null>(null);
	loading = signal(true);
	error = signal<string | null>(null);

	ngOnInit() {
		// Initialize guest user
		this.guestUserService.initializeGuestUser();

		// Load the location riddle
		this.route.params.pipe(
			switchMap(params => this.locationRiddleApiService.getPublicLocationRiddle(params['id']))
		).subscribe({
			next: (riddle) => {
				this.locationRiddle.set(riddle);
				this.loading.set(false);
			},
			error: (_err) => {
				this.error.set('Failed to load post');
				this.loading.set(false);
			}
		});
	}
}
