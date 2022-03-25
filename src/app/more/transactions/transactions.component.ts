import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/__helper/auth/auth.service';
import { UserService } from 'src/app/__helper/user/user.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {

  transactionList = [];
  transactionCount = 0;

  constructor(public userS: UserService, public authS: AuthService) { }

  ngOnInit() {
    this.getTransaction();
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getTransaction();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  getTransaction(){
    this.transactionList = [];
    this.transactionCount = 0;
    this.userS.getUserTransaction(this.authS.currentUserValue.id).subscribe((data) => {
      if(data['status'] === 'success'){
        data['data'].forEach(element => {
          this.transactionCount++;
          if(element['orderId'] !== null && element['orderId'] !== undefined){
            this.userS.getSigleOrder(element['orderId']).subscribe(order=>{
              this.transactionList.push({data: element, orderId: order['data']['orderId']});
            })
          }else{
              this.transactionList.push({data: element});
          }
        });;
      }
    });
  }

  back(){
    window.history.back();
  }

}
