import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OtherRoutingModule } from './other-routing.module';
import { TncComponent } from './tnc/tnc.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PrivacyComponent } from './privacy/privacy.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';


@NgModule({
  declarations: [TncComponent, PrivacyComponent, ShippingInfoComponent, ReturnPolicyComponent],
  imports: [
    CommonModule,
    OtherRoutingModule,
    RouterModule,
    IonicModule,
    FormsModule
  ]
})
export class OtherModule { }
