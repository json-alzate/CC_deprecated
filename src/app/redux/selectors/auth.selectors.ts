import { createSelector } from '@ngrx/store';

import { getAuthState } from '@redux/states/auth.state';

export const getProfile = createSelector(
    getAuthState,
    getAuthState => getAuthState.profile
);

export const getErrorLogin = createSelector(
    getAuthState,
    getAuthState => getAuthState.errorLogin
);

export const getErrorRegister = createSelector(
    getAuthState,
    getAuthState => getAuthState.errorRegister
);