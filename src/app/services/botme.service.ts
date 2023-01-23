import { Injectable } from '@angular/core';

import Chess from 'chess.js';


@Injectable({
  providedIn: 'root'
})
export class BotmeService {

  games = [];
  playerName = 'Json_alzate';

  constructor() { }


  processPgnFile() {
    fetch('/assets/data/lichess_Json_alzate_2023-01-20.pgn')
      .then(response => response.text())
      .then(data => {
        // TODO: Esta regex no funciona bien, hay que arreglarla elimina [Event "Rated Blitz game"]\n[
        // por eso se adiciona nuevamente mas abajo
        const pgns = data.split(/\[Event ".*\n\[/);

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < pgns.length; i++) {

          if (pgns[i] === '') {
            continue;
          }
          const chess = new Chess();
          chess.load_pgn('[Event "Rated Blitz game"]\n[' + pgns[i]);
          const moves = [];

          const whitePlayer = pgns[i].match(/\[White "(.*)"\]/)[1];
          const blackPlayer = pgns[i].match(/\[Black "(.*)"\]/)[1];
          const result = pgns[i].match(/\[Result "(.*)"\]/)[1];

          // console.log('White player: ' + whitePlayer);
          // console.log('Black player: ' + blackPlayer);

          // eslint-disable-next-line @typescript-eslint/prefer-for-of
          for (let j = 0; j < chess.history().length; j++) {
            moves.push(chess.history()[j]);
          }
          this.games.push({ moves, result });
        }

        console.log('los juegos ', this.games);
      });
  }
}
