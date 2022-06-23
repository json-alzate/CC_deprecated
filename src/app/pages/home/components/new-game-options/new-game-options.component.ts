// core and third party libraries
import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';

// rxjs

// states
import { CurrentGameState, StatusCurrentGame } from '@redux/states/current-game.state';

// actions
import { setStatusCurrentGame } from '@redux/actions/current-game.actions';

// selectors
import { getCurrentGameStatus } from '@redux/selectors/current-game.selectors';
import { getProfile } from '@redux/selectors/auth.selectors';

// models
import { UserRequestToPlay } from '@models/sockets.model';
import { Profile } from '@models/profile.model';

// services
import { SocketsService } from '@services/sockets.service';

// components


@Component({
  selector: 'app-new-game-options',
  templateUrl: './new-game-options.component.html',
  styleUrls: ['./new-game-options.component.scss'],
})
export class NewGameOptionsComponent implements OnInit {

  time = 10.0;
  color: 'random' | 'white' | 'black' = 'random';
  segment: 'game' | 'lobby' = 'game';
  searchingGame = false;

  requestGame: UserRequestToPlay;
  profile: Profile;

  constructor(
    private store: Store<CurrentGameState>,
    private socketsService: SocketsService,
    private translocoService: TranslocoService
  ) {

    this.store.pipe(select(getProfile)).subscribe(profile => {
      this.profile = profile;
    });

    this.store.pipe(select(getCurrentGameStatus)).subscribe(status => {
      if (status === 'loading') {
        this.searchingGame = true;
      } else {
        this.searchingGame = false;
      }
    });

  }

  ngOnInit() { }

  segmentChanged(event: any) {

  }

  /**
   * Se envía la solicitud de juego al servidor
   */
  onPlay() {

    const action = setStatusCurrentGame({ status: StatusCurrentGame.loading });
    this.store.dispatch(action);

    const requestGame: UserRequestToPlay = {
      uidUser: this.profile.uid,
      name: this.profile.name,
      timeIncrement: 0,
      time: this.time, // tiempo para el juego ejm: 10 minutes
      lang: this.translocoService.getActiveLang(),
      elo: this.profile.elo,
      color: this.color,
      country: this.profile.country,
      createAt: new Date().getTime()
    };

    console.log('requestGame', requestGame);

    this.socketsService.sendRequestNewGame(requestGame);


  }

  onCancel() {
    const action = setStatusCurrentGame({ status: null });
    this.store.dispatch(action);

    // TODO: se debe enviar la cancelación por un socket para que el servidor retire al usuario del bote
  }

}
