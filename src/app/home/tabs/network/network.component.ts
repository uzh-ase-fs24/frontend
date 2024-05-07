import { Component, inject } from '@angular/core';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonContent,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel
} from '@ionic/angular/standalone';
import { NetworkStateService } from './data-access/network-state.service';
import { Router } from '@angular/router';
import { SearchStateService } from './data-access/search-state.service';

@Component({
	selector: 'app-network',
	templateUrl: './network.component.html',
	styleUrls: ['./network.component.scss'],
	standalone: true,
	imports: [
		IonButton,
		IonItem,
		IonLabel,
		IonContent,
		IonCardHeader,
		IonCardContent,
		IonCardTitle,
		IonCard,
		IonInput,
		IonIcon
	],
	providers: [NetworkStateService, SearchStateService]
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
