import { Injectable } from '@angular/core';



import { UserPuzzle } from '@models/user-puzzles.model';

import { FirestoreService } from '@services/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class UserPuzzlesService {

  constructor(
    private firestoreService: FirestoreService
  ) { }



  getUserPuzzles(uid: string) {
    return this.firestoreService.getUserPuzzlesByUidUser(uid);
  }


  addOneUserPuzzle(userPuzzle: UserPuzzle) {
    return this.firestoreService.addOneUserPuzzle(userPuzzle);
  }


}
