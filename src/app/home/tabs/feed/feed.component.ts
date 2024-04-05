import {Component, inject} from '@angular/core';
import {LocationRiddlePostComponent} from './ui/location-riddle-post/location-riddle-post.component'
import {IonContent, IonRefresher, IonRefresherContent} from '@ionic/angular/standalone';
import {FeedStateService} from "./data-access/feed-state.service";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  imports: [LocationRiddlePostComponent, IonRefresherContent, IonRefresher, IonContent],
  providers: [FeedStateService],
  styleUrls: ['./feed.component.scss'],
  standalone: true,
})
export class FeedComponent {

  feedState = inject(FeedStateService);

  constructor() {
    this.feedState.loadRiddles.next(null);
  }

  handleRefresh(event: any) {
    console.log('Begin async operation');
    this.feedState.loadRiddles.next(null);
    event.target.complete();
  }
}
