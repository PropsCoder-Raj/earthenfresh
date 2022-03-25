import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
})
export class RatingComponent implements OnInit {

  public value = this.navParams.get('data');
  data : Array<any> = [];
  items : Array<any> = [];
  itemsDatabase : Array<any> = [];
  ratingStatus = false;
  loader = false;
  orderId = this.navParams.get('orderId');
  isDatabase = false;

  constructor(public modalController:ModalController, private navParams: NavParams, public authS: AuthService, public userS: UserService, public apiS: ApiService, public toastController: ToastController, public router: Router) { }

  ngOnInit() {
    this.data = JSON.parse(this.value);
    this.data['items'].forEach(element => {
      this.items.push({ data: element, rating: 0 });
    });
    
    this.apiS.getRatingsOrderId(this.orderId).subscribe(result => {
      if(result['status'] === 'success'){
        if(result['data'].length > 0){
          this.isDatabase = true;
          result['data'].forEach(element => {
            this.apiS.getSingleProduct(element['productId']).subscribe(data => {
              if(data['status'] === 'success'){
                this.itemsDatabase.push({data : data['data'], rating: element['rating']});
              }
            })
          });
        }
      }
    })
    
    
  }

  change(){
    this.ratingStatus = true;
  }

  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  ratings(){
    let id = this.authS.currentUserValue.id;
    let customerId = this.userS.customerId;
    let count = 0;
    this.loader = true;
    this.items.forEach(element => {
      this.apiS.createRatings(id, element['rating'], element['data']['productId'], customerId, this.orderId).subscribe(result => {
        if( result['status'] === 'success' ){
          count++;
        }else{
          this.errorToast(result['message']);
          this.loader = false;
        }
      });
    });

    let intervals = setInterval(() => {
      if(count === this.items.length){
        clearInterval(intervals);
        this.loader = false;
        this.primaryToast("Successfully Rated.");
        this.closeModal();
      }
    });
  }

  async primaryToast(msg: any) {
    const toast = await this.toastController.create({
      color: 'primary',
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  async errorToast(msg: any) {
    const toast = await this.toastController.create({
      color: 'danger',
      message: msg,
      duration: 2000,
    });
    toast.present();
  }
}
