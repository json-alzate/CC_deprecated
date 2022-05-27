import { Profile } from '@models/profile.model';

export interface AuthState {
    profile: Profile | null;
    errorLogin: string | null;
    errorRegister: string | null;
}
