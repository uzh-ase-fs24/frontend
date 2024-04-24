import { Component, inject } from '@angular/core';
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner } from '@ionic/angular/standalone';
import { FeedStateService } from './data-access/feed-state.service';
import { LocationRiddlePostComponent } from './ui/location-riddle-post/location-riddle-post.component';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	imports: [IonSpinner, LocationRiddlePostComponent, IonRefresherContent, IonRefresher, IonContent],
	providers: [FeedStateService],
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
