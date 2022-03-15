import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

// models


// states
import { UIState } from './ui.state';



export interface AppState {
  ui: UIState;
  router: RouterReducerState<RouterStateUrl>;
}
