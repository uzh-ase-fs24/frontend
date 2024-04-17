import { Component, inject } from '@angular/core';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';
import { NetworkStateService } from './data-access/network-state.service';

@Component({
	selector: 'app-network',
	templateUrl: './network.component.html',
	styleUrls: ['./network.component.scss'],
	standalone: true,
	imports: [IonButton, IonCardHeader, IonCardContent, IonCardTitle, IonCard],
	providers: [NetworkStateService]
})
export class NetworkComponent {
	// Services
	networkState = inject(NetworkStateService);

	constructor() {}
}
