import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-signup-form-exceptions',
  templateUrl: './signup-form-exceptions.component.html',
  styleUrls: ['./signup-form-exceptions.component.scss'],
  standalone: true,
  imports: [IonText, CommonModule],
})
export class SignupFormExceptionsComponent {
  constructor() {}

  errors = input<ValidationErrors | null>();
  field = input<string>();

}
