import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@environments/environment';

import * as fromRouter from '@ngrx/router-store';

// reducers
import { uiReducer } from '@redux/reducers/ui.reducer';
import { authReducer } from '@redux/reducers/auth.reducer';
import { currentGameReducer } from '@redux/reducers/current-game.reducer';
import { movesReducer } from '@redux/reducers/moves.reducer';


// states
import { AppState } from '@redux/states/app.state';


// models



export const appReducers: ActionReducerMap<AppState> = {
    ui: uiReducer,
    auth: authReducer,
    router: fromRouter.routerReducer,
    currentGame: currentGameReducer,
    moves: movesReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];


