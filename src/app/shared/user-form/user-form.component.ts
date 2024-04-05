import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { UserFormExceptionsComponent } from './ui/user-form-exceptions/user-form-exceptions.component';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonButton,
    IonInput,
    IonItem,
    FormsModule,
    ReactiveFormsModule,
    UserFormExceptionsComponent,
  ],
})
export class UserFormComponent {
  @Output() submitForm = new EventEmitter<User>();

  username = input<string>('');
  firstName = input<string>('');
  lastName = input<string>('');
  submitButtonTitle = input<string>('Submit');
  formTitle = input<string>('User Form');
  displayUsername = input<boolean>(true);

  userForm = new FormGroup({
    username: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(20)])
    ),
    firstName: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(20)])
    ),
    lastName: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.maxLength(20)])
    ),
  });

  constructor() {
    effect(() => this.userForm.controls.username.setValue(this.username()));
    effect(() => this.userForm.controls.firstName.setValue(this.firstName()));
    effect(() => this.userForm.controls.lastName.setValue(this.lastName()));
    effect(() =>
      !this.displayUsername()
        ? this.userForm.controls.username.clearValidators()
        : null
    );
  }

  submit() {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.submitForm.emit({
        username: this.userForm.value.username || '',
        firstName: this.userForm.value.firstName || '',
        lastName: this.userForm.value.lastName || '',
      });
    }
  }
}
