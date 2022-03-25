import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { RouterModule } from '@angular/router';
import { AddressBreadComponent } from './address-bread/address-bread.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';
import { RatingComponent } from './rating/rating.component';
import { IonicModule } from '@ionic/angular';
import { HomeComponent } from '../tabs/home/home.component';

@NgModule({
  declarations: [
    WelcomeComponent,
    AddressBreadComponent,
    EditProfileComponent,
    ManageAddressComponent,
    RatingComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    RouterModule,
  ],
  providers: [HomeComponent]
})
export class AuthModule { }
