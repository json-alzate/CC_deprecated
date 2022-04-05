import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from '@environments/environment';

import * as fromRouter from '@ngrx/router-store';

// reducers
import { uiReducer } from '@redux/reducers/ui.reducer';
import { authReducer } from '@redux/reducers/auth.reducer';


// states
import { AppState } from '@redux/states/app.state';
import { UIState } from '@redux/states/ui.state';
import { AuthState } from '@redux/states/auth.state';


// models



export const appReducers: ActionReducerMap<AppState> = {
    ui: uiReducer,
    auth: authReducer,
    router: fromRouter.routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

// getters for parts of the state
export const getUIState = createFeatureSelector<UIState>('ui');
export const getAuthState = createFeatureSelector<AuthState>('auth');
