import { RouterReducerState } from '@ngrx/router-store';
import { RouterStateUrl } from './router.state';

// models


// states
import { UIState } from './ui.state';
import { AuthState } from './auth.state';



export interface AppState {
  ui: UIState;
  auth: AuthState;
  router: RouterReducerState<RouterStateUrl>;
}
