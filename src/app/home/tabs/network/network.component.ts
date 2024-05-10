import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
	IonButton,
	IonContent,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonRefresher,
	IonRefresherContent,
	IonSpinner
} from '@ionic/angular/standalone';
import { ToastService } from 'src/app/services/toast.service';
import { NetworkStateService } from './data-access/network-state.service';
import { SearchStateService } from './data-access/search-state.service';

@Component({
	selector: 'app-network',
	templateUrl: './network.component.html',
	styleUrls: ['./network.component.scss'],
	standalone: true,
	imports: [
		IonSpinner,
		IonRefresher,
		IonRefresherContent,
		IonButton,
		IonItem,
		IonLabel,
		IonContent,
		IonInput,
		IonIcon
	],
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
