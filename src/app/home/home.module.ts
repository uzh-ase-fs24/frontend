import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LocationRiddleApiService } from '../services/api/location-riddle-api.service';
import { ProfileApiService } from '../services/api/profile-api.service';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
	declarations: [],
	exports: [],
	imports: [CommonModule, HomeRoutingModule],
	providers: [ProfileApiService, LocationRiddleApiService]
})
export class HomeModule {}
