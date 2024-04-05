import { inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable()
export class ToastService {
  toastController = inject(ToastController);

  constructor() {}

  public async success(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle',
    });

    await toast.present();
  }

  public async error(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
      color: 'danger',
      icon: 'close-circle',
    });

    await toast.present();
  }
}
