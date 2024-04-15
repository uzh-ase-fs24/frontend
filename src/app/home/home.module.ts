import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileApiService} from '../services/api/profile-api.service';
import {HomeRoutingModule} from './home-routing.module';
import {LocationRiddleApiService} from "../services/api/location-riddle-api.service";

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule, HomeRoutingModule],
  providers: [ProfileApiService, LocationRiddleApiService],
})
export class HomeModule {
}
