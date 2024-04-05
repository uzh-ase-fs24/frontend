import { Component, inject } from '@angular/core';
import { NetworkStateService } from './data-access/network-state.service';
import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss'],
  standalone: true,
  imports: [IonButton, IonCardHeader, IonCardContent, IonCardTitle, IonCard],
  providers: [NetworkStateService],
})
export class NetworkComponent {
  // Services
  networkState = inject(NetworkStateService);

  constructor() {}
}
