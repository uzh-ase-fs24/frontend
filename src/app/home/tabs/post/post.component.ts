import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import { IonButton, IonIcon, IonList, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { MapComponent } from '../../../shared/map/map.component';
import { PostStateService } from './data-access/post-state.service';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss'],
	providers: [PostStateService],
	standalone: true,
	imports: [IonIcon, IonButton, MapComponent, IonSelect, IonList, IonItem, IonSelectOption, FormsModule]
})
export class PostComponent {
	// Services
	postState = inject(PostStateService);
  arenas: string[] = [];

	constructor() {}

	uploadImage(event: any) {
		const file = event.target?.files[0];
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			this.postState.uploadImage.next(reader.result as string);
		};
	}

	async takePicture() {
		const image = await Camera.getPhoto({
			allowEditing: true,
			resultType: CameraResultType.Base64
		});
		this.postState.uploadImage.next(image.base64String || '');
	}

  completePost() {
    this.postState.setArenas.next(this.arenas);
    this.postState.completePost.next();
  }
}
