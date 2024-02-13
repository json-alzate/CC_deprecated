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
import { PlanTypes } from '@models/plan.model';

// services
import { FirestoreService } from '@services/firestore.service';

// components

// utils
import { calculateElo } from '@utils/calculate-elo';


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
   * @param themes : or Openings { [key: string]: number; }
   * @returns Return theme with the lowest value
   */
  public getWeakness(themes: {
    [key: string]: number;
  }): string {
    let weakness;
    if (themes) {
      Object.keys(themes).forEach(key => {
        if (!weakness) {
          weakness = themes[key];
        } else if (themes[key] < weakness) {
          weakness = themes[key];
        }
      });
    }
    return weakness;
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

  /**
   * Elos
   */
  calculateEloPuzzlePlan(
    puzzleElo: number, result: 1 | 0.5 | 0,
    planType: PlanTypes,
    themes: string[],
    openingFamily: string,
  ) {

    console.log('themes', themes);
    console.log('openingFamily', openingFamily);

    let elos = {};
    let eloOpening = 1500;
    // se valida el planType para saber sobre que objeto de elos se va a trabajar, validando que el usuario tenga la propiedad elos
    if (this.profile.elos) {

      elos = this.profile.elos[planType];
      // ahora se toman los elos de las aperturas, que se conforman con el planType +'Openings' ejem plan5Openings
      // y se busca el elo de la apertura que se jugo para actualizarlo, sino existe se crea realizando el calculo de elo con 1500
      eloOpening = calculateElo(this.profile.elos[`${planType}Openings`][openingFamily] || 1500, puzzleElo, result);
    } else {
      eloOpening = calculateElo(1500, puzzleElo, result);
    }

    // se recorren los temas para actualizar los elos de los temas jugados en el planType
    themes.forEach(theme => {
      elos[theme] = calculateElo(elos[theme] || 1500, puzzleElo, result);
    });

    // se construye el objeto con los cambios para actualizar, tanto los elos de los temas como el elo de la apertura
    const changes = {
      elos: {
        [planType]: elos
      }
    };

    // se adiciona a los cambios el elo de la apertura, solo si openingFamily no esta vacio
    if (openingFamily) {
      changes.elos[`${planType}Openings`] = {
        [openingFamily]: eloOpening
      };
    }

    console.log('changes', changes);


    // se actualiza el perfil
    // this.updateProfile(changes);


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
