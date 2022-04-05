// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { keys } from './private/keys';

export const environment = {
  production: false,
  environmentName: 'dev',
  firebase: {
    projectId: 'chesscolate',
    appId: '1:798600509062:web:f1e8462b16c7a923f40307',
    storageBucket: 'chesscolate.appspot.com',
    locationId: 'us-central',
    apiKey: 'AIzaSyAjga1aJ7fdk6F0yqyzN85-3sbLmtaozus',
    authDomain: 'chesscolate.firebaseapp.com',
    messagingSenderId: '798600509062',
    measurementId: 'G-BERFF7M2CF',
  }
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
