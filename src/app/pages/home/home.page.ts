// core and third party libraries
import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { ModalController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';
import Chess from 'chess.js';
import { createUid } from '@utils/create-uid';
// rxjs

// states
import { CurrentGameState, getCurrentGameState } from '@redux/states/current-game.state';

// actions

// selectors
import { getProfile } from '@redux/selectors/auth.selectors';
import { getMovesByGame } from '@redux/selectors/moves.selectors';

// models
import { Profile } from '@models/profile.model';
import { Game, Move } from '@models/game.model';


// services
import { SocketsService } from '@services/sockets.service';

// components


import {
  COLOR,
  INPUT_EVENT_TYPE,
  MOVE_INPUT_MODE,
  Chessboard
} from 'cm-chessboard/src/cm-chessboard/Chessboard.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  board;
  chessInstance = new Chess();

  currentGameState: CurrentGameState;

  usersTest = [
    {
      "uidUser": "Lorne_Neva",
      "time": 10,
      "lang": "en",
      "elo": 2101,
      "color": "black",
      "country": "United Kingdom"
    },
    {
      "uidUser": "Johna_Dituri",
      "time": 15,
      "lang": "pr",
      "elo": 996,
      "color": "white",
      "country": "Zambia"
    },
    {
      "uidUser": "Layla_Kendrick",
      "time": 10,
      "lang": "en",
      "elo": 1712,
      "color": "black",
      "country": "Puerto Rico"
    },
    {
      "uidUser": "Vere_Kravits",
      "time": 5,
      "lang": "pr",
      "elo": 1936,
      "color": "white",
      "country": "Guernsey"
    },
    {
      "uidUser": "Kassey_Kirbee",
      "time": 5,
      "lang": "es",
      "elo": 2352,
      "color": "black",
      "country": "Colombia"
    },
    {
      "uidUser": "Ann-Marie_Woodberry",
      "time": 5,
      "lang": "pr",
      "elo": 1166,
      "color": "white",
      "country": "Cook Islands"
    },
    {
      "uidUser": "Margalo_Yam",
      "time": 15,
      "lang": "en",
      "elo": 2017,
      "color": "white",
      "country": "Palestinian Territory, Occupied"
    },
    {
      "uidUser": "Atlanta_Barbey",
      "time": 15,
      "lang": "pr",
      "elo": 1130,
      "color": "random",
      "country": "Kuwait"
    },
    {
      "uidUser": "Dorothy_Helfand",
      "time": 5,
      "lang": "es",
      "elo": 1590,
      "color": "white",
      "country": "French Guiana"
    },
    {
      "uidUser": "Celene_Ranjiv",
      "time": 10,
      "lang": "en",
      "elo": 2215,
      "color": "black",
      "country": "United States"
    },
    {
      "uidUser": "Shell_Fosque",
      "time": 10,
      "lang": "es",
      "elo": 2038,
      "color": "black",
      "country": "Morocco"
    },
    {
      "uidUser": "Glenda_Denis",
      "time": 10,
      "lang": "es",
      "elo": 1799,
      "color": "white",
      "country": "Malawi"
    },
    {
      "uidUser": "Nita_Matthew",
      "time": 10,
      "lang": "es",
      "elo": 1151,
      "color": "black",
      "country": "Ecuador"
    },
    {
      "uidUser": "Mamie_Thilda",
      "time": 15,
      "lang": "es",
      "elo": 2030,
      "color": "random",
      "country": "Haiti"
    },
    {
      "uidUser": "Cindelyn_Ackerley",
      "time": 10,
      "lang": "es",
      "elo": 1331,
      "color": "random",
      "country": "Eritrea"
    },
    {
      "uidUser": "Estell_Jaylene",
      "time": 5,
      "lang": "es",
      "elo": 1110,
      "color": "white",
      "country": "Korea, Democratic People\"S Republic of"
    },
    {
      "uidUser": "Odessa_Toffic",
      "time": 15,
      "lang": "pr",
      "elo": 1022,
      "color": "white",
      "country": "Tonga"
    },
    {
      "uidUser": "Maud_Skell",
      "time": 5,
      "lang": "pr",
      "elo": 2297,
      "color": "random",
      "country": "Gabon"
    },
    {
      "uidUser": "Ivett_Holbrook",
      "time": 15,
      "lang": "es",
      "elo": 1768,
      "color": "white",
      "country": "Philippines"
    },
    {
      "uidUser": "Sibella_Rhu",
      "time": 5,
      "lang": "es",
      "elo": 1643,
      "color": "white",
      "country": "Guatemala"
    },
    {
      "uidUser": "Darci_Tristram",
      "time": 15,
      "lang": "pr",
      "elo": 2253,
      "color": "random",
      "country": "Netherlands"
    },
    {
      "uidUser": "Lorenza_Grosz",
      "time": 15,
      "lang": "en",
      "elo": 932,
      "color": "black",
      "country": "Sudan"
    },
    {
      "uidUser": "Carree_Seagraves",
      "time": 15,
      "lang": "es",
      "elo": 1985,
      "color": "white",
      "country": "China"
    },
    {
      "uidUser": "Leanna_Girardo",
      "time": 5,
      "lang": "pr",
      "elo": 2398,
      "color": "black",
      "country": "Iraq"
    },
    {
      "uidUser": "Abbie_Allare",
      "time": 5,
      "lang": "es",
      "elo": 908,
      "color": "black",
      "country": "Kenya"
    },
    {
      "uidUser": "Donnie_Raimondo",
      "time": 10,
      "lang": "en",
      "elo": 1228,
      "color": "white",
      "country": "Uruguay"
    },
    {
      "uidUser": "Hildegaard_Olnee",
      "time": 15,
      "lang": "en",
      "elo": 1080,
      "color": "white",
      "country": "Togo"
    },
    {
      "uidUser": "Ottilie_Hebner",
      "time": 10,
      "lang": "pr",
      "elo": 2158,
      "color": "random",
      "country": "Tajikistan"
    },
    {
      "uidUser": "Janis_Halla",
      "time": 10,
      "lang": "pr",
      "elo": 1316,
      "color": "random",
      "country": "Saint Kitts and Nevis"
    },
    {
      "uidUser": "Melodie_Oscar",
      "time": 15,
      "lang": "es",
      "elo": 1056,
      "color": "black",
      "country": "Equatorial Guinea"
    },
    {
      "uidUser": "Grier_Papageno",
      "time": 15,
      "lang": "es",
      "elo": 2471,
      "color": "random",
      "country": "Guinea-Bissau"
    },
    {
      "uidUser": "Almeta_Brittani",
      "time": 15,
      "lang": "pr",
      "elo": 2306,
      "color": "white",
      "country": "Guadeloupe"
    },
    {
      "uidUser": "Vivia_Verger",
      "time": 10,
      "lang": "es",
      "elo": 2115,
      "color": "white",
      "country": "Afghanistan"
    },
    {
      "uidUser": "Lacie_Afton",
      "time": 15,
      "lang": "pr",
      "elo": 1984,
      "color": "random",
      "country": "Madagascar"
    },
    {
      "uidUser": "Fanny_Gaspard",
      "time": 10,
      "lang": "en",
      "elo": 1097,
      "color": "black",
      "country": "Cote D\"Ivoire"
    },
    {
      "uidUser": "Susan_Sigfrid",
      "time": 5,
      "lang": "pr",
      "elo": 2121,
      "color": "random",
      "country": "Malta"
    },
    {
      "uidUser": "Karolina_Bearnard",
      "time": 15,
      "lang": "en",
      "elo": 1276,
      "color": "black",
      "country": "Faroe Islands"
    },
    {
      "uidUser": "Kara-Lynn_Bari",
      "time": 15,
      "lang": "en",
      "elo": 1621,
      "color": "white",
      "country": "Niue"
    },
    {
      "uidUser": "Meriel_Letsou",
      "time": 10,
      "lang": "en",
      "elo": 1114,
      "color": "random",
      "country": "Yemen"
    },
    {
      "uidUser": "Tracey_Moina",
      "time": 5,
      "lang": "en",
      "elo": 2623,
      "color": "black",
      "country": "Niue"
    },
    {
      "uidUser": "Robinia_Peg",
      "time": 10,
      "lang": "es",
      "elo": 1661,
      "color": "black",
      "country": "Algeria"
    },
    {
      "uidUser": "Fredericka_Shields",
      "time": 5,
      "lang": "en",
      "elo": 1600,
      "color": "white",
      "country": "Greece"
    },
    {
      "uidUser": "Alisha_Letsou",
      "time": 15,
      "lang": "en",
      "elo": 1730,
      "color": "white",
      "country": "French Guiana"
    },
    {
      "uidUser": "Latisha_Seessel",
      "time": 15,
      "lang": "es",
      "elo": 2402,
      "color": "random",
      "country": "Sweden"
    },
    {
      "uidUser": "Winifred_Han",
      "time": 10,
      "lang": "en",
      "elo": 1131,
      "color": "white",
      "country": "Comoros"
    },
    {
      "uidUser": "Eve_Cecile",
      "time": 5,
      "lang": "pr",
      "elo": 1363,
      "color": "white",
      "country": "Costa Rica"
    },
    {
      "uidUser": "Madelle_Isidore",
      "time": 10,
      "lang": "es",
      "elo": 1286,
      "color": "random",
      "country": "Costa Rica"
    },
    {
      "uidUser": "Briney_Merna",
      "time": 15,
      "lang": "pr",
      "elo": 2388,
      "color": "white",
      "country": "Lao People\"S Democratic Republic"
    },
    {
      "uidUser": "Amii_Isacco",
      "time": 5,
      "lang": "en",
      "elo": 1355,
      "color": "white",
      "country": "Madagascar"
    },
    {
      "uidUser": "Melodie_Morehouse",
      "time": 15,
      "lang": "en",
      "elo": 2394,
      "color": "white",
      "country": "Bangladesh"
    },
    {
      "uidUser": "Kayla_Demitria",
      "time": 15,
      "lang": "pr",
      "elo": 2696,
      "color": "random",
      "country": "Mayotte"
    },
    {
      "uidUser": "Gertrud_Graig",
      "time": 10,
      "lang": "es",
      "elo": 2586,
      "color": "black",
      "country": "Belize"
    },
    {
      "uidUser": "Laure_Tamar",
      "time": 15,
      "lang": "es",
      "elo": 2179,
      "color": "black",
      "country": "Saint Pierre and Miquelon"
    },
    {
      "uidUser": "Xylina_Ahab",
      "time": 15,
      "lang": "es",
      "elo": 2060,
      "color": "white",
      "country": "Myanmar"
    },
    {
      "uidUser": "Jaclyn_Hirsch",
      "time": 5,
      "lang": "es",
      "elo": 1427,
      "color": "white",
      "country": "Ethiopia"
    },
    {
      "uidUser": "Georgetta_Gahl",
      "time": 5,
      "lang": "es",
      "elo": 1111,
      "color": "black",
      "country": "Sweden"
    },
    {
      "uidUser": "Celisse_Croix",
      "time": 5,
      "lang": "en",
      "elo": 1518,
      "color": "white",
      "country": "Saint Helena"
    },
    {
      "uidUser": "Collen_Peti",
      "time": 15,
      "lang": "en",
      "elo": 1776,
      "color": "random",
      "country": "Eritrea"
    },
    {
      "uidUser": "Lilith_Hunfredo",
      "time": 5,
      "lang": "es",
      "elo": 1372,
      "color": "black",
      "country": "Nicaragua"
    },
    {
      "uidUser": "Phedra_Kevon",
      "time": 5,
      "lang": "en",
      "elo": 2337,
      "color": "white",
      "country": "Saint Lucia"
    },
    {
      "uidUser": "Eadie_Eachern",
      "time": 15,
      "lang": "en",
      "elo": 2242,
      "color": "random",
      "country": "Virgin Islands, U.S."
    },
    {
      "uidUser": "Farrah_Kazimir",
      "time": 15,
      "lang": "en",
      "elo": 1450,
      "color": "black",
      "country": "Korea, Republic of"
    },
    {
      "uidUser": "Albertina_Francyne",
      "time": 15,
      "lang": "es",
      "elo": 1082,
      "color": "random",
      "country": "Lebanon"
    },
    {
      "uidUser": "Monika_Travax",
      "time": 5,
      "lang": "es",
      "elo": 2281,
      "color": "white",
      "country": "Libyan Arab Jamahiriya"
    },
    {
      "uidUser": "Ashlee_Marlie",
      "time": 10,
      "lang": "es",
      "elo": 2258,
      "color": "black",
      "country": "Holy See (Vatican City State)"
    },
    {
      "uidUser": "Thalia_Leonard",
      "time": 10,
      "lang": "es",
      "elo": 964,
      "color": "white",
      "country": "Christmas Island"
    },
    {
      "uidUser": "Kayla_Jess",
      "time": 15,
      "lang": "en",
      "elo": 1335,
      "color": "random",
      "country": "Suriname"
    },
    {
      "uidUser": "Carmencita_Concha",
      "time": 5,
      "lang": "es",
      "elo": 1155,
      "color": "white",
      "country": "Hong Kong"
    },
    {
      "uidUser": "Brynna_Harriman",
      "time": 5,
      "lang": "pr",
      "elo": 1622,
      "color": "random",
      "country": "Israel"
    },
    {
      "uidUser": "Cristine_Schenck",
      "time": 10,
      "lang": "en",
      "elo": 1321,
      "color": "black",
      "country": "Belgium"
    },
    {
      "uidUser": "Aubrie_Bettine",
      "time": 5,
      "lang": "pr",
      "elo": 2219,
      "color": "black",
      "country": "Latvia"
    },
    {
      "uidUser": "Ebonee_Durware",
      "time": 10,
      "lang": "pr",
      "elo": 1892,
      "color": "black",
      "country": "Germany"
    },
    {
      "uidUser": "Chandra_Prouty",
      "time": 15,
      "lang": "es",
      "elo": 1386,
      "color": "random",
      "country": "Saint Lucia"
    },
    {
      "uidUser": "Cathie_Prober",
      "time": 10,
      "lang": "pr",
      "elo": 2246,
      "color": "black",
      "country": "Madagascar"
    },
    {
      "uidUser": "Lynnea_Tyson",
      "time": 10,
      "lang": "es",
      "elo": 2166,
      "color": "random",
      "country": "French Southern Territories"
    },
    {
      "uidUser": "Shandie_Wenoa",
      "time": 10,
      "lang": "es",
      "elo": 2778,
      "color": "black",
      "country": "Morocco"
    },
    {
      "uidUser": "Constance_Frendel",
      "time": 5,
      "lang": "pr",
      "elo": 1620,
      "color": "white",
      "country": "Qatar"
    },
    {
      "uidUser": "Dolli_Erich",
      "time": 10,
      "lang": "en",
      "elo": 1631,
      "color": "random",
      "country": "Nauru"
    },
    {
      "uidUser": "Meriel_Klotz",
      "time": 5,
      "lang": "pr",
      "elo": 1142,
      "color": "random",
      "country": "Serbia and Montenegro"
    },
    {
      "uidUser": "Dacia_Shelba",
      "time": 15,
      "lang": "pr",
      "elo": 2301,
      "color": "white",
      "country": "Lesotho"
    },
    {
      "uidUser": "Hettie_Tannie",
      "time": 10,
      "lang": "en",
      "elo": 1382,
      "color": "black",
      "country": "United Arab Emirates"
    },
    {
      "uidUser": "Wanda_Karna",
      "time": 5,
      "lang": "en",
      "elo": 1802,
      "color": "black",
      "country": "Mayotte"
    },
    {
      "uidUser": "Jordan_Iaverne",
      "time": 10,
      "lang": "es",
      "elo": 1795,
      "color": "white",
      "country": "Nicaragua"
    },
    {
      "uidUser": "Mara_Flyn",
      "time": 5,
      "lang": "es",
      "elo": 904,
      "color": "black",
      "country": "Japan"
    },
    {
      "uidUser": "Theodora_Barbey",
      "time": 15,
      "lang": "es",
      "elo": 1891,
      "color": "white",
      "country": "Pakistan"
    },
    {
      "uidUser": "Agathe_Rudolph",
      "time": 15,
      "lang": "es",
      "elo": 1083,
      "color": "random",
      "country": "Saudi Arabia"
    },
    {
      "uidUser": "Penelopa_Wilkinson",
      "time": 10,
      "lang": "es",
      "elo": 1951,
      "color": "random",
      "country": "Cyprus"
    },
    {
      "uidUser": "Althea_Zamora",
      "time": 5,
      "lang": "pr",
      "elo": 1861,
      "color": "random",
      "country": "Bulgaria"
    },
    {
      "uidUser": "Nita_Sabella",
      "time": 5,
      "lang": "es",
      "elo": 2046,
      "color": "black",
      "country": "Turkey"
    },
    {
      "uidUser": "Beth_Tengdin",
      "time": 15,
      "lang": "es",
      "elo": 1946,
      "color": "white",
      "country": "Virgin Islands, U.S."
    },
    {
      "uidUser": "Basia_Colleen",
      "time": 15,
      "lang": "es",
      "elo": 1075,
      "color": "white",
      "country": "Cambodia"
    },
    {
      "uidUser": "Xylina_Ailyn",
      "time": 5,
      "lang": "es",
      "elo": 2465,
      "color": "random",
      "country": "Viet Nam"
    },
    {
      "uidUser": "Ariela_Pond",
      "time": 15,
      "lang": "es",
      "elo": 2380,
      "color": "white",
      "country": "Lithuania"
    },
    {
      "uidUser": "Anica_Peonir",
      "time": 15,
      "lang": "pr",
      "elo": 2674,
      "color": "random",
      "country": "Kazakhstan"
    },
    {
      "uidUser": "Gusella_Docilla",
      "time": 10,
      "lang": "en",
      "elo": 1616,
      "color": "white",
      "country": "Dominica"
    },
    {
      "uidUser": "Gabriellia_Chem",
      "time": 15,
      "lang": "en",
      "elo": 2393,
      "color": "white",
      "country": "Lebanon"
    },
    {
      "uidUser": "Paola_Ariella",
      "time": 10,
      "lang": "pr",
      "elo": 2249,
      "color": "white",
      "country": "Tanzania, United Republic of"
    },
    {
      "uidUser": "Ethel_Kylander",
      "time": 15,
      "lang": "en",
      "elo": 1183,
      "color": "random",
      "country": "Nauru"
    },
    {
      "uidUser": "Clary_Constancy",
      "time": 15,
      "lang": "en",
      "elo": 2503,
      "color": "black",
      "country": "French Southern Territories"
    },
    {
      "uidUser": "Averyl_Sisile",
      "time": 10,
      "lang": "es",
      "elo": 2011,
      "color": "white",
      "country": "Congo"
    }
  ];

  profile: Profile;

  showCountDown = true;
  currentGame: Game;

  constructor(
    private modalController: ModalController,
    private socketsService: SocketsService,
    private store: Store<CurrentGameState>,
    private socket: Socket
  ) {
    // TODO: Activar lsitener socket
    // this.socket.fromEvent('ping').subscribe((game: any) => {
    //   console.log(game, 'game');

    // });
    // this.socket.fromEvent('pong').subscribe((game: any) => {
    //   console.log(game, 'pong');

    // });
    // this.socket.on("connect", () => {
    //   console.log('socket conectado');

    // });

    // this.socket.on('ping', (data) => {
    //   console.log('pong', data);
    // });

    this.store.pipe(select(getProfile)).subscribe((profile: Profile) => {
      this.profile = profile;
    });

    this.socketsService.listenMatchGame();
    this.listenMove();

  }

  ngOnInit() {
    this.store.pipe(select(getCurrentGameState)).subscribe(currentGameState => {
      this.currentGameState = currentGameState;
      this.currentGame = currentGameState?.game;
      if (currentGameState?.game) {
        this.setPosition(currentGameState.game?.fen);
        this.changeOrientation(currentGameState.game?.orientation);
        this.listenMovesCurrentGame();
      }
    });
  }

  ionViewDidEnter() {
    this.loadBoard();
  }

  async loadBoard() {
    this.board = await new Chessboard(document.getElementById('board1'), {
      position: 'empty',
      style: {},
      sprite: { url: '/assets/images/chessboard-sprite-staunty.svg' }
    });


    this.board.enableMoveInput((event) => {
      // handle user input here
      switch (event.type) {
        case INPUT_EVENT_TYPE.moveStart:
          // console.log(`moveStart: ${event.square}`);
          // return `true`, if input is accepted/valid, `false` aborts the interaction, the piece will not move
          return true;
        case INPUT_EVENT_TYPE.moveDone:

          const objectMove = { from: event.squareFrom, to: event.squareTo };
          const theMove = this.chessInstance.move(objectMove);
          if (theMove) {

            const newMoveToSend: Move = {
              uid: createUid(),
              uidGame: this.currentGameState.game.uid,
              uidUser: this.profile.uid,
              from: event.squareFrom,
              to: event.squareTo,
              fen: this.chessInstance.fen(),
              color: theMove.color,
              piece: theMove.piece,
              sean: theMove.san,
              createAt: new Date().getTime()

            };
            console.log('newMoveToSend ', newMoveToSend);

            this.socketsService.sendMove(newMoveToSend);

          }
          // return true, if input is accepted/valid, `false` takes the move back
          return theMove;
        case INPUT_EVENT_TYPE.moveCanceled:
          console.log('moveCanceled ', this.chessInstance.pgn());
      }
    });


  }


  setPosition(fen: string) {
    this.board.setPosition(fen);
  }

  listenMovesCurrentGame() {
    this.store.pipe(select(getMovesByGame(this.currentGame.uid))).subscribe((moves: Move[]) => {
      if (moves.length >= 2) {
        this.showCountDown = false;
      }
    });
  }

  /**
   * Listen moves from socket
   */
  listenMove() {
    this.socket.fromEvent('4_out_game_move').subscribe((move: Move) => {
      console.log('move', move);
      if (move.uidGame === this.currentGameState.game.uid) {
        this.chessInstance.move(move);
        this.board.setPosition(this.chessInstance.fen());
      }
    });
  }


  changeOrientation(orientation?: 'w' | 'b') {

    if (orientation) {
      this.board.setOrientation(orientation);
    } else {
      this.board.setOrientation(this.board.getOrientation() === 'w' ? 'b' : 'w');
    }

  }



}
