import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public _headers: any;
  public name = '';
  public customerId = '';
  public referalCode = '';
  public balance = 0;
  public phone = '';



  constructor(public http: HttpClient, public authS: AuthService) {
    this._headers = { 'Content-Type': 'application/json' };
    this.getsUserInfo();
  }

  getsUserInfo(){
    this.getSigleUser(this.authS.currentUserValue.id).subscribe((data) => {
      this.name = data['data']['fullname'];
      this.customerId = data['data']['customerId'];
      this.referalCode = data['data']['code'];
      this.balance = data['data']['balance'];
      this.phone = data['data']['phone'];
    });
  }

  /*********************************   Usersnotifications   ***********************************/

  // Update Usersnotifications
  updateUsersnotifications(id: any) {
    return this.http.put<any>(`${environment.baseURL}/usersnotifications/` + id, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Users Usersnotifications
  getUsersUsersnotifications() {
    return this.http.get<any>(`${environment.baseURL}/usersnotifications/user/` + this.authS.currentUserValue.id)
      .pipe(map(data => {
        return data;
      }));
  }

/*********************************   FcmTokens   ***********************************/

  // Create Fcmtokens
  createFcmtokens(token: any) {
    const data = JSON.stringify({
      "token": token,
      "userId": this.authS.currentUserValue.id
    });
    return this.http.post<any>(`${environment.baseURL}/fcmtokens`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Fcmtokens
  updateFcmtokens(token: any, id: any) {
    const data = JSON.stringify({
      "token": token
    });
    return this.http.put<any>(`${environment.baseURL}/fcmtokens/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Fcmtokens
  getAllFcmtokens() {
    return this.http.get<any>(`${environment.baseURL}/fcmtokens`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Fcmtokens
  getSingleFcmtokens(id: any) {
    return this.http.get<any>(`${environment.baseURL}/fcmtokens/` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Users Fcmtokens
  getUsersFcmtokens() {
    return this.http.get<any>(`${environment.baseURL}/fcmtokens/user/` + this.authS.currentUserValue.id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Refferal Code
  getRefferalCode(code: any) {
    return this.http.get<any>(`${environment.baseURL}/customer/refferal/` + code, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }
  
  // Get User Referral Transaction
  getUserReferralTransaction(customerId: any) {
    return this.http.get<any>(`${environment.baseURL}/transaction/referral/`+ customerId, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }
  
  // Get User Transaction
  getUserTransaction(customerId: any) {
    return this.http.get<any>(`${environment.baseURL}/transaction/`+ customerId, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Create User Orders
  createUserOrder(email: any, customerId: any, paymentStatus: any, fulfillmentStatus: any, discount: any, code: any, orderComments: any, total: any, additionalInfo: any, shippingPerson: any, items: any, id: any) {
    const data = JSON.stringify({
      "paymentStatus": paymentStatus,
      "fulfillmentStatus": fulfillmentStatus,
      "email": email,
      "customerId": customerId,
      "discount": discount,
      "code": code,
      "orderComments": orderComments,
      "total": total,
      "additionalInfo": additionalInfo,
      "shippingPerson": shippingPerson,
      "items": items,
      "id": id
    });
    return this.http.post<any>(`${environment.baseURL}/order`, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // getSigleOrder
  getSigleOrder(id : any) {
    return this.http.get<any>(`${environment.baseURL}/order-single/`+ id, )
    .pipe(map(data => {
      return data;
    }));
  }

  // Get User Orders
  getUserOrder(customerId: any) {
    return this.http.get<any>(`${environment.baseURL}/orders/`+ customerId, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // Create User Address
  createUserAddress(id: any, house_flat_floor_no: any, apartment_road_area: any, landmark: any, city: any, pincode: any, type: any) {
        const data = JSON.stringify({
          "house_flat_floor_no": house_flat_floor_no,
          "apartment_road_area": apartment_road_area,
          "landmark": landmark,
          "city": city,
          "pincode": pincode.toString(),
          "type": type
        });
        return this.http.post<any>(`${environment.baseURL}/address/`+ id, data, {headers: this._headers})
        .pipe(map(data => {
          return data;
        }));
  }

  // Update User Address
  updateUserAddressDefault(id: any) {
    return this.http.put<any>(`${environment.baseURL}/address/default/`+ id + '/' + this.authS.currentUserValue.id,{headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }


  // Update User Address
  updateUserAddress(id: any, house_flat_floor_no: any, apartment_road_area: any, landmark: any, city: any, pincode: any, type: any) {
    const data = JSON.stringify({
      "house_flat_floor_no": house_flat_floor_no,
      "apartment_road_area": apartment_road_area,
      "landmark": landmark,
      "city": city,
      "pincode": pincode.toString(),
      "type": type
    });
    return this.http.put<any>(`${environment.baseURL}/address/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  // deleteAddress
  deleteAddress(id : any) {
    return this.http.delete<any>(`${environment.baseURL}/address/`+ id + '/' + this.authS.currentUserValue.id, )
    .pipe(map(data => {
      return data;
    }));
  }

  // getAddresses
  getAddresses(id : any) {
    return this.http.get<any>(`${environment.baseURL}/address/`+ id, )
    .pipe(map(data => {
      return data;
    }));
  }

  // getSigleUser
  getSigleUser(id : any) {
    return this.http.get<any>(`${environment.baseURL}/customer/info/`+ id, )
    .pipe(map(data => {
      return data;
    }));
  }

  // updateUser
  updateUser(id: any, fullname: any, email: any, phone: any) {
    const data = JSON.stringify({
      "email": email,
      "fullname": fullname,
      "phone": phone,
    });
    return this.http.put<any>(`${environment.baseURL}/customer/update/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  updateReferralCode(id: any) {
    const data = JSON.stringify({
      "referralCodeApply": true
    });
    return this.http.put<any>(`${environment.baseURL}/customer/referral/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  updateCustomerCode(id: any, code: any) {
    const data = JSON.stringify({
      "code": code
    });
    return this.http.put<any>(`${environment.baseURL}/customer/referral-code/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  updateBalance(id: any, balance: any) {
    const data = JSON.stringify({
      "balance": balance,
    });
    return this.http.put<any>(`${environment.baseURL}/balance/`+ id, data, {headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }


  get(): Observable<any> {
    return this.http.get(`${environment.baseURL}/user/all`,);
  }
  
  // changePassword
  changePassword(id : any, password : any) {
    const data = JSON.stringify({
      "password": password
    });
    return this.http.put<any>(`${environment.baseURL}/user/change-password/` + id, data, )
    .pipe(map(data => {
      return data;
    }));
  }

  // updateWishList
  updateWishlist(id: any, wishlistArr: any) {
    const data = JSON.stringify({
      "wishlist": wishlistArr
    });
    return this.http.put<any>(`${environment.baseURL}/user/wishlist/`+ id, data)
    .pipe(map(data => {
      return data;
    }));
  }

  // getWishList
  getWishlist(id: any) {
    return this.http.get<any>(`${environment.baseURL}/user/wishlist/`+ id)
    .pipe(map(data => {
      return data;
    }));
  }
  
  // getCart
  getCart(id: any) {
    return this.http.get<any>(`${environment.baseURL}/user/cart/`+ id)
    .pipe(map(data => {
      return data;
    }));
  }
  
  // updateCart
  updateCart(id: any, cartArr: any) {
    const data = JSON.stringify({
      "cart": cartArr
    });
    return this.http.put<any>(`${environment.baseURL}/user/cart/`+ id, data)
    .pipe(map(data => {
      return data;
    }));
  }


}
