import { Component, inject } from '@angular/core';
import { User } from '../../../../../model/user';
import { IonContent, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
	selector: 'app-connections-modal',
	templateUrl: './connections-modal.component.html',
	styleUrls: ['./connections-modal.component.scss'],
	standalone: true,
	imports: [IonItem, IonLabel, IonContent]
})
export class ConnectionsModalComponent {
	connection?: string;
	connections?: User[];
  router = inject(Router);
}
