import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

// models


// states
import { UIState } from './ui.state';
import { AuthState } from './auth.state';
import { CurrentGameState  } from './current-game.state';
import { MovesState } from './moves.state';



export interface AppState {
  ui: UIState;
  auth: AuthState;
  router: RouterReducerState<RouterStateUrl>;
  currentGameState: CurrentGameState;
  moves: MovesState
}
