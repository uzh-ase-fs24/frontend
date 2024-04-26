import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonItem } from '@ionic/angular/standalone';
import { UserForm } from 'src/app/model/user';
import { UserFormExceptionsComponent } from './ui/user-form-exceptions/user-form-exceptions.component';

@Component({
	selector: 'app-user-form',
	templateUrl: './user-form.component.html',
	styleUrls: ['./user-form.component.scss'],
	standalone: true,
	imports: [IonIcon, IonButton, IonInput, IonItem, FormsModule, ReactiveFormsModule, UserFormExceptionsComponent]
})
export class UserFormComponent {
	@Output() submitForm = new EventEmitter<UserForm>();

	firstName = input<string>('');
	lastName = input<string>('');
	submitButtonTitle = input<string>('Submit');
	formTitle = input<string>('User Form');

	userForm = new FormGroup({
		firstName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)])),
		lastName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(20)]))
	});

	constructor() {
		effect(() => this.userForm.controls.firstName.setValue(this.firstName()));
		effect(() => this.userForm.controls.lastName.setValue(this.lastName()));
	}

	submit() {
		this.userForm.markAllAsTouched();
		if (this.userForm.valid) {
			this.submitForm.emit({
				firstName: this.userForm.value.firstName || '',
				lastName: this.userForm.value.lastName || ''
			});
		}
	}
}
