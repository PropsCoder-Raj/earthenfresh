import { Component, OnInit } from '@angular/core';
import { SocialSharing } from '@awesome-cordova-plugins/social-sharing/ngx';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/__helper/api/api.service';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-refer-earn',
  templateUrl: './refer-earn.component.html',
  styleUrls: ['./refer-earn.component.scss'],
})
export class ReferEarnComponent implements OnInit {

  referralAmount = 0;
  transactionList: Array<any> = [];
  transactionCount = 0;
  editS = false;
  referralCode = '';

  constructor(public socialSharing: SocialSharing, public toastController: ToastController, public userS: UserService, public authS: AuthService, public apiS: ApiService) { }

  ngOnInit() {
    this.getSettings();
    this.getTransaction();
  }

  update(){
    if(this.userS.referalCode.length < 8){
      this.errorPresentToast("Your Code must be 8 letter.");
      return;
    }

    this.userS.updateCustomerCode(this.authS.currentUserValue.id, this.userS.referalCode).subscribe((response) =>{
      if(response['status'] === 'success'){
        this.presentToast("Update Code Successfully.");
        this.editS = false;
      }
    });
  }

  getSettings(){
    this.apiS.getSetting().subscribe(data => {
      this.referralAmount = data['data'].amount;
    });
  }

  getTransaction(){
    this.transactionList = [];
    this.transactionCount = 0;
    this.userS.getUserTransaction(this.authS.currentUserValue.id).subscribe((data) => {
      if(data['status'] === 'success'){
        if(data['data'].length > 0){
          data['data'].forEach(element => {
            if(element['type'] === 'referral'){
              this.transactionCount++;
              this.userS.getSigleOrder(element['orderId']).subscribe(order=>{
                this.transactionList.push({data: element, name: order['data']['shippingPerson']['name']});
              })
            }
          });
        }
      }
    });
    
  }

  share(){
    this.socialSharing.share("I’m inviting you to use EarthenFresh. Here’s my code ( " + this.userS.referalCode + " ). \n Download the EarthenFresh app here: \n https://earthenfresh.in/ ");
  }

  back(){
    window.history.back();
  }
  
  copyMessage(val) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.presentToast("Referral Code Copied!")
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      mode: 'ios'
    });
    toast.present();
  }

  async errorPresentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      color: 'danger',
      duration: 2000,
      mode: 'ios'
    });
    toast.present();
  }

}
