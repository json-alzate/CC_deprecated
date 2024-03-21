

export const environment = {
  firebase: {
    projectId: process?.env?.FIREBASE_projectId,
    appId: process?.env?.FIREBASE_appId,
    storageBucket: process?.env?.FIREBASE_storageBucket,
    locationId: process?.env?.FIREBASE_locationId,
    apiKey: process?.env?.FIREBASE_apiKey,
    authDomain: process?.env?.FIREBASE_authDomain,
    messagingSenderId: process?.env?.FIREBASE_messagingSenderId,
    measurementId: process?.env?.FIREBASE_measurementId,
  },
  production: true,
  environmentName: 'prod',
  apiPuzzlesUrl: 'https://puzzles.chesscolate.com/puzzles/',
  version: '1.0.1'
};
