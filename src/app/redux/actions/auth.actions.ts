import { createAction, props } from '@ngrx/store';
import { Profile } from '@models/profile.model';

export const requestLoginGoogle = createAction(
    '[Auth] requestLoginGoogle'
);

export const requestLoginEmail = createAction(
    '[Auth] requestLoginEmail',
    props<{ email: string, password: string }>()
);

export const requestSingUpEmail = createAction(
    '[Auth] requestSingUpEmail',
    props<{ email: string, password: string, rePassword: string }>()
);

export const setErrorLogin = createAction(
    '[Auth] setErrorLogin',
    props<{ error: string }>()
);

export const setErrorRegister = createAction(
    '[Auth] setErrorRegister',
    props<{ error: string }>()
);

export const setProfile = createAction(
    '[Auth] setProfile',
    props<{ profile: Profile }>()
);

export const requestUpdateProfile = createAction(
    '[Auth] requestUpdateProfile',
    props<{ profile: Partial<Profile> }>()
);

export const logOut = createAction(
    '[Auth] logOut'
);