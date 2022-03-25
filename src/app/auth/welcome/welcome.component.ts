import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {

  name = "";
  mobile = "";
  email = '';
  password = '';
  pwS = false;
  returnUrl = "";
  signup = false;
  loading = false;
  recaptchaVerifire;
  otpConfirmationResult: firebase.default.auth.ConfirmationResult;

  user:any;
  otpIf: boolean = false;
  otp: any;
  numberIf: boolean = true;
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputStyles: {
      'width': '35px',
      'height': '35px',
      'border-color': '#fc853b',
    }
  };

  constructor(public apiS: ApiService, public toastController: ToastController, public authS: AuthService,private router: Router,public fireAuth: AngularFireAuth) { }

  ngOnInit() { }

  async ionViewDidEnter() {
    try{
      this.recaptchaVerifire = await new firebase.default.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    }catch(err){
      console.log();
    }
    
  }

  async ionViewDidLoad() {
    try{
      this.recaptchaVerifire = await new firebase.default.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
    }catch(err){
      console.log();
    }
  }

  scroll(el: any) {
    document.querySelector('ion-content').scrollByPoint(0,document.getElementById(el).offsetTop,500);
  }

  getOtp() {
    this.otpIf = true;
    this.numberIf = false;
  }

  onOtpChange(otp) {
    this.otp = otp;
  }

  
  getPassword() {
    this.loading = true;
    if (this.mobile !== '') {
      // const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (this.mobile.length != 10) {
        this.errorToast("Please Enter Valid Mobile No.");
        this.loading = false;
        return;
      }

      this.authS.checkUser(this.mobile).subscribe(res=>{
        this.loading = false;
        if(res.status == "success" && res.data == "new"){
          this.signup = true;
        }
      });

      const num = "+91" + this.mobile;
          const appVerifier = this.recaptchaVerifire;
          
          this.fireAuth.signInWithPhoneNumber(num, appVerifier)
            .then(result => {
              console.log(result);
              this.otpConfirmationResult = result;
              // this.successPresentToast("OTP Send")
              // this.sendOtp = true;
              this.loading = false;
            }).catch(err => {
              console.log(err);
              // this.errorPresentToast("Something went wrong");
              this.loading = false;
            })
      this.pwS = true;
    } else {
      this.loading = false;
      this.errorToast("Please Enter mobile.");
    }
  }

  verify_otp() {
    if (this.otp.length === 6) {
      this.loading = true;
      this.otpConfirmationResult.confirm(this.otp.toString())
        .then(result => {
          console.log(result);
          this.loading = true;
          this.user = result.user;
          this.auth();
        })
        .catch(err => {
          this.errorToast(err);
        });
    } else {
      
      this.errorToast("Enter OTP 6 digit number");
    }
  }

  auth(){
    if(this.signup){
      this.signupProcess();
    } else{
      this.login();
    }
      
  }

  login() {
    this.loading = true;
    
    this.authS.userSignIn(this.user.uid).pipe(first()).subscribe(data => {
      this.router.navigateByUrl(this.returnUrl);
      this.loading = false;
      this.clear();
    },
      error => {
        this.loading = false;
        if (error.status == "0") {
          this.errorToast(error);
        } else {
          this.errorToast(error);
        }
      });
    
  }

  signupProcess(){
    this.loading = true;
    if (this.name == '') {
      this.loading = false;
      this.errorToast("Please Enter Full Name");
      return;
    }

    if (this.mobile == '') {
      this.loading = false;
      this.errorToast("Please Enter Mobile No");
      return
    }

    if (this.email == '') {
      this.loading = false;
      this.errorToast("Please Enter Email");
      return;
    }

    this.authS.userSignUp(this.name, this.email,this.mobile,this.user.uid).pipe(first()).subscribe(data => {
      this.router.navigateByUrl(this.returnUrl);
      this.loading = false;
      this.clear();
    },
      error => {
        this.loading = false;
        if (error.status == "0") {
          this.errorToast(error);
        } else {
          this.errorToast(error);
        }
      });

    
  }

  

  clear(){
    this.name = '';
    this.email = '';
    this.mobile = '';
    this.password = '';
    this.signup = false;
    this.pwS = false;
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
