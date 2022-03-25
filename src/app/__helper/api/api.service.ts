import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators'
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public _headers: any;

  constructor(public http: HttpClient,public authS: AuthService) {
    this._headers = { 'Content-Type': 'application/json' };
  }

  // Get Setting
  getProfileInfo() {
    return this.http.get<any>(`${environment.baseURL}/profile/info`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Setting
  getSetting() {
    return this.http.get<any>(`${environment.baseURL}/settings`)
      .pipe(map(data => {
        return data;
      }));
  }

  /*********************************   Transactions   ***********************************/

  createTransction(amount: any, type: any, transactionType: any, message: any, orderId: any, userId: any) {
    const data = JSON.stringify({
      "amount": amount,
      "type": type,
      "transactionType": transactionType,
      "message": message,
      "orderId": orderId,
    });
    return this.http.post<any>(`${environment.baseURL}/transaction/` + userId, data, { headers: this._headers})
    .pipe(map(data => {
      return data;
    }));
  }

  /*********************************   File Handling   ***********************************/

  uploadFile(filedata:any) {
    return this.http.post<any>(`${environment.baseURL}/upload/`, filedata)
    .pipe(map(data => {
      return data;
    }));
  }

  downloadFile(filename:any) {
    return this.http.get<any>(`${environment.baseURL}/retrieve/`+filename).subscribe(data=>{
    });
  }


  /*********************************   Category   ***********************************/

  // Get All Categories
  getAllCategories() {
    return this.http.get<any>(`${environment.baseURL}/category/all`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Category
  getSingleCategory(id: any) {
    return this.http.get<any>(`${environment.baseURL}/category/single?categoryid=` + id)
      .pipe(map(data => {
        return data;
      }));
  }



  /*********************************   Products   ***********************************/

  // Get All Products
  getAllProducts() {
    return this.http.get<any>(`${environment.baseURL}/products/all`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Category-Wise Product
  getcategoryWiseProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/products?categoryid=` + id)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Product
  getSingleProduct(id: any) {
    return this.http.get<any>(`${environment.baseURL}/single-product?productId=` + id)
      .pipe(map(data => {
        return data;
      }));
  }


  /*********************************   Banners   ***********************************/

  // Create Banner
  createBanner(name: any, description: any, mediaArr: any) {
    const data = JSON.stringify({
      "name": name,
      "description": description,
      "media": mediaArr
    });
    return this.http.post<any>(`${environment.baseURL}/banner`, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Banner
  updateBanner(name: any, description: any, mediaArr: any, id: any) {
    const data = JSON.stringify({
      "name": name,
      "description": description,
      "media": mediaArr
    });
    return this.http.put<any>(`${environment.baseURL}/banner/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get All Banner
  getAllBanner() {
    return this.http.get<any>(`${environment.baseURL}/banner`)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Banner
  getSingleBanner(id: any) {
    return this.http.get<any>(`${environment.baseURL}/banner/` + id)
      .pipe(map(data => {
        return data;
      }));
  }


  /*********************************   Coupons   ***********************************/
  
  // Get Single Coupon
  getSingleCoupon(id: any) {
    try{
      return this.http.get<any>(`${environment.baseURL}/single-coupons?couponsId=` + id)
        .pipe(map(data => {
          return data;
        }));
    }catch(err){
      let arr: any = [{status : 'error'}];
      return JSON.parse(arr);
    }    
  }



  /*********************************   Ratings   ***********************************/

  // Create Ratings
  createRatings(id: any, rating: any, productId: any, customerId: any, orderId: any) {
    const data = JSON.stringify({
      "rating": rating,
      "productId": productId,
      "customerId": customerId,
      "orderId": orderId
    });
    return this.http.post<any>(`${environment.baseURL}/ratings/`+ id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Update Ratings
  updateRatings(id: any, rating: any) {
    const data = JSON.stringify({
      "rating": rating
    });
    return this.http.put<any>(`${environment.baseURL}/ratings/` + id, data, { headers: this._headers })
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Ratings Product Wise
  getRatingsProductsWise(productId: any) {
    return this.http.get<any>(`${environment.baseURL}/ratings/product/`+ productId)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Ratings Order Id
  getRatingsOrderId(orderId: any) {
    return this.http.get<any>(`${environment.baseURL}/ratings/order/`+ orderId)
      .pipe(map(data => {
        return data;
      }));
  }

  // Get Single Ratings
  getSingleRatings(id: any) {
    return this.http.get<any>(`${environment.baseURL}/ratings/` + id)
      .pipe(map(data => {
        return data;
      }));
  }


}

