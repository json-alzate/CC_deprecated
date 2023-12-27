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
import { getProfile } from '@redux/selectors/auth.selectors';


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

  private profile: Profile;

  constructor(
    private store: Store<AuthState>,
    private translocoService: TranslocoService,
    private firestoreService: FirestoreService
  ) { }

  get getProfile(): Profile {
    return this.profile;
  }

  /** Elos */
  get eloPuzzles(): number {
    return this.profile?.eloPuzzles || 1500;
  }

  /**
   *
   * @param themes : { [key: string]: number; }
   * @returns Return theme with the lowest value
   */
  public getWeaknessTheme(themes: {
    [key: string]: number;
  }): string {
    let weakness5;
    if (themes) {
      Object.keys(themes).forEach(key => {
        if (!weakness5) {
          weakness5 = themes[key];
        } else if (themes[key] < weakness5) {
          weakness5 = themes[key];
        }
      });
    }
    return weakness5;
  }

  // subscribe to profile
  subscribeToProfile() {
    return this.store.pipe(select(getProfile));
  }

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
    this.profile = profile;
    const action = setProfile({ profile });
    this.store.dispatch(action);
  }

  // clear profile
  clearProfile() {
    this.profile = null;
    const action = setProfile({ profile: null });
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
