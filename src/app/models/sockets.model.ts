export interface RequestNewGame {
    uidUser: string,
    time: number, // tiempo para el juego ejm: 10 minutes
    lang: string,
    elo: number,
    color: 'white' | 'black' | 'random',
    country: string,
    createAt: number
}