import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ToastService {
	constructor(private toastController: ToastController) {}

	async success(message: string, duration = 3000) {
		const toast = await this.toastController.create({
			message,
			duration,
			color: 'success',
			position: 'top'
		});
		toast.present();
	}

	async error(message: string, duration = 3000) {
		const toast = await this.toastController.create({
			message,
			duration,
			color: 'danger',
			position: 'top'
		});
		toast.present();
	}

	async presentToast(message: string, duration = 3000) {
		const toast = await this.toastController.create({
			message,
			duration,
			position: 'top'
		});
		toast.present();
	}
}
