import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HomeComponent } from 'src/app/tabs/home/home.component';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { AddressBreadComponent } from '../address-bread/address-bread.component';

@Component({
  selector: 'app-manage-address',
  templateUrl: './manage-address.component.html',
  styleUrls: ['./manage-address.component.scss'],
})
export class ManageAddressComponent implements OnInit {

  public addressList : Array<any> = [];
  public addressCount = 0;

  constructor(public modalController:ModalController, public userS: UserService, public authS: AuthService, public toastController: ToastController, public homeC: HomeComponent) { }

  ngOnInit() {
    this.getAddress();
  }

  back(){
    window.history.back();
  }
  
  doRefresh(event) {
    console.log('Begin async operation');
    this.getAddress();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async getAddress(){
    this.addressList = [];
    this.addressCount = 0;
    this.userS.getAddresses(this.authS.currentUserValue.id).subscribe((data) =>{
      if(data['status'] === 'success'){
        if(data['data'] !== null){
          data['data'].forEach(element => {
            this.addressCount++;
            this.addressList.push(element);
          });
        }else{
          this.addressCount = 0;
        }
      }
    });
  }

  async deleteAddress(id: any) {
    this.userS.deleteAddress(id).subscribe(data => {
      if(data['status'] === 'success'){
        this.getAddress();
        this.homeC.getAddress();
        this.simpleToast(data['message']);
      }
    })
  }

  async addAddress() {
    const modal = await this.modalController.create({
      mode:"ios",
      component: AddressBreadComponent,
      componentProps: {
        action: "create",
      },
    });

    modal.onDidDismiss().then((data) => {
      if(data['data']['message'] === 'create' ){
        this.getAddress();
        this.homeC.getAddress();
      }
    });

    return await modal.present();
  }

  async updateAddress(data: any, id: any) {
    const modal = await this.modalController.create({
      mode:"ios",
      component: AddressBreadComponent,
      componentProps: {
        action: "update",
        data: data
      },
    });

    
    modal.onDidDismiss().then((data) => {
      if(data['data']['message'] === 'update' ){
        this.getAddress();
        this.homeC.getAddress();
      }
    });
    return await modal.present();
  }

  async simpleToast(msg: any) {
    const toast = await this.toastController.create({
      color: 'light',
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
