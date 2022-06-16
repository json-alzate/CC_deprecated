import { UserRequestToPlay } from '@models/sockets.model';

export interface Move {
    uid: string;
    uidGame: string;
    uidUser: string;
    from: string;
    to: string;
    fen: string;
    color: string;
    piece: string;
    sean: string;
    createAt: number;
}

export interface Game {
    uid: string;
    playerBlack?: UserRequestToPlay;
    playerWhite?: UserRequestToPlay;
    uidUserWhite: string;
    uidUserBlack: string;
    createAt: number;
    moves: Move[];
    movesFen: string[];
    movesHumanHistoryRow: string[]; // Ke2, Ke4, ...
    pgn: string;
    fen: string;
    timeControl: number;
    orientation: 'w' | 'b';
    uidCurrentUser?: string;
    status: 'playing' | 'finished';
    result?: '1-0' | '0-1' | '1/2-1/2' | '*';
    cancelReason?: string;
}
