import { Component, OnInit, ViewChild } from '@angular/core';

import { IonContent, Platform } from '@ionic/angular';
import { ApiService } from 'src/app/__helper/api/api.service';
import * as $ from "jquery";
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { DataService } from 'src/app/__helper/data/data.service';
import { UserService } from 'src/app/__helper/user/user.service';

import { PluginListenerHandle, Plugins } from '@capacitor/core';
import { LocalNotifications, LocalNotificationActionPerformed } from '@capacitor/local-notifications';
import { PushNotifications, PushNotificationSchema, Token, ActionPerformed } from "@capacitor/push-notifications";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  backdropVisible = false;
  searchText = '';
  products: Array<any> = [];
  seachingProducts: Array<any> = [];
  categories: Array<any> = [];
  categoriesCount = 0;

  address: Array<any> = [];
  addressCount = 0;
  address_type = '';
  address_house_flat_floor_no = '';
  address_apartment_road_area = '';
  address_landmark = '';
  address_city = '';
  address_pincode = '';
  addressArr = [{ type: 'address' }]

  productsItems: Array<any> = [];
  notificationCount = 0;
  audio : any;

  @ViewChild(IonContent) content: IonContent;

  constructor(public apiS: ApiService, public auth: AuthService, public cartS: CartsService, public dataS: DataService, public userS: UserService, public platform: Platform, public router: Router) { }

  async sheduleLOcal(title, text) {
    await LocalNotifications.schedule({
      notifications:[
        {
          title: title,
          body: text,
          id: 2,
          iconColor: "#7FB462"
        }
      ]
    });

    LocalNotifications.addListener("localNotificationActionPerformed", (notification: LocalNotificationActionPerformed) => {
      this.router.navigate(['/more/notification']);
    })
  }

  playAudio(){
    this.audio = new Audio();
    this.audio.src = "../assets/notify.mp3";
    this.audio.load();
    this.audio.play();
  }

  changeNotification(){
    this.notificationCount = 0;
    this.notificationCount++;
  }

  ngOnInit() {
    this.getAddress();
    this.getNotification();
    setTimeout(() => {
      this.userS.getUsersFcmtokens().subscribe(data => {
        if (data['data'].length === 0) {
          PushNotifications.addListener('registration', (token: Token) => {
            this.userS.createFcmtokens(token.value).subscribe(data => {
            });
          });
        }else{
          this.userS.getUsersFcmtokens().subscribe(data=>{
            PushNotifications.addListener('registration', (token: Token) => {
              this.userS.updateFcmtokens(token.value, data['data'][0]['_id']).subscribe(result => {
              });
            });
          })
        }
      });
      
      PushNotifications.addListener(
        'pushNotificationReceived',
        (notification: PushNotificationSchema) => {
          let arr = notification;
          this.getNotification();
          this.sheduleLOcal(arr['data']['title'], arr['data']['body']);
        },
      );
      PushNotifications.addListener(
        'pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          let arr = notification;
          this.getNotification();
          this.sheduleLOcal(arr['data']['title'], arr['data']['body']);
        },
      );
    }, 3000);
    let interval = setInterval(() => {
      if (this.dataS.dataProducts.length > 0 && this.dataS.dataCategories.length > 0) {
        clearInterval(interval)
        this.products = this.dataS.dataProducts;
        this.categories = this.dataS.dataCategories;
        this.categoriesCount = this.dataS.categoriesCount;
      }
    }, 100);
  }
  
  getNotification(){
    this.notificationCount = 0;
    this.userS.getUsersUsersnotifications().subscribe(data => {
      if(data['data'].length > 0){
        data['data'].forEach(element =>{
          if(element['view_status'] === false){
            this.notificationCount++;
          }
        });
      }
    });
  }

  // ionViewWillEnter(){
  //   this.getAddress();
  // }

  clearAddress() {
    this.addressCount = 0;
    this.address = [];
    this.address_type = '';
    this.address_house_flat_floor_no = '';
    this.address_apartment_road_area = '';
    this.address_landmark = '';
    this.address_city = '';
    this.address_pincode = '';
  }

  getAddress() {
    this.clearAddress();
    this.userS.getAddresses(this.auth.currentUserValue.id).subscribe(data => {
      if (data['data'].length > 0) {
        this.addressCount++;
        data['data'].forEach(element => {
          if (element['default'] == true) {
            this.address = element;
            this.address_type = element['type'];
            this.address_house_flat_floor_no = element['house_flat_floor_no'];
            this.address_apartment_road_area = element['apartment_road_area'];
            this.address_landmark = element['landmark'];
            this.address_city = element['city'];
            this.address_pincode = element['pincode'];
          }
        });
      }
    });
  }

  makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }

  scrollToTop() {
    let height = document.getElementById('searchBox').offsetTop;
    document.querySelector('ion-content').scrollByPoint(0, Number(height) - 10, 500);
  }

  addCart(item: Array<any>) {
    this.productsItems = item;
    if (item['options'].length > 0) {
      $("#prod_id_" + item['id']).click();
    } else {
      this.cartS.addCarts(item);
    }
  }

  removeCart(item: any) {
    this.cartS.carts.forEach((element)=>{
      if(element['name'] === item['name']) {
        this.cartS.removeProduct(element);
      }
    })
  }

  search() {
    if (this.searchText !== '') {
      $("#ion-content").addClass("animate__animated animate__faster animate__fadeOutDown");
      $("#ion-content").hide();
      $("#ion-category").addClass("animate__animated animate__faster animate__fadeOutRight");
      $("#ion-category").hide();
      $("#all-products").show();
      $("#all-products").removeClass("animate__animated animate__faster animate__fadeOutDown");
      $("#all-products").addClass("animate__animated animate__faster animate__fadeInUp");
    } else {
      $("#all-products").removeClass("animate__animated animate__faster animate__fadeInUp");
      $("#all-products").addClass("animate__animated animate__faster animate__fadeOutDown");
      $("#all-products").hide();
      $("#ion-category").show();
      $("#ion-content").removeClass("animate__animated animate__faster animate__fadeOutDown");
      $("#ion-content").addClass("animate__animated animate__faster animate__fadeInUp");
      $("#ion-content").show();
      $("#ion-category").removeClass("animate__animated animate__faster animate__fadeOutRight");
      $("#ion-category").addClass("animate__animated animate__faster animate__fadeInRight");
    }
  }

  scroll(el: any) {
    let height = document.getElementById(el).offsetTop;
    document.querySelector('ion-content').scrollByPoint(0, Number(height) - 70, 500);
  }

  toggleBackdrop(isVisible) {
    this.backdropVisible = isVisible;
  }



}
