import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RatingComponent } from 'src/app/auth/rating/rating.component';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  loading = false;
  orders: Array<any> = [];

  constructor(public userS: UserService, public authS: AuthService, public modalController: ModalController) { }

  ngOnInit() {
    this.getOrders();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getOrders();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getOrders(){
    this.loading = true;
    this.orders = [];
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe((data) => {
      let customerId = data['data']['customerId'];
      this.userS.getUserOrder(customerId).subscribe(data => {
        if(data.count > 0){
          this.loading = false;
          this.orders = data.data;
        }else{
          this.loading = false;
        }
      },error=>{
      });
    });
  }

  

  async ratingModal(data, orderId) {
    const modal = await this.modalController.create({
      mode: "ios",
      component: RatingComponent,
      componentProps: {data: JSON.stringify(data) , orderId: orderId}
    });
    return await modal.present();
  }

}
