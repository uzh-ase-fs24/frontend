import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileApiService } from '../services/api/profile-api.service';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [],
  exports: [],
  imports: [CommonModule, HomeRoutingModule],
  providers: [ProfileApiService],
})
export class HomeModule {}
