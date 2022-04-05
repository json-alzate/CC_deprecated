import { createAction, props } from '@ngrx/store';
import { Profile } from '@models/profile.model';

export const requestLoginGoogle = createAction(
    '[Auth] requestLoginGoogle'
);

export const requestLoginEmail = createAction(
    '[Auth] requestLoginEmail',
    props<{ email: string, password: string }>()
);

export const setProfile = createAction(
    '[Auth] setProfile',
    props<{ profile: Profile }>()
);

export const requestUpdateProfile = createAction(
    '[Auth] requestUpdateProfile',
    props<{ profile: Profile }>()
);

export const logOut = createAction(
    '[Auth] logOut'
);