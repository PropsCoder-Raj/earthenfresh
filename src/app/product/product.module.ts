import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { CartComponent } from './cart/cart.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserService } from '../__helper/user/user.service';
import { HomeComponent } from '../tabs/home/home.component';


@NgModule({
  declarations: [
    CartComponent,
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    IonicModule,
    FormsModule
  ],
  providers: [UserService, HomeComponent]
})
export class ProductModule { }
