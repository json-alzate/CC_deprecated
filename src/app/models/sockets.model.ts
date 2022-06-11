export interface UserRequestToPlay {
    uidUser: string,
    name: string,
    time: number, // tiempo para el juego ejm: 10 minutes
    lang: string,
    elo: number,
    color: 'white' | 'black' | 'random',
    country: string, // 3 characters
    createAt: number
}


export interface Game {
    uid: string; //(auto generado)
    white: UserRequestToPlay;
    black: UserRequestToPlay;
    uidUserWhite: string;
    uidUserBlack: string;
    timeControl: number; // tiempo para el juego ejm: 10 minutes
    createAt: number;
}