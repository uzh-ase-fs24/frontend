import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProfileApiService } from '../services/api/profile-api.service';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [HomeComponent],
  exports: [HomeComponent],
  imports: [IonicModule, CommonModule, HomeRoutingModule],
  providers: [ProfileApiService],
})
export class HomeModule {}
