import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType } from '@capacitor/camera';
import {
	IonButton,
	IonContent,
	IonIcon,
	IonItem,
	IonList,
	IonPopover,
	IonSelect,
	IonSelectOption
} from '@ionic/angular/standalone';
import { MapComponent } from '../../../shared/map/map.component';
import { Arenas } from '../../../model/arenas';
import { PostStateService } from './data-access/post-state.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss'],
	providers: [PostStateService, ToastService],
	standalone: true,
	imports: [
		IonIcon,
		IonButton,
		MapComponent,
		IonSelect,
		IonList,
		IonItem,
		IonSelectOption,
		FormsModule,
		IonPopover,
		IonContent
	]
})
export class PostComponent {
	// Services
	postState = inject(PostStateService);
	router = inject(Router);
	toastService = inject(ToastService);

	// Variables
	arenas: string[] = [];
	arenaOptions = Object.values(Arenas);

	constructor() {}

	async ionViewDidEnter() {
		try {
			await this.takePicture();
		} catch (e) {
			await this.router.navigate(['/home']);
		}
	}

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

	cancelPost() {
		this.postState.cancelPost.next();
		this.router.navigate(['/home']);
	}

	completePost() {
		this.postState.setArenas.next(this.arenas);
		this.postState.completePost.next();
		this.toastService.success('Post uploaded successfully');
		this.router.navigate(['/home/profile'], { state: { refresh: true } });
	}
}
