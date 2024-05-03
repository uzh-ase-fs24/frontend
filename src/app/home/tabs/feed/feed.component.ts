import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner } from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { LocationRiddlePostComponent } from '../../../shared/location-riddle-post/location-riddle-post.component';
import { FeedStateService } from './data-access/feed-state.service';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	imports: [IonSpinner, LocationRiddlePostComponent, IonRefresherContent, IonRefresher, IonContent],
	providers: [FeedStateService, ToastService, AuthService],
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
