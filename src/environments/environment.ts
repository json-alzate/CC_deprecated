// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
let localKeys;
if (!process.env.FIREBASE_apiKey) {
  localKeys = require('./private/keys').keys;
}


export const environment = {
  production: false,
  environmentName: 'dev',
  firebase: {
    projectId: process.env.FIREBASE_projectId || localKeys.firebase.projectId,
    appId: process.env.FIREBASE_appId || localKeys.firebase.appId,
    storageBucket: process.env.FIREBASE_storageBucket || localKeys.firebase.storageBucket,
    locationId: process.env.FIREBASE_locationId || localKeys.firebase.locationId,
    apiKey: process.env.FIREBASE_apiKey || localKeys.firebase.apiKey,
    authDomain: process.env.FIREBASE_authDomain || localKeys.firebase.authDomain,
    messagingSenderId: process.env.FIREBASE_messagingSenderId || localKeys.firebase.messagingSenderId,
    measurementId: process.env.FIREBASE_measurementId || localKeys.firebase.measurementId,
  },
  apiPuzzlesUrl: 'http://[::1]:3000/puzzles/',
  version: '1.0.1'
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
