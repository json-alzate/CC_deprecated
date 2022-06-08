import { User } from '@models/user.model';

export interface move {
    from: number;
    to: number;
}

export interface Game {
    uid: string;
    playerBlack?: User;
    playerWhite?: User;
    createAt: number;
    moves: move[];
    movesFen: string[];
    movesHumanHistoryRow: string[];
    pgn: string;
    timeEvent: string;
}
