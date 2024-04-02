import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  IonInput,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/angular/standalone';
import { SearchStateService } from './data-access/search-state.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonInput,
    IonItem,
    CommonModule,
  ],
  providers: [SearchStateService],
})
export class SearchComponent {
  // Services
  searchState = inject(SearchStateService);

  constructor() {}
}
