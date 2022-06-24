import { NewGameOptionsComponent } from './new-game-options/new-game-options.component';
import { PlayerComponent } from './player/player.component';
import { ClockComponent } from './clock/clock.component';
import { ClockCountdownInitialComponent } from './clock-countdown-initial/clock-countdown-initial.component';
import { EndGameComponent } from './end-game/end-game.component';

export const COMPONENTS = [
    NewGameOptionsComponent,
    PlayerComponent,
    ClockComponent,
    ClockCountdownInitialComponent,
    EndGameComponent
];

export const ENTRY_COMPONENTS: any[] = [
    NewGameOptionsComponent
];
