import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReferEarnComponent } from './refer-earn/refer-earn.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { NotificationComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: 'refer',
    component : ReferEarnComponent
  }  ,
  {
    path: 'transaction',
    component : TransactionsComponent
  } ,
  {
    path: 'notification',
    component : NotificationComponent
  }  
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MoreRoutingModule { }
