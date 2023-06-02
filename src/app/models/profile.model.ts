import { User } from './user.model';

export interface Profile extends User {
    email: string;
    lang: string;
}
