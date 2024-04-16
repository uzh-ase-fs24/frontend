import { Component, inject } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { PostStateService } from './data-access/post-state.service';
import { MapComponent } from '../../../shared/map/map.component';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [PostStateService],
  standalone: true,
  imports: [IonIcon, IonButton, MapComponent],
})
export class PostComponent {
  // Services
  postState = inject(PostStateService);

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
      resultType: CameraResultType.Base64,
    });
    this.postState.uploadImage.next(image.base64String || '');
  }
}
