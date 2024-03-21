let localKeys;
if (!process?.env?.FIREBASE_apiKey) {
  localKeys = require('./private/keys').keys;
}


export const environment = {
  firebase: {
    projectId: process?.env?.FIREBASE_projectId || localKeys.firebase.projectId,
    appId: process?.env?.FIREBASE_appId || localKeys.firebase.appId,
    storageBucket: process?.env?.FIREBASE_storageBucket || localKeys.firebase.storageBucket,
    locationId: process?.env?.FIREBASE_locationId || localKeys.firebase.locationId,
    apiKey: process?.env?.FIREBASE_apiKey || localKeys.firebase.apiKey,
    authDomain: process?.env?.FIREBASE_authDomain || localKeys.firebase.authDomain,
    messagingSenderId: process?.env?.FIREBASE_messagingSenderId || localKeys.firebase.messagingSenderId,
    measurementId: process?.env?.FIREBASE_measurementId || localKeys.firebase.measurementId,
  },
  production: false,
  environmentName: 'staging',
  apiPuzzlesUrl: 'https://puzzles.chesscolate.com/puzzles/',
  version: '1.0.1'
};
