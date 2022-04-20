import { createSelector } from '@ngrx/store';

import { getAuthState } from '@redux/reducers/app.reducers';

export const getProfile = createSelector(
    getAuthState,
    getAuthState => getAuthState.profile
);
