import { createReducer, on, Action } from '@ngrx/store';

import { AuthState } from '@redux/states/auth.state';
import {
    setErrorLogin,
    setErrorRegister,
    setProfile,
    logOut
} from '@redux/actions/auth.actions';

export const initialState: AuthState = {
    profile: null,
    errorLogin: null,
    errorRegister: null
};

export const iauthReducer = createReducer(
    initialState,
    on(setProfile, (state, { profile }) => {
        return {
            ...state,
            profile
        };
    }),

    on(setErrorLogin, (state, { error }) => {
        return {
            ...state,
            errorLogin: error
        };
    }),

    on(setErrorRegister, (state, { error }) => {
        return {
            ...state,
            errorRegister: error
        };
    }),

    on(logOut, () => {
        return initialState
    })
);

export function authReducer(state: AuthState | undefined, action: Action) {
    return iauthReducer(state, action);
}
