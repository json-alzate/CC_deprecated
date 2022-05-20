//core and third party libraries
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';

import {
  User as FirebaseUser,
  UserCredential,
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithCredential,
  initializeAuth,
  indexedDBLocalPersistence
} from 'firebase/auth';
import { getApp } from 'firebase/app';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

// rxjs
import { from, Subject } from 'rxjs';

// states

// actions

// selectors

// models

// services
import { ProfileService } from '@services/profile.service';

// components



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;

  constructor(
    private profileService: ProfileService
  ) { }

  init() {
    this.auth = this.setAuth();
  }


  setAuth() {
    let auth;
    if (Capacitor.isNativePlatform()) {
      auth = initializeAuth(getApp(), {
        persistence: indexedDBLocalPersistence
      });
    } else {
      auth = getAuth();
    }
    return auth;
  }
  

  async loginGoogle() {
    const answer = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(answer.authentication.idToken, answer.authentication.accessToken);
    await signInWithCredential(this.auth, credential);
  }

  logout() {
    return from(this.auth.signOut());
  }


  getAuthState(): Subject<FirebaseUser> {
    const authState = new Subject<FirebaseUser>();
    this.auth.onAuthStateChanged(user => {
      authState.next(user);
    });
    return authState;
  }



}
