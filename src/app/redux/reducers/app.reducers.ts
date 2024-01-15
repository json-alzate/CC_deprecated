import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@environments/environment';

import * as fromRouter from '@ngrx/router-store';

// reducers
import { uiReducer } from '@redux/reducers/ui.reducer';
import { authReducer } from '@redux/reducers/auth.reducer';
import { coordinatesPuzzleReducer } from '@redux/reducers/coordinates-puzzles.reducer';
import { puzzlesReducer } from '@redux/reducers/puzzles.reducer';
import { userPuzzlesReducer } from '@redux/reducers/user-puzzles.reducer';
import { planReducer } from '@redux/reducers/plan.reducer';


// states
import { AppState } from '@redux/states/app.state';


// models



export const appReducers: ActionReducerMap<AppState> = {
    ui: uiReducer,
    auth: authReducer,
    router: fromRouter.routerReducer,
    coordinatesPuzzles: coordinatesPuzzleReducer,
    puzzles: puzzlesReducer,
    userPuzzles: userPuzzlesReducer,
    plan: planReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];


