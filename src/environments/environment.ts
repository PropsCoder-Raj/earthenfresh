// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'earthenfresh-5c635',
    appId: '1:1037232141397:web:887c960a849a16139d10dc',
    storageBucket: 'earthenfresh-5c635.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyCIt_7482SX_D_YIQrLEDGHnyKtQ3C2pp0',
    authDomain: 'earthenfresh-5c635.firebaseapp.com',
    messagingSenderId: '1037232141397',
    measurementId: 'G-0JFV3KCHV9',
  },
  production: false,
  firebaseConfig:  {
    apiKey: "AIzaSyCIt_7482SX_D_YIQrLEDGHnyKtQ3C2pp0",
    authDomain: "earthenfresh-5c635.firebaseapp.com",
    projectId: "earthenfresh-5c635",
    storageBucket: "earthenfresh-5c635.appspot.com",
    messagingSenderId: "1037232141397",
    appId: "1:1037232141397:web:887c960a849a16139d10dc",
    measurementId: "G-0JFV3KCHV9"
  },
  baseURL : 'http://localhost:8080/api',
  // baseURL:'https://charming-maxwell.134-209-155-58.plesk.page/api',
  testKeyId : 'rzp_test_MFAuUwhaqxmw73',
  testKeySecrete: 'gW1IN1BGyfAVtdyQ1HBx5hlh'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
