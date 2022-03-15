import { ActionReducerMap, createFeatureSelector, MetaReducer } from '@ngrx/store';
import { environment } from '@environments/environment';

import * as fromRouter from '@ngrx/router-store';

// reducers
import { uiReducer } from '@redux/reducers/ui.reducer';


// states
import { AppState } from '@redux/states/app.state';
import { UIState } from '@redux/states/ui.state';


// models



export const appReducers: ActionReducerMap<AppState> = {
    ui: uiReducer,
    router: fromRouter.routerReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];

// getters for parts of the state
export const getUIState = createFeatureSelector<UIState>('ui');
