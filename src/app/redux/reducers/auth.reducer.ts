import { createReducer, on, Action } from '@ngrx/store';

import { AuthState } from '@redux/states/auth.state';
import {
    setProfile,
    logOut
} from '@redux/actions/auth.actions';

export const initialState: AuthState = {
    profile: null
};

export const iauthReducer = createReducer(
    initialState,
    on(setProfile, (state, { profile }) => {
        return {
            ...state,
            profile
        };
    }),

    on(logOut, () => {
        return initialState
    })
);

export function authReducer(state: AuthState | undefined, action: Action) {
    return iauthReducer(state, action);
}
