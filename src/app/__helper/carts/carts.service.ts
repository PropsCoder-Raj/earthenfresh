import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { element } from 'protractor';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CartsService {

  public carts: Array<any> = [];
  totalAmount = 0;
  discountAmount = 0;
  cartAmount = 0;
  deliveryCharges = 0;
  totalPayAmount = 0;
  finalTotalPayAmount = 0
  balance = 0;

  walletPaymentStatus: any;
  cutBalance = 0;
  walletAction = false;
  remainingBalance = 0;
  orderCreateTransactionAmount = 0;

  _promise: any;

  constructor(public userS: UserService, public authS: AuthService, public toastController: ToastController) {
    this.getBalance();
    if (localStorage.getItem("carts") !== null && localStorage.getItem("carts") !== undefined) {
      this.carts = JSON.parse(localStorage.getItem("carts"));
      console.log(this.carts);
      setTimeout(() => {
        this.calculateTotal();
        this.calculateBalance();
        if (this.balance > 0) {
          this.walletAction = true;
        } else {
          this.walletAction = false;
        }
      }, 1000);
    } else {
      this.carts = [];
    }
  }

  getBalance() {
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe((data) => {
      if (data['status'] === 'success') {
        this.balance = data['data']['balance'];
      }
    });
  }

  calculateBalance() {
    if (this.totalPayAmount > this.balance) {
      this.walletPaymentStatus = 'greaterThan';
      this.cutBalance = this.balance;
      this.remainingBalance = 0;
      this.finalTotalPayAmount = Number(this.totalPayAmount) - Number(this.balance);
    } else if (this.totalPayAmount === this.balance) {
      this.walletPaymentStatus = 'isEqual';
      this.finalTotalPayAmount = this.totalPayAmount;
      this.cutBalance = this.balance;
      this.remainingBalance = 0;
    } else if (this.totalPayAmount < this.balance) {
      this.walletPaymentStatus = 'lessThan';
      this.finalTotalPayAmount = this.totalPayAmount;
      this.cutBalance = this.finalTotalPayAmount;
      this.remainingBalance = this.balance - this.finalTotalPayAmount;
    }
    if (this.balance > 0) {
      this.walletAction = true;
    } else {
      this.walletAction = false;
    }
  }

  calculateTotal() {
    this.totalAmount = 0;
    if (this.carts.length > 0) {
      this.carts.forEach(element => {
        if(element['selectedOption'].length > 0){
          let count = 0;
          this._promise = new Promise((resolve: any, reject: any) => {
            element['selectedOption'].forEach((option, index, array) => {
                count += option['data']['priceModifier'];
                if(index === array.length - 1) resolve();
            });
          });
          this._promise.then(() => {
            this.totalAmount = this.totalAmount + ((element['price'] + count) * element['num']);
            this.cartAmount = this.totalAmount - this.discountAmount;
            this.totalPayAmount = this.cartAmount + this.deliveryCharges;
            this.finalTotalPayAmount = this.totalPayAmount;
          })
        }else{
          this.totalAmount = this.totalAmount + (element['price'] * element['num']);
          this.cartAmount = this.totalAmount - this.discountAmount;
          this.totalPayAmount = this.cartAmount + this.deliveryCharges;
          this.finalTotalPayAmount = this.totalPayAmount;
        }
      });
    }
  }

  addCarts(items: any, option = []) {
    
    let productExistInCart: any;
    if(items.unique === undefined){
      let uniqueName = '';
      if(option.length > 0){
        uniqueName = items['name'] + ' ( ' + option[0]['data']['text'] + ' )';
      }else{
        uniqueName = items['name'];
      }
      productExistInCart = this.carts.find(({ unique }) => unique == uniqueName);
      if (!productExistInCart) {
        let uniqueName = '';
        if(option.length > 0){
          uniqueName = items['name'] + ' ( ' + option[0]['data']['text'] + ' )';
        }else{
          uniqueName = items['name'];
        }
        this.carts.push({ ...items, num: 1, selectedOption: option, unique: uniqueName }); // enhance "porduct" opject with "num" property
        localStorage.setItem("carts", JSON.stringify(this.carts));
        this.getBalance();
        this.calculateTotal();
        this.calculateBalance();
        if (productExistInCart.num !== undefined && productExistInCart.num !== null && productExistInCart.num !== 0) {
          if (items.quantity <= productExistInCart.num) {
            this.errorToast(items.name + " product has out of stock.");
            return;
          }
        }
        return;
      }
    }else{
      productExistInCart = this.carts.find(({ unique }) => unique == items.unique);
    }

    if(option.length > 0){
      let count = 0;
      var myPromise = new Promise((resolve: any, reject: any) => {
        this.carts.forEach((element, index, array) => {
          element['selectedOption'].forEach(_element => {
            if(_element['text'] !== option[0]['data']['text']){
              count++;
            }
          });

          if(index === array.length - 1) resolve();
        });
      })

      myPromise.then(()=>{
        if(count > 0){
          let uniqueName = '';
          if(option.length > 0){
            uniqueName = option[0]['data']['text'];
          }else{
            uniqueName = items['name'];
          }
          this.carts.push({ ...items, num: 1, selectedOption: option, unique: uniqueName  }); // enhance "porduct" opject with "num" property
          localStorage.setItem("carts", JSON.stringify(this.carts));
          this.getBalance();
          this.calculateTotal();
          this.calculateBalance();
        }else{
        }
      }); 
    }else{
      if (productExistInCart.num !== undefined && productExistInCart.num !== null && productExistInCart.num !== 0) {
        if (items.quantity <= productExistInCart.num) {
          this.errorToast(items.name + " product has out of stock.");
          return;
        }
      }
  
      productExistInCart.num += 1;
      localStorage.setItem("carts", JSON.stringify(this.carts));
      this.getBalance();
      this.calculateTotal();
      this.calculateBalance();
    }
  }

  getCount_1(items: any) {
    if (this.carts.length > 0) {
      const productExistInCart = this.carts.find(({ name }) => name === items.name);
      if (productExistInCart === undefined) {
        return 0
      } else {
        return productExistInCart.num;
      }
    } else {
      return 0;
    }
  }

  getCount_2(items: any) {
    if (this.carts.length > 0) {
      const productExistInCart = this.carts.find(({ unique }) => unique === items.unique);
      if (productExistInCart === undefined) {
        return 0
      } else {
        return productExistInCart.num;
      } 
    } else {
      return 0;
    }
  }

  removeProduct(items) {
    const productExistInCartOther = this.carts.find(({ unique }) => unique === items.unique);
    productExistInCartOther.num--;
    this.calculateTotal();
    this.calculateBalance();
    this.getBalance();

    if (productExistInCartOther.num === 0) {
      this.carts = this.carts.filter(
        ({ unique }) => unique !== items.unique,
      );
      if (this.carts.length === 0) {
        localStorage.removeItem("carts");
        this.clearFilter();
      }else{
        localStorage.setItem("carts", JSON.stringify(this.carts));
      }
      return;
    }
  }

  clearFilter() {
    this.remainingBalance = 0;
    this.totalPayAmount = 0;
    this.cutBalance = 0;
    this.finalTotalPayAmount = 0
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
