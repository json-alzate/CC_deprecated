import { Injectable } from '@angular/core';

/** Capacitor Modules **/
import { ConnectionStatus, Network } from '@capacitor/network';

/** Firebase Modules **/
import { getApp } from 'firebase/app';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Firestore,
  DocumentReference,
  DocumentData,
  FirestoreSettings,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  getFirestore,
  initializeFirestore,
  enableIndexedDbPersistence,
  disableNetwork,
  enableNetwork,
  collection, query, where, getDocs,
  increment
} from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private db: Firestore;

  constructor() { }

  async init() {
    const firestoreSettings: FirestoreSettings & { useFetchStreams: boolean } = {
      useFetchStreams: false
    };
    initializeFirestore(getApp(), firestoreSettings);
    this.db = getFirestore(getApp());
    await enableIndexedDbPersistence(this.db)
      .then(async () => {
        const status: ConnectionStatus = await Network.getStatus();
        if (!status.connected) {
          await this.disableNetwork();
        }
      })
      .catch((err) => {
        console.log('Error in persistence', err);
        if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
        } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
        }
      });
  }

  async disableNetwork() {
    await disableNetwork(this.db);
  }

  async enableNetwork() {
    await enableNetwork(this.db);
  }


}
