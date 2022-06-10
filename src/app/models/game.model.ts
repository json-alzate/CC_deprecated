import { User } from '@models/user.model';
import { UserRequestToPlay } from '@models/sockets.model';

export interface move {
    from: number;
    to: number;
}

export interface Game {
    uid: string;
    playerBlack?: UserRequestToPlay;
    playerWhite?: UserRequestToPlay;
    uidUserWhite: string;
    uidUserBlack: string;
    createAt: number;
    moves: move[];
    movesFen: string[];
    movesHumanHistoryRow: string[]; // Ke2, Ke4, ...
    pgn: string;
    fen: string;
    timeControl: number;
    orientation: 'white' | 'black';
}
