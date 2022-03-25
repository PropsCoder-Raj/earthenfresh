import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { HomeComponent } from 'src/app/tabs/home/home.component';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { CartsService } from 'src/app/__helper/carts/carts.service';
import { DataService } from 'src/app/__helper/data/data.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { ExternalLibraryService } from './util';

declare let Razorpay: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {

  response: any;
  razorpayResponse: any;
  showModal = false;
  docId = '';
  paymentId = '';
  paymentStatus = false;

  totalPay = 0;
  totalAmountPay = 0;

  cartAmount = 0;
  coupon = '';
  discount = 0;
  discountId: String = '';

  addressList: Array<any> = [];
  addressCount = 0;
  change = false;
  value = 'Home';

  RAZORPAY_OPTIONS: any = {
    key: '',
    amount: '',
    name: '',
    order_id: '',
    description: 'Products',
    prefill: {
      name: '',
      email: '',
      contact: '',
      method: ''
    },
    modal: {},
    theme: {
      color: '#7FB462'
    }
  };

  name = '';
  mobile = '';
  email = '';
  customerId = '';
  loader = false;
  balance = 0;
  cutBalance = 0;
  walletAction = false;
  walletPaymentStatus = 'isNotEqual';
  finalTotalPayAmount = 0;
  totalPayAmount = 0;

  referralcode = '';
  referralcodeCustomerId = '';
  referralcodeCustomerBalance = 0;
  referralcodeStatus = false;
  maxReferLimit = 0;
  referralCodeApplyAmount = 0;
  pincodesArr: Array<any> = [];

  maximumOrderSubtotal;
  minimumOrderSubtotal;

  constructor(public cartS: CartsService, public apiS: ApiService, public userS: UserService, public authS: AuthService, private razorpayService: ExternalLibraryService, public toastController: ToastController, public router: Router, private cd: ChangeDetectorRef, public dataS: DataService, public homeC: HomeComponent) { }

  ngOnInit() {
    this.razorpayService.lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js').subscribe();
    this.apiS.getSetting().subscribe(data => {
      this.maxReferLimit = data['data'].referLimit;
      this.RAZORPAY_OPTIONS['key'] = data['data'].key;
      this.referralCodeApplyAmount = data['data'].amount;
      this.maximumOrderSubtotal = data['data'].maximumOrderSubtotal;
      this.minimumOrderSubtotal = data['data'].minimumOrderSubtotal;
    });
    this.getPincode();
  }
  
  async getPincode(){
    this.apiS.getProfileInfo().subscribe(data => {
      this.pincodesArr = data['data']['postCodes'];
    });
  }

  ionViewWillEnter() {
    this.getAddress();
    this.getInfo();
    setTimeout(() => {
      this.onChangeValueUpdate();
    }, 1000);
  }

  getInfo() {
    this.email = this.authS.currentUserValue.email;
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe((data) => {
      this.name = data['data']['fullname'];
      this.mobile = data['data']['phone'];
      this.customerId = data['data']['customerId'];
    });
  }

  check(_index) {
    this.value = this.addressList[_index]['data']['type'];
    for (let index = 0; index < this.addressList.length; index++) {
      if (index === _index) {
        this.addressList[_index]['status'] = true;
      } else {
        this.addressList[index]['status'] = false;
      }
    }
  }

  updateUserAddressDefault(id){
    this.userS.updateUserAddressDefault(id).subscribe();
    setTimeout(() => {
      this.homeC.getAddress();
    }, 2000);
  }

  getAddress() {
    this.userS.getAddresses(this.authS.currentUserValue.id).subscribe(data => {
      if (data['status'] === 'success') {
        if (data['data'].length > 0) {
          data['data'].forEach(element => {
            if(element['default'] === true){
              this.addressCount++;
              this.value = element['type'];
              this.addressList.push({ data: element, status: true });
            }else{
              this.addressCount++;
              this.addressList.push({ data: element, status: false });
            }
          });
        }
      }
    });
  }

  applyCoupon() {
    this.apiS.getSingleCoupon(this.coupon).subscribe((data) => {
      if (data['status'] === 'success') {
        if (data['data']) {
          this.discountId = data['data']['id'];
          if (data['data']['status'] === "ACTIVE") {
            if (data['data']['discountType'] === "ABS") {
              this.cartS.discountAmount = Math.round(data['data']['discount']);
              this.cartAmount = this.cartS.totalAmount - this.cartS.discountAmount;
              this.cartS.totalPayAmount = this.cartAmount + this.cartS.deliveryCharges;
              this.discount = this.cartS.discountAmount;
              this.cartS.calculateTotal();
              this.cartS.calculateBalance();
            } else if (data['data']['discountType'] === "PERCENT") {
              let per = Number(this.cartS.totalAmount) / 100;
              let amount = Number(data['data']['discount']) * per;
              this.cartS.discountAmount = Math.round(amount);
              this.cartAmount = this.cartS.totalAmount - this.cartS.discountAmount;
              this.cartS.totalPayAmount = this.cartAmount + this.cartS.deliveryCharges;
              this.discount = this.cartS.discountAmount;
              this.cartS.calculateTotal();
              this.cartS.calculateBalance();
            } else if (data['data']['discountType'] === "ABS_AND_SHIPPING") {
              this.cartS.discountAmount = Math.round(data['data']['discount']);
              this.cartAmount = this.cartS.totalAmount - this.cartS.discountAmount;
              this.cartS.deliveryCharges = 0;
              this.cartS.totalPayAmount = this.cartAmount + this.cartS.deliveryCharges;
              this.discount = this.cartS.discountAmount;
              this.cartS.calculateTotal();
              this.cartS.calculateBalance();
            } else if (data['data']['discountType'] === "SHIPPING") {
              this.cartS.deliveryCharges = 0;
              this.cartS.totalPayAmount = this.cartAmount + this.cartS.deliveryCharges;
              this.discount = this.cartS.discountAmount;
              this.cartS.calculateTotal();
              this.cartS.calculateBalance();
            }
          }
        }
      } else if (data['status'] === 'error') {
        let referralCodeApply = false;
        this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(user => {
          if (user['data']['code'] === this.coupon) {
            this.errorToast("You Cannot use Referral Code your self.");
            return;
          }

          if (user['data']['referralCodeApply'] === true) {
            this.errorToast("Referral Code Expired");
            return;
          }
        });

        this.userS.getRefferalCode(this.coupon).subscribe(data => {
          if (data['count'] === 0) {
            this.errorToast("Coupon OR Referral Code Not found.");
            return;
          }
          else {
            this.userS.getUserReferralTransaction(data['data'][0]['_id']).subscribe(trans => {
              if (trans['count'] < this.maxReferLimit) {
                this.referralcodeStatus = true;
                this.referralcodeCustomerId = data['data'][0]['_id'];
                this.referralcodeCustomerBalance = data['data'][0]['balance'];
                this.cartS.discountAmount = this.referralCodeApplyAmount;
                this.cartS.calculateTotal();
                this.cartS.calculateBalance();
                this.referralcodeStatus = true;
              } else {
                this.errorToast("Referral Code Expired.");
                return;
              }
            });
          }
        });
        // this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe(user => {
        //   if (user['data']['code'] !== this.coupon) {
        //     this.userS.getRefferalCode(this.coupon).subscribe(data => {
        //       if (data['count'] > 0) {
        //         this.userS.getUserReferralTransaction(data['data'][0]['_id']).subscribe(trans => {
        //           if (trans['count'] < 6) {
        //             if (this.cartS.totalAmount >= 100) {
        //               this.referralcodeStatus = true;
        //               this.referralcodeCustomerId = data['data'][0]['_id'];
        //               this.referralcodeCustomerBalance = data['data'][0]['balance'];
        //               this.cartS.discountAmount = 100;
        //               this.cartS.calculateTotal();
        //               this.cartS.calculateBalance();
        //             } else {
        //               this.errorToast("Referral code apply when your cart total price greater than 100");
        //             }
        //           } else {
        //             this.errorToast("Referral Code Expired.");
        //           }
        //         })
        //       } else {
        //         this.errorToast("Coupon OR Referral Code Not found.");
        //       }
        //     })
        //   } else {
        //     this.errorToast("You Cannot use Referral Code your self.");
        //   }
        // });
      }
    });
  }

  back() {
    window.history.back();
  }

  onChangeValueUpdate() {
    this.walletPaymentStatus = this.cartS.walletPaymentStatus;
    this.balance = this.cartS.balance;
    this.walletAction = this.cartS.walletAction;
    this.finalTotalPayAmount = this.cartS.finalTotalPayAmount;
    this.cutBalance = this.cartS.cutBalance;
    this.totalPayAmount = this.cartS.totalPayAmount;
  }

  addCart(item: Array<any>) {
    this.cartS.addCarts(item);
    this.onChangeValueUpdate();
  }

  removeCart(item: any) {
    this.cartS.removeProduct(item);
    this.onChangeValueUpdate();
  }

  createOrder() {
    let street = '';
    let pincode = '';
    let city = '';
    let comment = '';
    let items = [];
    let count_1 = 0;
    this.cartS.carts.forEach((element, index_, array_) => {
      if(element['selectedOption'].length > 0){
        let price = element['price'];
        let promise = new Promise((resolve: any, reject: any) => {
          let orderItemOption: Array<any> = [];
          element['selectedOption'].forEach((option, index, array) => {
            let type = option['type'];
            let selections_: Array<any> = [];
            if (type === 'RADIO' || type === 'SIZE' || type === 'DROPDOWN') {
              price += option['data']['priceModifier'];
              selections_.push({ "selectionTitle": option['data']['text'], "selectionModifier": option['data']['priceModifier'], "selectionModifierType": option['data']['priceModifierType']})
              orderItemOption.push({
                name: option['name'], type: "CHOICE", value: option['data']['text'], selections: selections_
              })
            }
            if (index === array.length - 1) resolve(orderItemOption)
          });
        });
        promise.then((orderItem: any) => {
          count_1++;
          comment = comment + element['unique'] + ' x ' + this.cartS.getCount_2(element) + ', ';
          items.push({ "name": element['unique'].toString(), "productId": element['id'], "price": price ,"productPrice": element['price'], "quantity": element['num'], "selectedOptions": orderItem });
        });
      }else{
        count_1++
        comment = comment + element['name'] + ' x ' + this.cartS.getCount_2(element) + ', ';
        items.push({ "name": element['unique'].toString(), "productId": element['id'], "price": element['price'], "quantity": element['num']});
      }
    });

    let interval = setInterval(() => {
      if (count_1 === this.cartS.carts.length) {
        clearInterval(interval);

        this.addressList.forEach(element => {
          if (element['status'] === true) {
            street = element['data']['house_flat_floor_no'] + ' ' + element['data']['apartment_road_area'] + ' ' + element['data']['landmark'];
            pincode = element['data']['pincode'];
            city = element['data']['city']
          }
        });
        let arr = {
          "name": this.name.toString(),
          "street": street.toString(),
          "city": city.toString(),
          "countryCode": "IN",
          "postalCode": pincode.toString(),
          "phone": this.mobile.toString()
        }
        this.userS.createUserOrder(this.authS.currentUserValue.email, this.customerId, "PAID", "AWAITING_PROCESSING", this.discountId, this.coupon, comment, this.cartS.totalPayAmount, arr, arr, items, this.authS.currentUserValue.id).subscribe((data) => {
          if (data['status'] === 'success') {
            setTimeout(() => {
              if (this.referralcodeStatus === true) {
                this.userS.updateReferralCode(this.authS.currentUserValue.id).subscribe(users => { });
                this.apiS.createTransction(this.referralCodeApplyAmount, 'referral', 'credit', this.referralcode + ' Referral Code Apply ', data['orderData']['_id'], this.referralcodeCustomerId).subscribe((data) => {
                  let balance = Number(this.referralcodeCustomerBalance) + this.referralCodeApplyAmount;
                  this.userS.updateBalance(this.referralcodeCustomerId, balance).subscribe((bdata) => {
                    if (bdata['status'] === 'success') {
                    }
                  });
                });
              }

              if (this.walletAction === false) {
                localStorage.removeItem("carts");
                this.cartS.carts = [];
                this.dataS.dataOrders = undefined;
                this.successToast("Order Palced");
                this.loader = false;
                this.router.navigate(['/orders']);
              } else {
                this.createTransaction(data['orderData']['_id'], comment);
              }
            }, 1000);
          }
        });
      }
    }, 1000)
  }

  createTransaction(id: any, comment: any) {
    this.apiS.createTransction(Number(this.cartS.cutBalance), 'product', 'debit', comment, id, this.authS.currentUserValue.id).subscribe((data) => {
      if (data['status'] === 'success') {
        this.userS.updateBalance(this.authS.currentUserValue.id, this.cartS.remainingBalance).subscribe((bdata) => {
          if (bdata['status'] === 'success') {

            this.cartS.balance = this.cartS.remainingBalance;
            this.userS.balance = this.cartS.remainingBalance;
            // this.userS.getsUserInfo();
            localStorage.removeItem("carts");
            this.cartS.carts = [];
            this.dataS.dataOrders = undefined;
            this.successToast("Order Placed");
            setTimeout(() => {
              this.loader = false;
              this.router.navigate(['/orders']);
            }, 500);
          }
        })
      } else {
        this.errorToast("Something went wrong!");
      }
    });
  }

  public razorPaySuccessHandler(response: any) {
    this.razorpayResponse = `Razorpay Response`;
    this.showModal = true;
    this.cd.detectChanges();
    if (response.razorpay_payment_id !== '') {
      this.createOrder();
    } else{
      this.loader = false;
    }
  }

  payment() {
    let cnt = 0;
    this.loader = true;

    let pincode = 0;
    this.addressList.forEach(element => {
      if (element['status'] === true) {
        pincode = element['data']['pincode'];
        let newPromise = new Promise((resolve: any, reject: any) => {
          let count = 0;
          let newPromise_ = new Promise((resolve_: any, reject_: any) => {
            this.pincodesArr.forEach((element, index, array) => {
              if(Number(element) === pincode){
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
    
        newPromise.then(() => {
          this.cartS.carts.forEach((element) => {
            this.apiS.getSingleProduct(element['id']).subscribe(data => {
              if (element['num'] > data['data']['quantity']) {
                this.errorToast(element['name'] + " has only " + data['data']['quantity'] + " stock available.");
                this.loader = false;
                return;
              } else {
                cnt++;
              }
            });
          });

          let interval = setInterval(() => {
            if (this.cartS.carts.length === cnt) {
              clearInterval(interval);
              if (this.minimumOrderSubtotal >= this.cartS.totalPayAmount) {
                this.loader = false;
                this.errorToast("Minimum Cart Amount Limit ₹ " + this.minimumOrderSubtotal);
                return;
              }
              
              if (this.maximumOrderSubtotal <= this.cartS.totalPayAmount && this.maximumOrderSubtotal !== 0) {
                this.loader = false;
                this.errorToast("Add items worth ₹ " + this.maximumOrderSubtotal +" to proceed payment");
                return;
              }

              if (this.addressCount === 0) {
                this.loader = false;
                this.errorToast("Please Address Add.")
                return
              }

              if (this.walletPaymentStatus === 'greaterThan' || this.walletAction === false) {
                this.razorPay();
              } else {
                this.createOrder();
              }
            }
          }, 1000);
        }).catch(() =>{ 
          this.loader = false;
          this.errorToast("Sorry, delivery is not available at your location yet");
        })
      }
    });
  }

  razorPay() {
    this.RAZORPAY_OPTIONS.amount = this.cartS.finalTotalPayAmount + '00';
    this.RAZORPAY_OPTIONS.prefill.name = this.name;
    this.RAZORPAY_OPTIONS.prefill.email = this.email;
    this.RAZORPAY_OPTIONS.prefill.contact = this.mobile;
    this.RAZORPAY_OPTIONS.modal = {
      "ondismiss": function(){
        document.getElementById("closeForm").click();
      }
    };
    this.RAZORPAY_OPTIONS['handler'] = this.razorPaySuccessHandler.bind(this);
    // this.showPopup();
    let razorpay = new Razorpay(this.RAZORPAY_OPTIONS);
    razorpay.open();
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
