import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './__helper/auth/auth.service';
import { UserService } from './__helper/user/user.service';
import { ApiService } from './__helper/api/api.service';
import { JwtInterceptorInterceptor } from './__helper/other/jwt-interceptor.interceptor';
import { ErrorInterceptorInterceptor } from './__helper/other/error-interceptor.interceptor';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { CartsService } from './__helper/carts/carts.service';
import { DataService } from './__helper/data/data.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    HttpClientModule, 
    AppRoutingModule,
    FormsModule,
    CommonModule,
    AngularFireAuthModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth())],
  providers: [
    AuthService, UserService, ApiService, StatusBar, CartsService, DataService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
