import { Component, inject } from '@angular/core';
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { FeedStateService } from './data-access/feed-state.service';
import { LocationRiddlePostComponent } from './ui/location-riddle-post/location-riddle-post.component';
import { ProfileApiService } from 'src/app/services/api/profile-api.service';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	imports: [IonSpinner, LocationRiddlePostComponent, IonRefresherContent, IonRefresher, IonContent],
	providers: [FeedStateService, ToastService, ProfileApiService],
	styleUrls: ['./feed.component.scss'],
	standalone: true
})
export class FeedComponent {
	feedState = inject(FeedStateService);

	constructor() {}

	handleRefresh(event: any) {
		this.feedState.refresh.next();
		setTimeout(() => {
			event.target.complete();
		}, 800);
	}
}
