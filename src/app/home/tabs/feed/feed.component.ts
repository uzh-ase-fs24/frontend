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
  }

  handleRefresh(event: any) {
    this.feedState.refresh.next();
    setTimeout(() => {
      event.target.complete();
    }, 800);
  }

  getUsername(userId: string) {
    return this.feedState.users().find(user => user.userId === userId)?.username || '';
  }
}
