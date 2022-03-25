import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  notificationCount = 0;
  notificationList: Array<any> = [];

  constructor(public userS: UserService) { }

  ngOnInit() {
    this.getNotification();
  }

  getNotification(){
    this.userS.getUsersUsersnotifications().subscribe(data => {
      if(data['data'].length > 0){
        this.notificationCount++;
        this.notificationList = data['data'];
        this.notificationList.forEach(element =>{
          if(element['view_status'] === false){
            this.userS.updateUsersnotifications(element['_id']).subscribe(res => {
            });
          }
        });
      }
    });
  }

  back(){
    window.history.back();
  }

}
