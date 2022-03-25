import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public dataCategories: any = [];
  public dataProducts: any = [];
  public dataOrders: any;
  orders = [];
  categoriesCount = 0;

  constructor(private apiS: ApiService, public authS: AuthService) {
    this.getProducts();
  }

  getProducts() {
    this.categoriesCount = 0;
    this.apiS.getAllCategories().subscribe((data) => {
      if (data['status'] === 'success') {
        data['data'].forEach(element => {
          this.categoriesCount++;
          this.apiS.getcategoryWiseProduct(element['id']).subscribe(pData => {
            if (pData['status'] === 'success') {
              this.dataCategories.push({ data: element, products: pData['data'] });
            }
          })
        });
        let interval = setInterval(() => {
          if (data['data'].length === this.dataCategories.length) {
            clearInterval(interval);
            this.dataCategories = this.dataCategories;
          }
        }, 1000);
      }
    });
    this.apiS.getAllProducts().subscribe((data) => {
      if (data['status'] === 'success') {
        this.dataProducts = data['data'];
      }
    })
  }


}
