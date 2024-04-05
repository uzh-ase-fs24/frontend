import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user-form-exceptions',
  templateUrl: './user-form-exceptions.component.html',
  styleUrls: ['./user-form-exceptions.component.scss'],
  standalone: true,
  imports: [IonText, CommonModule],
})
export class UserFormExceptionsComponent {
  constructor() {}

  errors = input<ValidationErrors | null>();
  field = input<string>();

}
