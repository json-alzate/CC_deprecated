import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { RouterStateUrl } from './router.state';

// models
import { Plan } from '@models/plan.model';


// states
import { UIState } from './ui.state';
import { AuthState } from './auth.state';
import { CoordinatesPuzzlesState } from './coordinates-puzzles.state';
import { PuzzlesState } from './puzzles.state';
import { UserPuzzlesState } from './user-puzzles.state';



export interface AppState {
  ui: UIState;
  auth: AuthState;
  router: RouterReducerState<RouterStateUrl>;
  coordinatesPuzzles: CoordinatesPuzzlesState;
  puzzles: PuzzlesState;
  userPuzzles: UserPuzzlesState;
  plan: Plan;
}

export const getPlanState = createFeatureSelector<Plan>('plan');

