import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
// import * as $ from "jquery";
declare var $: any;

@Component({
  selector: 'app-address-bread',
  templateUrl: './address-bread.component.html',
  styleUrls: ['./address-bread.component.scss'],
})
export class AddressBreadComponent implements OnInit {

  @Input() action;
  @Input() data;
  public edit: boolean = false;

  house_flat_floor_no = '';
  apartment_road_area = '';
  landmark = '';
  city = '';
  pincode: any;
  type = '';
  otherType = '';
  addressId = '';
  otherArray: Array<any> = [];
  arr = [
    { name: "Home", checked : false },
    { name: "Work", checked : false },
    { name: "Other", checked : false }
  ];
  pincodesArr : Array<any> = [];


  constructor(public modalController: ModalController, public route: ActivatedRoute, public userS: UserService, public authS: AuthService, public toastController: ToastController, public apiS: ApiService) { }

  ngOnInit() {
    if (this.action == "update") {
      this.edit = true;
      this.house_flat_floor_no = this.data.house_flat_floor_no;
      this.apartment_road_area = this.data.apartment_road_area;
      this.landmark = this.data.landmark;
      this.city = this.data.city;
      this.pincode = this.data.pincode;
      this.type = this.data.type;
      if(this.type !== 'Home' && this.type !== 'Work'){
        this.otherType = this.type;
        this.type = 'Other';
      }
      this.addressId = this.data._id;
      this.getAddressWhenUpdate();
      setTimeout(() => {
        $('input:radio[name="optionsRadios"]').filter('[value="'+ this.type +'"]').attr('checked', true);
      }, 500);
    }else{
      this.getAddress();
      this.getPincode();
    }
  }  

  async getPincode(){
    this.apiS.getProfileInfo().subscribe(data => {
      this.pincodesArr = data['data']['postCodes'];
    });
  }
  
