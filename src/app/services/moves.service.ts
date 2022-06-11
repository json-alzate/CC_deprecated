//core and third party libraries
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

// rxjs

// states
import { MovesState } from '@redux/states/moves.state';

// actions
import { addMove } from '@redux/actions/moves.actions';

// selectors

// models
import { Move } from '@models/game.model';

// services

// components

@Injectable({
  providedIn: 'root'
})
export class MovesService {

  constructor(
    private store: Store
  ) { }

  addMoveFromSocket(move: Move) {
    const action = addMove({ move });
    this.store.dispatch(action);
  }

}
