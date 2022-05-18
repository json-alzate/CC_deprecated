
import { Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithCredential
} from '@angular/fire/auth';

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';


import { from } from 'rxjs';

// Services
import { ProfileService } from '@services/profile.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private profileService: ProfileService
  ) { }

  async loginGoogle() {
    const answer = await GoogleAuth.signIn();
    const credential = GoogleAuthProvider.credential(answer.authentication.idToken, answer.authentication.accessToken);
    await signInWithCredential(this.auth, credential);
  }

  logout() {
    return from(signOut(this.auth));
  }

  authState() {
    onAuthStateChanged(this.auth, (credential) => {
      if (credential) {
        this.profileService.getProfile(credential);
      }
    });
  }



}
