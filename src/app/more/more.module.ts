import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferEarnComponent } from './refer-earn/refer-earn.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MoreRoutingModule } from './more-routing.module';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { TransactionsComponent } from './transactions/transactions.component';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  declarations: [ReferEarnComponent, TransactionsComponent, NotificationComponent],
  imports: [
    CommonModule,
    RouterModule,
    MoreRoutingModule,
    IonicModule,
    FormsModule
  ],
  providers: [
    SocialSharing
  ]
})
export class MoreModule { }
