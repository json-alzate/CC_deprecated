import { Injectable } from '@angular/core';

import { Firestore, doc, onSnapshot, DocumentReference, getDoc } from 'firebase/firestore';

// modeles
import { Profile } from '@models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(
    private firestore: Firestore
  ) { }


  async getProfile(credentials) {

    // TODO: obtener el usuario desde firestore

    const userDoc = doc(this.firestore, `users/${credentials?.uid}`)
    console.log('el usurio recuperado ', userDoc);

    // onSnapshot(userDoc, snap => {

    //   console.log('snap ', snap);

    //   // ...
    // });


    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      console.log( docSnap.data() );
    } else {
      console.log(`No user found with uid`);
    }

  }

  setInitialProfile(profile: Profile) {

  }

}
