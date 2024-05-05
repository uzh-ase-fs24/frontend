import { Component } from '@angular/core';
import { User } from '../../../../../model/user';
import { IonContent, IonItem, IonLabel } from '@ionic/angular/standalone';

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
}
