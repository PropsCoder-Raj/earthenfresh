import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivacyComponent } from './privacy/privacy.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { ShippingInfoComponent } from './shipping-info/shipping-info.component';
import { TncComponent } from './tnc/tnc.component';

const routes: Routes = [
  {
    path: 'tnc',
    component : TncComponent
  },
  {
    path: 'privacy',
    component : PrivacyComponent
  },
  {
    path: 'shipping',
    component : ShippingInfoComponent
  },
  {
    path: 'return',
    component : ReturnPolicyComponent
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherRoutingModule { }
