// core and third party libraries
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store, select } from '@ngrx/store';

// rxjs

// states
import { AuthState } from '@redux/states/auth.state';

// actions
import { setProfile } from '@redux/actions/auth.actions';

// selectors

// models
import { User as FirebaseUser } from 'firebase/auth';
import { Profile } from '@models/profile.model';

// services
import { FirestoreService } from '@services/firestore.service';

// components


@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(
    private store: Store<AuthState>,
    private translocoService: TranslocoService,
    private firestoreService: FirestoreService
  ) { }

  /**
   * Valida si el perfil existe en la BD y lo lleva al estado redux.
   * Sino existe se inicia el proceso para registrar el perfil en la BD
   *
   * @param dataAuth
   */
  async checkProfile(dataAuth: FirebaseUser) {

    const profile = await this.firestoreService.getProfile(dataAuth?.uid);
    if (profile) {
      this.setProfile(profile);
    } else {
      this.setInitialProfile(dataAuth);
    }

  }



  // set profile
  setProfile(profile: Profile) {
    const action = setProfile({ profile });
    this.store.dispatch(action);
  }

  /**
   * Update profile
   *
   * @param changes
   */
  updateProfile(changes: Partial<Profile>): Promise<void> {
    return this.firestoreService.updateProfile(changes);
  }


  /**
   * Verifica si un nickname esta disponible o no
   *
   * @param nickname string
   */
  checkNickNameExist(nickname: string): Promise<string[]> {
    return this.firestoreService.checkNickname(nickname);
  }


  addNewNickName(nickname: string, uidUser: string) {
    return this.firestoreService.addNewNickName(nickname, uidUser);
  }

  private async setInitialProfile(dataAuth: FirebaseUser) {

    const profileForSet: Profile = {
      uid: dataAuth.uid,
      email: dataAuth.email,
      elo: 1500,
      lang: this.translocoService.getActiveLang(),
      createAt: new Date().getTime()
    };

    await this.firestoreService.createProfile(profileForSet);
    this.setProfile(profileForSet);

  }
}
