export interface User {
    uid: string;
    name: string;
    elo: number;
    country?: string;
    createAt: number;
    urlAvatar?: string;
}