  async getAddress(){
    let homeCount = 0;
    let workCount = 0;
    let cnt = 0;
    this.userS.getAddresses(this.authS.currentUserValue.id).subscribe((data) =>{
      if(data['status'] === 'success'){
        if(data['data'] !== null){
          data['data'].forEach(element => {
            cnt++;
            if(element['type'] === 'Home'){
              homeCount++;
            }else if(element['type'] === 'Work'){
              workCount++;
            }else if(element['type'] !== 'Home' && element['type'] !== 'Work'){
              this.otherArray.push({name: element['type']});
            }
          });
          let interval = setInterval(() => {
            if(data['data'].length === cnt){
              clearInterval(interval);
              if(homeCount > 0 && workCount == 0){
                this.arr = [
                  { name: "Work", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(homeCount == 0 && workCount > 0){
                this.arr = [
                  { name: "Home", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(homeCount > 0 && workCount > 0){
                this.arr = [
                  { name: "Other", checked : false }
                ];
              }
            }
          });
        }
      }
    });
  }

  async getAddressWhenUpdate(){
    let homeCount = 0;
    let workCount = 0;
    let cnt = 0;
    this.otherArray = [];
    this.userS.getAddresses(this.authS.currentUserValue.id).subscribe((data) =>{
      if(data['status'] === 'success'){
        if(data['data'] !== null){
          data['data'].forEach(element => {
            cnt++;
            if(element['type'] === 'Home'){
              homeCount++;
            }else if(element['type'] === 'Work'){
              workCount++;
            }else if(element['type'] !== 'Home' && element['type'] !== 'Work'){
              this.otherArray.push({name: element['type']});
            }
          });
          let interval = setInterval(() => {
            if(data['data'].length === cnt){
              clearInterval(interval);
              if(this.type === 'Home' && workCount > 0){
                this.arr = [
                  { name: "Home", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(this.type === 'Home' || this.type === 'Work' && workCount == 0){
                this.arr = [
                  { name: "Home", checked : false },
                  { name: "Work", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(this.type === 'Work' && homeCount > 0){
                this.arr = [
                  { name: "Work", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(this.type === 'Other' && workCount == 0 && homeCount == 0){
                this.arr = [
                  { name: "Home", checked : false },
                  { name: "Work", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(this.type === 'Other' && workCount > 0 && homeCount == 0){
                this.arr = [
                  { name: "Home", checked : false },
                  { name: "Other", checked : false }
                ];
              }else if(this.type === 'Other' && workCount == 0 && homeCount > 0){
                this.arr = [
                  { name: "Work", checked : false },
                  { name: "Other", checked : false }
                ];
              }
            }
          });
        }
      }
    });
  }

  closeModal() {
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  contentType(event: any){
    var optionsRadios: any = document.getElementsByName('optionsRadios');
    for (var i = 0, length = optionsRadios.length; i < length; i++) {
      if (optionsRadios[i].checked) {
        this.type = optionsRadios[i].value;
        break;
      }
    }
  }

  createAddress(){
    if(this.house_flat_floor_no !== '' && this.apartment_road_area !== '' && this.landmark !== '' && this.city !== '' && this.pincode !== 0 && this.type !== ''){
      if(this.type === 'Other'){
        let sameCount = 0;
        let newPromise = new Promise((resolve: any, reject: any) => {
          if(this.otherArray.length > 0){
            this.otherArray.forEach((data, index, array)=>{
              if(data['name'].toLowerCase() === this.otherType.toLowerCase()){
                sameCount++;
              }

              if(index === array.length - 1) resolve();
            }) 
          }else{
            if(this.otherType.toLowerCase() === 'home' || this.otherType.toLowerCase() === 'work'){
              sameCount++;
            }
            resolve();
          }
        });

        newPromise.then(()=>{
          if(sameCount !== 0){
            if(this.otherType.toLowerCase() === 'home' || this.otherType.toLowerCase() === 'work'){
              this.errorToast(this.otherType + " Select Option OR Address Title Already Use.");
            }else{
              this.errorToast("Address Title Already Use.");
            }
            return;
          }else{
            if(this.otherType !== ''){
              this.type = this.otherType;
              let newPromise_1 = new Promise((resolve: any, reject: any) => {
                let count = 0;
                let newPromise_ = new Promise((resolve_: any, reject_: any) => {
                  this.pincodesArr.forEach((element, index, array) => {
                    if(Number(element) === this.pincode){
                      count++;
                    }

                    if(index === array.length - 1) resolve_();
                  });
                });
                
                newPromise_.then(() => {
                  if(count > 0){
                    resolve();
                  }else{
                    reject();
                  }
                })
              })
              newPromise_1.then(() => {
                this.userS.createUserAddress(this.authS.currentUserValue.id, this.house_flat_floor_no, this.apartment_road_area, this.landmark, this.city, this.pincode, this.type).subscribe((data) => {
                  if(data['status'] === 'success'){
                    this.successToast(data['message']);
                    this.modalController.dismiss({
                      'dismissed': true,
                      'message': 'create'
                    });
                  }
                });
              }).catch(() =>{ 
                this.errorToast("Sorry, delivery is not available at your location yet");
                return;
              });
            }else{
              this.errorToast("All Fields Mendatory");
              return;
            }
          }
        });
      }else{
        let newPromise_1 = new Promise((resolve: any, reject: any) => {
          let count = 0;
          let newPromise_ = new Promise((resolve_: any, reject_: any) => {
            this.pincodesArr.forEach((element, index, array) => {
              if(Number(element) === this.pincode){
                count++;
              }

              if(index === array.length - 1) resolve_();
            });
          });
          
          newPromise_.then(() => {
            if(count > 0){
              resolve();
            }else{
              reject();
            }
          })
        })

        newPromise_1.then(() => {
          this.userS.createUserAddress(this.authS.currentUserValue.id, this.house_flat_floor_no, this.apartment_road_area, this.landmark, this.city, this.pincode, this.type).subscribe((data) => {
            if(data['status'] === 'success'){
              this.successToast(data['message']);
              this.modalController.dismiss({
                'dismissed': true,
                'message': 'create'
              });
            }
          });
        }).catch(() =>{ 
          this.errorToast("Sorry, delivery is not available at your location yet");
        });
      }
    }else{
      this.errorToast("All Fields Mendatory");
    }
  }

  searchArray(){
    this.otherArray.forEach(data=>{
      if(data['name'] == this.type){
        return true;
      }
    })
  }

  updateAddress(){
    if(this.house_flat_floor_no !== '' && this.apartment_road_area !== '' && this.landmark !== '' && this.city !== '' && this.pincode !== 0 && this.type !== ''){
      if(this.type === 'Other'){
        let sameCount = 0;
        let newPromise = new Promise((resolve: any, reject: any) => {
          if(this.otherArray.length > 0){
            this.otherArray.forEach((data, index, array)=>{
              if(data['name'].toLowerCase() === this.otherType.toLowerCase()){
                sameCount++;
              }

              if(index === array.length - 1) resolve();
            }) 
          }else{
            if(this.otherType.toLowerCase() === 'home' || this.otherType.toLowerCase() === 'work'){
              sameCount++;
            }
            resolve();
          }
        });

        newPromise.then(()=>{
          if(sameCount !== 0){
            if(this.otherType.toLowerCase() === 'home' || this.otherType.toLowerCase() === 'work'){
              this.errorToast(this.otherType + " Select Option OR Address Title Already Use.");
            }else{
              this.errorToast("Address Title Already Use.");
            }
            return;
          }else{
            if(this.otherType !== ''){
              this.type = this.otherType;
              this.userS.updateUserAddress(this.addressId, this.house_flat_floor_no, this.apartment_road_area, this.landmark, this.city, this.pincode, this.type).subscribe((data) => {
                if(data['status'] === 'success'){
                  this.successToast(data['message']);
                  this.modalController.dismiss({
                    'dismissed': true,
                    'message': 'update'
                  });
                }
              });
            }else{
              this.errorToast("All Fields Mendatory");
              return;
            }
          }
        })
      }else{
        this.userS.updateUserAddress(this.addressId, this.house_flat_floor_no, this.apartment_road_area, this.landmark, this.city, this.pincode, this.type).subscribe((data) => {
          if(data['status'] === 'success'){
            this.successToast(data['message']);
            this.modalController.dismiss({
              'dismissed': true,
              'message': 'update'
            });
          }
        });
      }
    }else{
      this.errorToast("All Fields Mendatory");
    }
  }

  async successToast(msg: any) {
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
