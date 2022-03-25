import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { UserService } from '../__helper/user/user.service';
import { OrdersComponent } from './orders/orders.component';
import { FilterPipe } from './filter.pipe';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    ComponentsModule
  ],
  providers: [UserService],
  declarations: [TabsComponent,HomeComponent,ProfileComponent,OrdersComponent,FilterPipe]
})
export class TabsPageModule {}
