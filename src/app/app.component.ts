import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';
import { DataService } from './__helper/data/data.service';

import { PluginListenerHandle, Plugins } from '@capacitor/core';
import { PushNotifications, PushNotificationSchema, Token, ActionPerformed } from "@capacitor/push-notifications";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public platform: Platform, public router: Router, public alertController: AlertController, public location: Location, public statusBar: StatusBar, public dataS: DataService) {
    this.initializeApp();
    this.backButtonEvent();
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (this.platform.is('android')) {
        PushNotifications.requestPermissions().then(result => {
          if (result.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
          } else {
            // Show some error
          }
        });
      }
    }, 3000);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#7FB462');
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      setTimeout(() => {
        SplashScreen.hide();
      }, 1000);

    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      if (this.router.url === "/home" || this.router.url === "/auth/welcome?returnUrl=%2Fhome'") {
        // this.presentAlertConfirm();
        navigator["app"].exitApp();
      } else if (this.router.url === "/profile") {
        this.router.navigate(['/home']);
      } else {
        this.location.back();
      }
    })
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm Exit?',
      message: 'Confirm to Exit App !',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Exit',
          handler: () => {
            navigator["app"].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }
}
