import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DrawervComponent } from './drawerv/drawerv.component';
import { PopoverComponent } from './drawerv/popover/popover.component';
import { HomeComponent } from '../tabs/home/home.component';



@NgModule({
  declarations: [DrawervComponent,PopoverComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  providers: [HomeComponent],
  exports:[
    DrawervComponent
  ]
})
export class ComponentsModule { }
