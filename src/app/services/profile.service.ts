// core and third party libraries
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Store, select } from '@ngrx/store';

// rxjs

// states
import { AuthState } from '@redux/states/auth.state';

// actions
import { setProfile, requestUpdateProfile } from '@redux/actions/auth.actions';

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

  // request update profile
  requestUpdateProfile(profile: Partial<Profile>) {
    const action = requestUpdateProfile({ profile });
    this.store.dispatch(action);
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
    this.profile = {
      ...this.profile,
      ...changes
    };
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

  calculateEloPuzzlePlan(
    puzzleElo: number, result: 1 | 0.5 | 0,
    planType: PlanTypes,
    themes: string[],
    openingFamily: string,
  ) {
    console.log('themes', themes);
    console.log('openingFamily', openingFamily);

    // Asumiendo que existe una estructura inicial para el objeto de elos
    const elos = this.profile?.elos ? { ...this.profile.elos } : {};
    let eloOpening = 1500;

    if (this.profile?.elos) {
      // Copia profunda para el planType específico, evitando la mutación directa
      elos[planType] = { ...(elos[planType] || {}) };

      if (openingFamily && this.profile.elos[`${planType}Openings`]) {
        eloOpening = calculateElo(this.profile.elos[`${planType}Openings`][openingFamily] || 1500, puzzleElo, result);
      }
    } else {
      eloOpening = calculateElo(1500, puzzleElo, result);
    }

    themes.forEach(theme => {
      elos[planType][theme] = calculateElo(elos[planType][theme] || 1500, puzzleElo, result);
    });

    // Inicializa el objeto de cambios con una copia de los elos existentes para evitar la sobrescritura
    const changes = { elos: { ...elos } };

    // Actualiza específicamente para el tipo de plan y aperturas, haciendo merge adecuado
    changes.elos[planType] = { ...changes.elos[planType], ...elos[planType] };

    if (openingFamily) {
      changes.elos[`${planType}Openings`] = {
        ...(changes.elos[`${planType}Openings`] || {}),
        [openingFamily]: eloOpening
      };
    }

    console.log('changes', changes);

    // se actualiza el perfil con los cambios
    this.requestUpdateProfile(changes);
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
