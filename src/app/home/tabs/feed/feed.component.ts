import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { IonContent, IonRefresher, IonRefresherContent, IonSpinner, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { LocationRiddlePostComponent } from '../../../shared/location-riddle-post/location-riddle-post.component';
import { Arenas } from '../../../model/arenas';
import { FeedStateService } from './data-access/feed-state.service';

@Component({
	selector: 'app-feed',
	templateUrl: './feed.component.html',
	imports: [IonSpinner, LocationRiddlePostComponent, IonRefresherContent, IonRefresher, IonContent, IonList, IonItem, IonSelect, IonSelectOption, FormsModule],
	providers: [FeedStateService, ToastService, AuthService],
	styleUrls: ['./feed.component.scss'],
	standalone: true
})
export class FeedComponent {
	feedState = inject(FeedStateService);
  feedMode= "My Friends";
  arenaOptions = Object.values(Arenas);

	constructor() {}

  onFeedModeChange() {
    this.feedState.setArena.next(this.feedMode === "My Friends" ? "" : this.feedMode);
    this.feedState.refresh.next();
  }

	handleRefresh(event: any) {
    this.feedState.setArena.next(this.feedMode === "My Friends" ? "" : this.feedMode);
		this.feedState.refresh.next();
		setTimeout(() => {
			event.target.complete();
		}, 800);
	}
}
