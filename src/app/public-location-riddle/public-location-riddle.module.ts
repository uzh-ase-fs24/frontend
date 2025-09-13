import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PublicLocationRiddleComponent } from './public-location-riddle.component';
import { MapComponent } from 'src/app/shared/map/map.component'; // Adjust path if needed

const routes: Routes = [
  {
    path: '',
    component: PublicLocationRiddleComponent
  }
];

@NgModule({
  // All the imports from your component go here now
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    MapComponent // Assuming MapComponent is also standalone
  ],
  // Declare your component here
  declarations: [PublicLocationRiddleComponent]
})
export class PublicLocationRiddleModule { }
