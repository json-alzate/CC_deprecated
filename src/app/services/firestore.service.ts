import { Injectable } from '@angular/core';

/** Capacitor Modules **/
import { ConnectionStatus, Network } from '@capacitor/network';

import { randomNumber } from '@utils/random-number';

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
  increment,
  limit,
  Query
} from 'firebase/firestore';


// Models
import { Profile } from '@models/profile.model';
import { CoordinatesPuzzle } from '@models/coordinates-puzzles.model';
import { Puzzle } from '@models/puzzle.model';
import { UserPuzzle } from '@models/user-puzzles.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private db: Firestore;
  private profileDocRef: DocumentReference<DocumentData>;



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


  /**************************************************************/
  /* PROFILE                                                      */
  /**************************************************************/

  /**
   * Get a user from Firestore
   *
   * @param uid
   * @returns Promise<User>
   */
  async getProfile(uid: string): Promise<Profile> {

    this.profileDocRef = doc(this.db, 'Users', uid);
    const docSnap = await getDoc(this.profileDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as Profile;
    } else {
      console.log(`No user found with uid ${uid}`);
      return null;
    }

  }


  /**
   * Crea un nuevo perfil
   *
   * @param profile
   * @returns Promise<void>
   */
  createProfile(profile: Profile) {
    return setDoc(doc(this.db, 'Users', profile.uid), profile);
  }

  /**
   * Update a User in firestore
   *
   * @param changes Partial<User>
   */
  async updateProfile(changes: Partial<Profile>): Promise<void> {
    return updateDoc(this.profileDocRef, changes);
  }


  async checkNickname(nickName: string): Promise<string[]> {
    const nicksToReturn = [];
    const q = query(
      collection(this.db, 'nickNames'),
      where('nickname', '==', nickName)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      const nickToAdd = document.data();
      nicksToReturn.push(nickToAdd);
    });
    return nicksToReturn;

  }


  async addNewNickName(nickname: string, uidUser: string): Promise<string> {
    const docRef = await addDoc(collection(this.db, 'nickNames'), {
      nickname,
      uidUser
    });
    return docRef.id;
  }


  /**
   // ----------------------------------------------------------------------------
   Coordinates Puzzles
   */

  async getCoordinatesPuzzles(uidUser: string): Promise<CoordinatesPuzzle[]> {
    const coordinatesPuzzlesToReturn: CoordinatesPuzzle[] = [];
    const q = query(
      collection(this.db, 'coordinatesPuzzles'),
      where('uidUser', '==', uidUser)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      const coordinaPuzzleToAdd = document.data() as CoordinatesPuzzle;
      coordinaPuzzleToAdd.uid = document.id;
      coordinatesPuzzlesToReturn.push(coordinaPuzzleToAdd);
    });

    return coordinatesPuzzlesToReturn;

  }

  async addCoordinatesPuzzle(coordinatesPuzzle: CoordinatesPuzzle): Promise<string> {
    const docRef = await addDoc(collection(this.db, 'coordinatesPuzzles'), coordinatesPuzzle);
    return docRef.id;
  }



  /**
   // ----------------------------------------------------------------------------
    Puzzles
   */

  async getPuzzlesByElo(eloStart: number, eloEnd: number) {

    const minRandom = randomNumber();
    const puzzlesToReturn: Puzzle[] = [];
    const q = query(
      collection(this.db, 'puzzles'),
      where('randomNumberQuery', '>=', minRandom),
      limit(200)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      const puzzleToAdd = document.data() as Puzzle;
      puzzleToAdd.uid = document.id;
      if (puzzleToAdd.rating >= eloStart && puzzleToAdd.rating <= eloEnd) {
        puzzlesToReturn.push(puzzleToAdd);
      }
    });

    return puzzlesToReturn;
  }

  /**
   * Get puzzles from firestore
   *
   * @param elo: number // si elo === 0, se obtienen puzzles de cualquier elo, si es === -1 es obligatorio start y end en options set rango
   * */
  async getPuzzles(elo: number, options?: {
    rangeStart?: number;
    rangeEnd?: number;
    themes?: string[];
    openingFamily?: string;
    openingVariation?: string;
    color?: 'w' | 'b';
  }) {

    const DEFAULT_RANGE = 600;
    let eloStart = 0;
    let eloEnd = 4000;


    switch (elo) {
      case -1:
        eloStart = options.rangeStart;
        eloEnd = options.rangeEnd;
        break;

      default:
        eloStart = elo - (options?.rangeStart ?? DEFAULT_RANGE);
        eloEnd = elo + (options?.rangeEnd ?? DEFAULT_RANGE);
        break;
    }


    const MAX_ATTEMPTS = 5;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      const minRandom = randomNumber();

      let baseQuery: Query = collection(this.db, 'puzzles');
      baseQuery = query(baseQuery, where('randomNumberQuery', '>=', minRandom), limit(300));

      console.log('options ', options);


      if (options?.themes && options?.themes.length) {
        console.log('options.themes', options.themes);

        const themeConditions = options.themes.map(theme => where('themes', 'array-contains', theme));
        themeConditions.forEach(condition => {
          baseQuery = query(baseQuery, condition);
        });
        console.log('baseQuery', baseQuery);

      }

      if (options?.openingFamily) {
        baseQuery = query(baseQuery, where('openingFamily', '==', options.openingFamily));
      }

      if (options?.openingVariation) {
        baseQuery = query(baseQuery, where('openingVariation', '==', options.openingVariation));
      }

      const querySnapshot = await getDocs(baseQuery);
      const puzzlesToReturn: Puzzle[] = [];

      querySnapshot.forEach((document) => {
        const puzzleToAdd = document.data() as Puzzle;
        if (puzzleToAdd.rating >= eloStart && puzzleToAdd.rating <= eloEnd) {
          // filtrar por color
          if (!options?.color || (options?.color && puzzleToAdd.fen.includes(` ${options.color} `))) {
            puzzleToAdd.uid = document.id;
            puzzlesToReturn.push(puzzleToAdd);
          }

        }
      });

      if (puzzlesToReturn.length) {
        return puzzlesToReturn;
      }

      attempts++;
    }

    // Si después de MAX_ATTEMPTS aún no hay resultados, simplemente devolvemos un array vacío
    return [];

  }

  /**
   * Get one puzzle by uid
   * Obtiene un puzzle por su uid
   *
   * @param uid
   */

  async getPuzzleByUid(uid: string): Promise<Puzzle> {
    const docRef = doc(this.db, 'puzzles', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Puzzle;
    } else {
      console.log(`No puzzle found with uid ${uid}`);
      return null;
    }
  }




  /**
   // ----------------------------------------------------------------------------
    User Puzzles
   */


  /**
   * Gets the puzzles that the user has made
   * Obtiene los problemas que el usuario a realizado
   *
   * @param uidUser
   * @returns
   */
  async getUserPuzzlesByUidUser(uidUser: string): Promise<UserPuzzle[]> {
    const userPuzzlesToReturn: UserPuzzle[] = [];
    const q = query(
      collection(this.db, 'userPuzzles'),
      where('uidUser', '==', uidUser)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((document) => {
      const userPuzzleToAdd = document.data() as UserPuzzle;
      userPuzzleToAdd.uid = document.id;
      userPuzzlesToReturn.push(userPuzzleToAdd);
    });

    return userPuzzlesToReturn;

  }


  /**
   * Add one Puzzle done
   * Adiciona un puzzle realizado
   *
   * @param userPuzzle
   * @returns
   */
  async addOneUserPuzzle(userPuzzle: UserPuzzle): Promise<string> {
    const docRef = await addDoc(collection(this.db, 'userPuzzles'), userPuzzle);
    return docRef.id;
  }


  /**
   // ----------------------------------------------------------------------------
    Plan
   */

  /**
   * Save a plan in firestore
   * Guarda un plan en firestore
   *
   * @param plan
   * @returns
   * */
  async savePlan(plan: any): Promise<string> {
    const docRef = await addDoc(collection(this.db, 'plans'), plan);
    return docRef.id;
  }



  //------- Admin only

  // add new puzzle
  async adminAddNewPuzzle(puzzleToAdd: Puzzle): Promise<string> {
    await setDoc(doc(this.db, 'puzzles', puzzleToAdd.uid), puzzleToAdd);
    return puzzleToAdd.uid;
  }

  // get total number of puzzles in db
  async adminGetTotalPuzzles(): Promise<number> {
    const q = query(
      collection(this.db, 'puzzles'),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }






}
