import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel } from '@ionic/angular/standalone';
import { NetworkStateService } from './data-access/network-state.service';
import { Router } from '@angular/router';
import { SearchStateService } from './data-access/search-state.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
	selector: 'app-network',
	templateUrl: './network.component.html',
	styleUrls: ['./network.component.scss'],
	standalone: true,
	imports: [IonButton, IonItem, IonLabel, IonContent, IonInput, IonIcon],
	providers: [NetworkStateService, SearchStateService, ToastService]
})
export class NetworkComponent {
	// Services
	networkState = inject(NetworkStateService);
	searchState = inject(SearchStateService);
	router = inject(Router);

	isFollowingUser(username: string) {
		return this.searchState.followingUsers().some((user) => user.username === username);
	}

	constructor() {}
}
