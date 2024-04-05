import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonInput,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';
import { SearchStateService } from './data-access/search-state.service';
import { FollowRequestsApiService } from 'src/app/services/api/follow-requests-api.service';
import { tap } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonInput,
    IonItem,
    CommonModule,
  ],
  providers: [SearchStateService, ToastService],
})
export class SearchComponent {
  // Services
  searchState = inject(SearchStateService);
  followRequestsApiService = inject(FollowRequestsApiService);
  toastService = inject(ToastService);

  constructor() {}

  follow(userId: string | undefined) {
    if (!userId) {
      console.error('User ID in follow request is undefined');
      return;
    }
    this.followRequestsApiService
      .makeFollowRequests(userId)
      .pipe(tap(() => this.toastService.success('Follow request sent!')))
      .subscribe();
  }
}
