import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { LoadingController, ModalController, Platform, PopoverController, ToastController } from '@ionic/angular';
import { AddressBreadComponent } from 'src/app/auth/address-bread/address-bread.component';
import { HomeComponent } from 'src/app/tabs/home/home.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { PopoverComponent } from './popover/popover.component';
declare var $: any;
declare var google : any;

@Component({
  selector: 'app-drawerv',
  templateUrl: './drawerv.component.html',
  styleUrls: ['./drawerv.component.scss'],
})
export class DrawervComponent implements OnInit {

  searchTerm: String;
  placesArr = [];

  isOpen = false;
  openHeight = 0;
  productDetails: any = [];
  addressDetails: Array<any> = [];
  optionsArr: any = [];
  addressArr: Array<any> = [];

  ratingCount = 0;
  rating = 0;
  optionsStatus = false;
  addressCount = 0;

  @ViewChild('drawer',{read:ElementRef}) drawer:ElementRef;
  @Output('openStateChanged') openState: EventEmitter<boolean> = new EventEmitter();

  constructor(public platform: Platform, public cartS: CartsService, public apiS: ApiService, public userS: UserService, public auth: AuthService, 
    public popoverController: PopoverController, public modalController: ModalController, public toastController: ToastController, public homeC: HomeComponent,
    public loadingController: LoadingController) { }

  ngOnInit() {
    this.getAddress();
  }

  initService() {
    if(this.searchTerm.length > 0){
      this.placesArr = [];
      let placesArr: any = [];
      let placeCount = 0;
      const displaySuggestions = function (predictions, status) {
        if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
          alert(status);
          return;
        }
        predictions.forEach((prediction) => {
          if(placeCount < 5){
            localStorage.setItem('places' + Number( placeCount + 1 ) , JSON.stringify(prediction));
            placesArr.push(prediction);
          }
          placeCount++;
        });
      };
      const service = new google.maps.places.AutocompleteService();
      service.getQueryPredictions({ input: this.searchTerm }, displaySuggestions);

      for (let index = 1; index <= 5; index++) {
        let arr = localStorage.getItem('places' + index);
        this.placesArr.push(JSON.parse(arr));
      }
    }  
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
        this.presentLoading();
        setTimeout(() => {
          this.toggleDrawer('');
        }, 2500);
      }
    });

    return await modal.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: '',
      duration: 2500,
      mode: 'ios'
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  async close(id = ''){
    for (let index = 1; index <= 5; index++) {
      localStorage.removeItem('places' + index);
      this.placesArr = [];
    }
    const modal = await this.modalController.getTop();
    if (modal) {
        if(id === ''){
          modal.dismiss('dismiss');
        }else{
          modal.dismiss(id);
        }
    }
  }

  async simpleToast(msg: any) {
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

  async deleteAddress(id: any) {
    this.userS.deleteAddress(id).subscribe(data => {
      if(data['status'] === 'success'){
        this.addressArr = [];
        this.addressCount = 0;
        this.getAddress();
        this.homeC.getAddress();
        this.simpleToast(data['message']);
        setTimeout(() => {
          this.toggleDrawer('');
        }, 2500);
      }
    })
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
        this.presentLoading();
        setTimeout(() => {
          this.toggleDrawer('');
        }, 2500);
      }
    });
    return await modal.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: 'my-custom-class',
      event: ev,
      translucent: true
    });
    await popover.present();
  
    const { role } = await popover.onDidDismiss();
  }

  async getAddress(){
    this.addressArr = [];
    this.addressCount = 0;
    this.userS.getAddresses(this.auth.currentUserValue.id).subscribe(data=>{
      if(data['data'].length > 0){
        this.addressCount++;
        this.addressArr = data['data'];
      }
    })  
  }

  updateUserAddressDefault(id){
    this.userS.updateUserAddressDefault(id).subscribe();
    setTimeout(() => {
      this.getAddress();
      this.homeC.getAddress();
    }, 500);
    this.presentLoading();
    setTimeout(() => {
      this.toggleDrawer('');
    }, 2500);
  }

  getProductrating(pid){
    this.ratingCount = 0;
    this.rating = 0;
    let totalRating = 0;
    this.apiS.getRatingsProductsWise(pid).subscribe(result => {
      if(result['status'] === 'success'){
        if(result['data'].length > 0){
          result['data'].forEach(element => {
            this.ratingCount++;
            totalRating = totalRating + Number(element['rating']);
            this.rating = Number(totalRating) / Number(this.ratingCount);
          });
        }
      }
    })
  }

  addCart(){
    if(this.productDetails['options'].length > 0){
      this.optionsStatus = true;
      this.optionsArr = this.productDetails['options'];
      this.getAddress();
    }else{
      this.cartS.addCarts(this.productDetails);
      this.optionsStatus = false;
    }
  }

  addCartUsingRadioOption(option, name, type){
    let string = this.productDetails.name + ' ( ' + option['text'] + ' )';
    console.log(string)
    const productExistInCart = this.cartS.carts.find(({ unique }) => unique === string);
    if(!productExistInCart){
      setTimeout(() => {
        document.getElementById("clearBtn").click();
      }, 500)
      let arr: Array<any> = [];
      arr.push({data: option, name: name, type: type});
      this.cartS.addCarts(this.productDetails, arr); 
    }else{
      productExistInCart.num += 1;
      localStorage.setItem("carts", JSON.stringify(this.cartS.carts));
      this.cartS.getBalance();
      this.cartS.calculateTotal();
      this.cartS.calculateBalance();
      document.getElementById("clearBtn").click();
    }
  }

  removeCart(){
    this.cartS.carts.forEach((element)=>{
      if(element['name'] === this.productDetails['name']) {
        this.cartS.removeProduct(element);
      }
    })
  }
  
  toggleDrawer(items: any, optionsStatus = false){
    if(items !== undefined){
      if(items['type'] === 'address'){
        this.addressDetails.push(items);
        this.getAddress();
      }else{
        this.addressDetails = [];
        this.productDetails = items;
      }
    }

    this.openHeight = (this.platform.height()/100) * 60;
    const drawer = this.drawer.nativeElement;
    this.openState.emit(!this.isOpen);

    if(!this.isOpen){
      drawer.style.visibility = 'visible';
      drawer.style.transition = '.4s ease-in';
      drawer.style.transform = `translateY(${-this.openHeight}px)`;
      this.isOpen = true;
      if(this.addressDetails.length === 0){
        this.getProductrating(items['id']);
        if(items['options'].length > 0 && optionsStatus === true){
          this.optionsStatus = true;
          this.optionsArr = items['options'];
          this.getAddress();
        }else{
          this.optionsStatus = false;
        }
      }
    }else{
      this.ratingCount = 0;
      this.rating = 0;
      drawer.style.visibility = 'hidden';
      drawer.style.transition = '.4s ease-out';
      drawer.style.transform = '';
      this.isOpen = false;
    }
  }
}
