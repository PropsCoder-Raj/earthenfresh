import { Component, OnInit } from '@angular/core';
import { AuthService } from '../__helper/auth/auth.service';
import { CartsService } from '../__helper/carts/carts.service';
import { UserService } from '../__helper/user/user.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent implements OnInit {

  constructor(public userS: UserService, public cartS: CartsService, public authS: AuthService) { }

  ngOnInit() {}

}
