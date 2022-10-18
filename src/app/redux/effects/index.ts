
import { AuthEffects } from './auth.effects';
import { CoordinatesEffects } from './coordinates.effects';
import { PuzzlesEffects } from './puzzles.effects';
import { UserPuzzlesEffects } from './user-puzzles.effects';

export const EFFECTS: any[] = [
    AuthEffects,
    CoordinatesEffects,
    PuzzlesEffects,
    UserPuzzlesEffects
];
