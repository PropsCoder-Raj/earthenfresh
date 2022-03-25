import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  name = '';
  mobile = '';
  email = '';
  loader = false;

  constructor(public modalController:ModalController, public authS: AuthService, public userS: UserService, public toastController: ToastController) { }

  ngOnInit() {
    this.email = this.authS.currentUserValue.email;
    this.name = this.userS.name;
    this.mobile = this.userS.phone;
  }

  closeModal(){
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  updateProfile(){
    this.loader = true;
    this.userS.updateUser(this.authS.currentUserValue.id, this.name, this.email, this.mobile).subscribe((data) => {
      if(data['status'] === 'success'){
        this.loader = false;
        this.successToast("Successfully Update User");
        this.modalController.dismiss({
          'dismissed': true,
          'message': 'update'
        });
        this.userS.name = this.name;
        this.userS.phone = this.mobile;
      }
    })
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
