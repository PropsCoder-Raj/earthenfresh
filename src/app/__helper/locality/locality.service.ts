import { Injectable } from '@angular/core';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
declare var google:any;

@Injectable({
  providedIn: 'root'
})
export class LocalityService {

  locality = "";

  currentLat: any;
  currentLog: any;

  constructor(public geolocation: Geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.currentLat = position.coords.latitude;
      this.currentLog = position.coords.longitude;
      
      this.getLocalityFromLatLng(this.currentLat, this.currentLog);
    })
  }

  
  getLocalityFromLatLng(lat,lng){
    const geocoder = new google.maps.Geocoder();
    geocoder
      .geocode({ location: {lat,lng} })
      .then((response) => {
        
        if (response.results[0]) {
          if( response.results[0].address_components.length > 0 ){
            response.results[0].address_components.forEach(element => {
                if(element.types.indexOf('locality') !== -1){
                  this.locality = element.short_name;
                }
            });
          }
        }
      }).catch((e) => {});
  }
}
