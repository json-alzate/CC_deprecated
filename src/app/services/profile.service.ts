// core and third party libraries
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

// rxjs

// states

// actions

// selectors

// models
import { User as FirebaseUser } from 'firebase/auth';
import { Profile } from '@models/profile.model';

// services
import { UtilsService } from '@services/utils.service';
import { FirestoreService } from '@services/firestore.service';

// components


@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  constructor(
    private utilsService: UtilsService,
    private translocoService: TranslocoService,
    private firestoreService: FirestoreService
  ) { }

  /**
   * Valida si el perfil existe en la BD y lo lleva al estado redux.
   * Sino existe se inicia el proceso para registrar el perfil en la BD
   * @param dataAuth 
   */
  async checkProfile(dataAuth: FirebaseUser) {

    const profile = await this.firestoreService.getProfile(dataAuth?.uid);
    if (profile) {
      console.log('el perfil ', profile);
    } else {
      console.log('no existe a crearlo');
      this.setInitialProfile(dataAuth);
    }

  }


  private async setInitialProfile(dataAuth: FirebaseUser) {

    const profileForSet: Profile = {
      uid: dataAuth.uid,
      email: dataAuth.email,
      name: dataAuth.displayName,
      urlAvatar: dataAuth.photoURL,
      elo: 1500,
      lang: this.translocoService.getActiveLang(),
      createAt: new Date().getTime()
    };

    await this.firestoreService.createProfile(profileForSet);



  }

}
