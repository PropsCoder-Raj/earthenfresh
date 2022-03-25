import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EditProfileComponent } from 'src/app/auth/edit-profile/edit-profile.component';
import { RatingComponent } from 'src/app/auth/rating/rating.component';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { DataService } from 'src/app/__helper/data/data.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  name = '';
  mobile = '';
  email = '';
  customerId = '';
  balance = 0;

  loading = false;
  orders: any = [];
  
  

  constructor(public modalController: ModalController, public authS: AuthService, public userS: UserService, public dataS: DataService) { }

  ionViewWillEnter(){
    
    this.getBalance();
  }

  ngOnInit() {
  }

  getBalance(){
    this.userS.getSigleUser(this.authS.currentUserValue.id).subscribe((data) => {
      if(data['status'] === 'success'){
        this.balance = data['data']['balance'];
      }
    });
  }
  
  
  async editProfileModal() {
    const modal = await this.modalController.create({
      mode: "ios",
      component: EditProfileComponent
    });

    return await modal.present();
  }

  logout(){
    this.authS.logout();
  }


}
