import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';

import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Funcionalidad: que al mostrar la solución lo haga que cada jugada deje flechas,  después
 * las piezas se disuelvan y queden las flechas en un efecto de fade out dramático
 * para que se evidencie el patron con las flechas
 * */

// models
import { Puzzle } from '@models/puzzle.model';
import { UserPuzzle } from '@models/user-puzzles.model';
import { Plan, Block } from '@models/plan.model';

// Services
import { PlanService } from '@services/plan.service';
import { ProfileService } from '@services/profile.service';
import { AppService } from '@services/app.service';
import { SoundsService } from '@services/sounds.service';

// utils
import { createUid } from '@utils/create-uid';

// components
import { BlockPresentationComponent } from '@pages/puzzles/components/block-presentation/block-presentation.component';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss'],
})
export class TrainingComponent implements OnInit {

  //ui
  showBlockTimer = false;

  currentIndexBlock = -1; // -1 para que al iniciar se seleccione el primer bloque sumando ++ y queda en 0
  plan: Plan = {
    uid: 'qpdtwqn3k4p9tppqy7ogs',
    blocks: [
      {
        time: 5,
        puzzlesCount: 0,
        themes: [
          'mateIn1'
        ],
        eloStart: 200,
        eloEnd: 1000,
        color: 'white',
        puzzleTimes: {
          warningOn: 6,
          dangerOn: 3,
          total: 10
        },
        puzzlesPlayed: [],
        nextPuzzleImmediately: true,
        puzzles: [
          {
            popularity: 100,
            moves: 'b7d5 h3f1',
            randomNumberQuery: 7059,
            fen: '5rk1/pQ3ppp/8/3p4/3P1p2/P3P2q/1P3P1P/5R1K w - - 5 26',
            uid: 'CGsxk',
            gameUrl: 'https://lichess.org/YfDRpaq0#51',
            openingFamily: '\r',
            rating: 723,
            themes: [
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            ratingDeviation: 78,
            openingVariation: '',
            nbPlays: 395
          },
          {
            uid: 'DZhBc',
            fen: 'r7/8/8/4PkpK/8/6P1/P3R2P/8 w - - 3 42',
            nbPlays: 40,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove',
              'rookEndgame'
            ],
            moves: 'e5e6 a8h8',
            popularity: 82,
            randomNumberQuery: 7063,
            gameUrl: 'https://lichess.org/9BpeTabj#83',
            rating: 885,
            openingVariation: '',
            ratingDeviation: 86,
            openingFamily: '\r'
          },
          {
            gameUrl: 'https://lichess.org/fa9w5MPk#65',
            ratingDeviation: 94,
            rating: 704,
            fen: 'b7/p1k3r1/1p6/8/PPP5/4p1r1/4RRB1/5K2 w - - 0 33',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            uid: '0Fj2H',
            openingFamily: '\r',
            openingVariation: '',
            moves: 'g2a8 g3g1',
            popularity: 88,
            nbPlays: 590,
            randomNumberQuery: 7071
          },
          {
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingFamily: '\r',
            ratingDeviation: 132,
            randomNumberQuery: 7073,
            fen: '6k1/pp1P2bp/6p1/4p3/4Pp2/P2Q1P1q/1rr3P1/5RRK w - - 0 34',
            rating: 797,
            moves: 'g2h3 c2h2',
            popularity: 67,
            gameUrl: 'https://lichess.org/e7iq88ki#67',
            openingVariation: '',
            nbPlays: 42,
            uid: 'DiDS1'
          },
          {
            rating: 829,
            themes: [
              'backRankMate',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingVariation: 'Scotch_Game_Classical_Variation\r',
            openingFamily: 'Scotch_Game',
            randomNumberQuery: 7074,
            uid: '05US6',
            moves: 'e2f2 d8d1',
            ratingDeviation: 77,
            popularity: 96,
            fen: '2kr3B/ppp2p1p/8/5bq1/4p3/8/PPP1QbPP/RK3B1R w - - 4 15',
            gameUrl: 'https://lichess.org/0Jfj3P2G#29',
            nbPlays: 241
          },
          {
            fen: '5r1k/1pp4p/p1b4r/4q2B/2P1p1Q1/1P2Pp2/P2P3P/2R3RK w - - 4 25',
            ratingDeviation: 84,
            openingVariation: '',
            uid: 'DbZnd',
            gameUrl: 'https://lichess.org/Q6DLZvGn#49',
            moves: 'h5f7 e5h2',
            rating: 876,
            openingFamily: '\r',
            popularity: 96,
            nbPlays: 925,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            randomNumberQuery: 7077
          },
          {
            gameUrl: 'https://lichess.org/THMnYQqA#37',
            rating: 981,
            nbPlays: 242,
            popularity: 84,
            openingVariation: 'Nimzo-Larsen_Attack_Indian_Variation\r',
            fen: 'r4rk1/ppb2ppp/2pq4/3P4/8/1P2Pb1P/PB2QP2/R4RK1 w - - 0 19',
            moves: 'e2f3 d6h2',
            uid: 'DWjcq',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            ratingDeviation: 83,
            openingFamily: 'Nimzo-Larsen_Attack',
            randomNumberQuery: 7079
          },
          {
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            rating: 668,
            fen: '3r1rk1/pp2b1pp/4b3/8/2pNP3/P3pP2/1P4PP/RN4KR w - - 1 21',
            openingFamily: '\r',
            nbPlays: 391,
            randomNumberQuery: 7080,
            ratingDeviation: 90,
            moves: 'd4e6 d8d1',
            openingVariation: '',
            popularity: 96,
            uid: '1ZF4E',
            gameUrl: 'https://lichess.org/pXIAoqHS#41'
          },
          {
            fen: '3Rb1k1/Q3bppp/8/2p5/4N3/5P2/P1P3PP/2q4K w - - 1 27',
            gameUrl: 'https://lichess.org/pwMMb3QY#53',
            themes: [
              'backRankMate',
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            rating: 722,
            randomNumberQuery: 7087,
            openingFamily: '\r',
            uid: '0GhJL',
            nbPlays: 60,
            ratingDeviation: 94,
            moves: 'd8d1 c1d1',
            popularity: 65,
            openingVariation: ''
          },
          {
            uid: 'DWr2n',
            openingVariation: '',
            fen: '2r5/1R1nk1pp/3bpp2/1N6/8/1P2B2P/1P3PP1/6K1 w - - 2 22',
            gameUrl: 'https://lichess.org/qY0zXHnB#43',
            moves: 'e3d4 c8c1',
            ratingDeviation: 80,
            randomNumberQuery: 7090,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingFamily: '\r',
            popularity: 96,
            nbPlays: 646,
            rating: 752
          },
          {
            moves: 'e6f8 c6g2',
            gameUrl: 'https://lichess.org/EEJPYvdD#31',
            uid: '0AqUk',
            rating: 832,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingFamily: 'Sicilian_Defense',
            fen: 'r4rk1/1b1nb1pp/ppq1Nn2/8/P7/1P6/1BPN1PPP/R2Q1RK1 w - - 1 16',
            popularity: 100,
            ratingDeviation: 152,
            randomNumberQuery: 7093,
            openingVariation: 'Sicilian_Defense_Snyder_Variation\r',
            nbPlays: 36
          },
          {
            openingVariation: '',
            ratingDeviation: 96,
            rating: 813,
            uid: 'DLpUG',
            randomNumberQuery: 7095,
            moves: 'd1e1 h4e1',
            gameUrl: 'https://lichess.org/GkzlqCLX#55',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            popularity: 71,
            openingFamily: '\r',
            nbPlays: 114,
            fen: '8/p4pkp/1pp3p1/3p4/P6q/1P6/2Q3PP/3Rr1K1 w - - 1 28'
          },
          {
            ratingDeviation: 77,
            popularity: 100,
            gameUrl: 'https://lichess.org/Jpnr4Dg2#47',
            fen: 'r4b1r/3k1p2/3p1p1p/q2PpN2/5P2/1P6/p1P1Q1PP/1K1RR3 w - - 0 24',
            openingVariation: '',
            uid: '2I992',
            randomNumberQuery: 7098,
            moves: 'b1a1 a5c3',
            openingFamily: '\r',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            rating: 970,
            nbPlays: 304
          },
          {
            moves: 'e5h5 b4e1',
            openingVariation: '',
            popularity: 100,
            fen: '1r3rk1/p4ppp/8/3BR3/1q1p1Q2/3P2Pb/PP3P1P/R1B3K1 w - - 3 22',
            gameUrl: 'https://lichess.org/p0yV0Lwp#43',
            uid: 'C87aD',
            openingFamily: '\r',
            randomNumberQuery: 7113,
            nbPlays: 234,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            rating: 651,
            ratingDeviation: 83
          },
          {
            moves: 'e8c8 c3e1',
            openingFamily: '\r',
            ratingDeviation: 78,
            openingVariation: '',
            rating: 887,
            uid: '0Z6Pv',
            popularity: 97,
            themes: [
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            nbPlays: 268,
            fen: '2r1Rrk1/3Q1pp1/p6p/8/3p4/2q5/P4PPP/4R1K1 w - - 2 31',
            randomNumberQuery: 7114,
            gameUrl: 'https://lichess.org/uLCMq2q9#61'
          },
          {
            randomNumberQuery: 7118,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingVariation: '',
            rating: 657,
            popularity: 50,
            gameUrl: 'https://lichess.org/KKzR8PIT#41',
            fen: 'r3r1k1/pb1p1pp1/2pP4/qp2P1Q1/5P2/P4R2/6PP/RNB3K1 w - - 2 21',
            ratingDeviation: 85,
            nbPlays: 79,
            uid: '26pVZ',
            moves: 'f3g3 a5e1',
            openingFamily: '\r'
          },
          {
            fen: '5r1k/6pp/4p3/4p3/1Q6/4b3/3R2PP/3R1q1K w - - 2 35',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            rating: 873,
            openingFamily: '\r',
            moves: 'd1f1 f8f1',
            nbPlays: 49,
            gameUrl: 'https://lichess.org/4kqTQChh#69',
            popularity: 68,
            randomNumberQuery: 7120,
            ratingDeviation: 89,
            openingVariation: '',
            uid: '1iDUy'
          },
          {
            rating: 911,
            openingFamily: 'French_Defense',
            ratingDeviation: 96,
            randomNumberQuery: 7122,
            popularity: 93,
            gameUrl: 'https://lichess.org/BS2ugifE#25',
            nbPlays: 160,
            uid: '1fCyu',
            fen: 'rnb2rk1/ppq2ppp/8/2b5/2BN2n1/1QN1B3/PP3PPP/R4RK1 w - - 5 13',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            moves: 'c3d5 c7h2',
            openingVariation: 'French_Defense_Exchange_Variation\r'
          },
          {
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            moves: 'd1d8 b4e1',
            popularity: 43,
            uid: 'C9XVU',
            rating: 843,
            randomNumberQuery: 7125,
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/MaS22Z5Y#55',
            ratingDeviation: 102,
            nbPlays: 66,
            fen: 'r1b2Rnk/5pp1/p3pn1p/2p5/BqP5/4P1B1/P1Q2PPP/3R2K1 w - - 2 28',
            openingVariation: ''
          },
          {
            openingFamily: '\r',
            nbPlays: 471,
            popularity: 100,
            openingVariation: '',
            moves: 'g3h4 g8g1',
            randomNumberQuery: 7131,
            fen: '2k3r1/ppp1B2p/5n2/8/2P1p2r/4NnP1/P4P2/RN1Rb2K w - - 0 25',
            themes: [
              'arabianMate',
              'master',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            rating: 819,
            uid: '26jar',
            gameUrl: 'https://lichess.org/LrljbcVr#49',
            ratingDeviation: 76
          },
          {
            nbPlays: 42,
            gameUrl: 'https://lichess.org/OTXQeAQE#77',
            uid: 'D8OJu',
            openingFamily: '\r',
            moves: 'g7g5 h2h3',
            randomNumberQuery: 7134,
            fen: '8/1p3pQ1/1pp1kP2/8/6PK/3r3P/PP5r/8 w - - 7 39',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove',
              'queenRookEndgame'
            ],
            popularity: 67,
            ratingDeviation: 91,
            openingVariation: '',
            rating: 913
          },
          {
            ratingDeviation: 94,
            rating: 777,
            fen: 'r6r/3qkBpp/n1p2n2/1p2p1N1/pb2P1b1/P5QP/1PP2PP1/RNB1K2R w KQ - 1 17',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingFamily: 'Vant_Kruijs_Opening',
            openingVariation: 'Vant_Kruijs_Opening_Other_variations\r',
            gameUrl: 'https://lichess.org/DL0CYlL2#33',
            uid: '2ACx6',
            randomNumberQuery: 7138,
            popularity: 100,
            moves: 'a3b4 d7d1',
            nbPlays: 105
          },
          {
            ratingDeviation: 80,
            uid: 'CDKXd',
            openingFamily: '\r',
            moves: 'e1f1 h3f1',
            fen: '6k1/8/2p3p1/2Pp3p/1P1N2b1/P3b1Pq/1BR4P/4Qr1K w - - 6 28',
            themes: [
              'hangingPiece',
              'master',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            rating: 756,
            openingVariation: '',
            gameUrl: 'https://lichess.org/8x7qc6hg#55',
            popularity: 100,
            randomNumberQuery: 7139,
            nbPlays: 539
          },
          {
            themes: [
              'master',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            gameUrl: 'https://lichess.org/QOaI4wHI#39',
            nbPlays: 32,
            uid: '1WJog',
            popularity: 100,
            ratingDeviation: 180,
            openingVariation: '',
            moves: 'd1d6 a8g2',
            fen: 'qn3rk1/B4ppp/p2b4/8/8/2N3Pb/PP3P1P/R2Q1RK1 w - - 1 20',
            randomNumberQuery: 7142,
            openingFamily: '\r',
            rating: 968
          },
          {
            gameUrl: 'https://lichess.org/agdylV1Q#23',
            openingVariation: 'Czech_Defense_Other_variations\r',
            moves: 'e3c5 c7h2',
            randomNumberQuery: 7145,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'oneMove',
              'opening'
            ],
            openingFamily: 'Czech_Defense',
            popularity: 100,
            nbPlays: 69,
            fen: 'r1b1k2r/ppq2ppp/2p2n2/2b2N2/4P1n1/2NBB3/PPP3PP/R2Q1RK1 w kq - 5 12',
            rating: 915,
            ratingDeviation: 90,
            uid: 'Dmlod'
          },
          {
            uid: '27HWH',
            gameUrl: 'https://lichess.org/XYJk725R#77',
            popularity: 74,
            nbPlays: 68,
            ratingDeviation: 80,
            openingFamily: '\r',
            openingVariation: '',
            fen: '1k2r3/8/p1p4p/2R2P2/P4n2/8/1BR2Pr1/6K1 w - - 2 39',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            moves: 'g1h1 e8e1',
            randomNumberQuery: 7148,
            rating: 981
          },
          {
            gameUrl: 'https://lichess.org/H9dUNHhi#71',
            nbPlays: 34,
            rating: 965,
            randomNumberQuery: 7151,
            popularity: 100,
            openingVariation: '',
            moves: 'g3f3 d8d3',
            ratingDeviation: 170,
            openingFamily: '\r',
            fen: '3r4/R3bp2/4p1k1/4P1p1/1Pp1NnP1/5rK1/2R2P2/8 w - - 0 36',
            uid: '02vl0',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ]
          },
          {
            randomNumberQuery: 7154,
            popularity: 65,
            themes: [
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn1',
              'oneMove',
              'queenRookEndgame'
            ],
            openingFamily: '\r',
            uid: '2Q9vp',
            fen: '6k1/2p2p1p/6p1/2PP4/8/3p3P/P2R1PP1/q4K1R w - - 3 27',
            rating: 600,
            ratingDeviation: 96,
            nbPlays: 79,
            moves: 'd2d1 a1d1',
            gameUrl: 'https://lichess.org/TS8DRk0F#53',
            openingVariation: ''
          },
          {
            rating: 764,
            fen: 'B6k/R5p1/5n1p/3p4/1b1P1B2/8/P1b3PP/K7 w - - 1 39',
            randomNumberQuery: 7159,
            openingVariation: '',
            moves: 'f4e5 b4c3',
            uid: '1nwXs',
            ratingDeviation: 213,
            nbPlays: 7,
            themes: [
              'doubleBishopMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            gameUrl: 'https://lichess.org/PwfeZNIt#77',
            openingFamily: '\r',
            popularity: -60
          },
          {
            rating: 928,
            openingVariation: '',
            fen: '2kr4/1b5p/1p4r1/pPp5/P1Q2P2/5pP1/2N2P1q/R5RK w - - 0 28',
            nbPlays: 82,
            gameUrl: 'https://lichess.org/26xzT6XN#55',
            openingFamily: '\r',
            randomNumberQuery: 7160,
            popularity: 88,
            moves: 'h1h2 g6h6',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            ratingDeviation: 87,
            uid: '2TrNT'
          },
          {
            openingFamily: '\r',
            nbPlays: 135,
            ratingDeviation: 78,
            popularity: 83,
            fen: '8/5R1p/7k/5p1P/6K1/6P1/5r2/8 w - - 0 43',
            moves: 'g4h4 f2h2',
            openingVariation: '',
            rating: 865,
            uid: '0ZEc6',
            themes: [
              'endgame',
              'master',
              'mate',
              'mateIn1',
              'oneMove',
              'rookEndgame'
            ],
            randomNumberQuery: 7161,
            gameUrl: 'https://lichess.org/8nSmVyTW#85'
          },
          {
            popularity: 100,
            gameUrl: 'https://lichess.org/YOx8HkSv#47',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingFamily: '\r',
            openingVariation: '',
            fen: '6k1/p2b1rpp/1p1Bp3/3pP3/2qP4/2P5/P1Q3PP/1R4K1 w - - 0 24',
            randomNumberQuery: 7164,
            ratingDeviation: 167,
            rating: 930,
            uid: '0JEmw',
            moves: 'b1b4 f7f1',
            nbPlays: 38
          },
          {
            fen: 'r1b2rk1/1pp2pp1/p1p4p/8/4PP2/2NP3n/PPP3PP/1R1QR1qK w - - 6 18',
            rating: 736,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove',
              'smotheredMate'
            ],
            moves: 'e1g1 h3f2',
            ratingDeviation: 93,
            openingVariation: 'Four_Knights_Game_Spanish_Variation\r',
            randomNumberQuery: 7167,
            openingFamily: 'Four_Knights_Game',
            nbPlays: 133,
            popularity: 100,
            gameUrl: 'https://lichess.org/jqiB6jDv#35',
            uid: '1pPAd'
          },
          {
            popularity: 73,
            moves: 'c1d2 b5f1',
            rating: 760,
            randomNumberQuery: 7168,
            ratingDeviation: 150,
            gameUrl: 'https://lichess.org/mKSagIIe#51',
            themes: [
              'hangingPiece',
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            uid: '0ZyFi',
            openingFamily: '\r',
            nbPlays: 41,
            fen: 'r3r1k1/2p2p1p/1p4pB/1qpP4/p2bP3/5P2/PP1n2PP/1RQN1R1K w - - 14 26',
            openingVariation: ''
          },
          {
            ratingDeviation: 89,
            popularity: 100,
            gameUrl: 'https://lichess.org/MLJUlMpw#21',
            fen: '2kr1bnr/ppp2ppp/8/8/8/q4N2/bPPBPPPP/2KR1B1R w - - 0 11',
            openingVariation: 'Englund_Gambit_Other_variations\r',
            rating: 868,
            nbPlays: 87,
            randomNumberQuery: 7175,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove',
              'queensideAttack'
            ],
            uid: '01BKZ',
            openingFamily: 'Englund_Gambit',
            moves: 'b2a3 f8a3'
          },
          {
            fen: '3rk1nr/2p2ppp/p1p5/4p3/4P1b1/2P2N2/P1P2PPP/R1B1K2R w KQk - 0 11',
            openingVariation: 'Three_Knights_Opening_Other_variations\r',
            openingFamily: 'Three_Knights_Opening',
            randomNumberQuery: 7178,
            moves: 'f3e5 d8d1',
            popularity: 71,
            gameUrl: 'https://lichess.org/GNDYmWd3#21',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            uid: '2IMYm',
            rating: 711,
            nbPlays: 101,
            ratingDeviation: 99
          },
          {
            gameUrl: 'https://lichess.org/KxFym0tg#35',
            openingFamily: 'Indian_Defense',
            fen: 'r4rk1/1n1b1pp1/1p1qp2p/pP1p4/N2P2n1/P2BPN2/5PPP/2RQ1RK1 w - - 4 18',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            uid: '1c1ik',
            nbPlays: 126,
            openingVariation: 'Indian_Defense_Seirawan_Attack\r',
            moves: 'f3d2 d6h2',
            ratingDeviation: 86,
            rating: 839,
            randomNumberQuery: 7183,
            popularity: 100
          },
          {
            popularity: 77,
            gameUrl: 'https://lichess.org/HqsRMmvj#49',
            fen: '4r2k/5Qpp/p7/1p1B1p2/8/2P3bP/PP4P1/5qK1 w - - 0 25',
            nbPlays: 206,
            ratingDeviation: 90,
            openingFamily: '\r',
            moves: 'g1f1 e8e1',
            rating: 600,
            randomNumberQuery: 7196,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingVariation: '',
            uid: '219hV'
          },
          {
            openingFamily: '\r',
            uid: '1epzW',
            randomNumberQuery: 7201,
            fen: '7r/p2k1ppp/3Pp3/3p4/3N2PP/P1nPP3/5r2/K2R3R w - - 1 23',
            nbPlays: 692,
            rating: 807,
            gameUrl: 'https://lichess.org/ZDydHJS3#45',
            themes: [
              'arabianMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingVariation: '',
            popularity: 85,
            ratingDeviation: 89,
            moves: 'd1c1 f2a2'
          },
          {
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingVariation: 'French_Defense_Paulsen_Variation\r',
            moves: 'e5f6 c6g2',
            popularity: 86,
            uid: '1Tgbw',
            rating: 917,
            gameUrl: 'https://lichess.org/ukAAebEm#33',
            fen: '3r1rk1/pb2bpp1/1pq1pn1p/2p1B3/2PP4/P2B2N1/1P2QPPP/R2R2K1 w - - 1 17',
            randomNumberQuery: 7205,
            nbPlays: 81,
            ratingDeviation: 110,
            openingFamily: 'French_Defense'
          },
          {
            uid: '2EJla',
            rating: 695,
            openingVariation: '',
            ratingDeviation: 93,
            popularity: 82,
            gameUrl: 'https://lichess.org/5bYsJtFE#43',
            randomNumberQuery: 7210,
            openingFamily: '\r',
            moves: 'a5d5 e8e1',
            fen: '1n2q1k1/1b3p1p/2p3p1/Q2p4/B2N1Pn1/3P4/1PP3PP/2B3K1 w - - 3 22',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            nbPlays: 324
          },
          {
            fen: 'r3rk2/ppp2p1p/3p1B2/4pQ2/1bB5/3P4/P1q1KPPP/3R3R w - - 0 21',
            ratingDeviation: 97,
            nbPlays: 497,
            moves: 'e2f1 c2d1',
            popularity: 81,
            gameUrl: 'https://lichess.org/uHBlRexs#41',
            uid: '1ZINK',
            openingVariation: '',
            rating: 618,
            openingFamily: '\r',
            randomNumberQuery: 7233,
            themes: [
              'hangingPiece',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ]
          },
          {
            nbPlays: 45,
            themes: [
              'endgame',
              'hangingPiece',
              'master',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingVariation: '',
            fen: '5k2/p1r1q3/4Bn2/8/5Q2/5P2/P5PP/4R1K1 w - - 3 43',
            moves: 'e6b3 e7e1',
            popularity: 70,
            uid: '1SB6j',
            rating: 945,
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/r1Yk5T1q#85',
            randomNumberQuery: 7234,
            ratingDeviation: 157
          },
          {
            rating: 671,
            openingVariation: '',
            fen: '5rkr/pp4pp/2p5/3p4/3N2Q1/2P5/PPn3PP/3R1q1K w - - 0 24',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            uid: '1tKvW',
            popularity: 97,
            randomNumberQuery: 7240,
            gameUrl: 'https://lichess.org/h0jppVNh#47',
            moves: 'd1f1 f8f1',
            openingFamily: '\r',
            nbPlays: 469,
            ratingDeviation: 77
          },
          {
            rating: 946,
            randomNumberQuery: 7246,
            uid: '2KtjJ',
            nbPlays: 415,
            popularity: 92,
            moves: 'g3f2 b1f1',
            ratingDeviation: 80,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingVariation: '',
            fen: '6k1/5pp1/b3p2p/2B2n2/3PN3/5PK1/R5PP/1r6 w - - 9 40',
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/WUmnNKb3#79'
          },
          {
            moves: 'g5g6 a2a1',
            ratingDeviation: 86,
            fen: '8/3p4/4p3/4P1P1/p1Pk1P2/P1pB1R1P/r1P5/2K5 w - - 1 42',
            rating: 602,
            uid: 'DJCnd',
            nbPlays: 606,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            gameUrl: 'https://lichess.org/eBpUD17b#83',
            randomNumberQuery: 7248,
            openingFamily: '\r',
            popularity: 97,
            openingVariation: ''
          },
          {
            randomNumberQuery: 7257,
            nbPlays: 22,
            fen: 'r1b1k2r/p1Q2ppp/1b2p3/1p1qP3/2p1n3/2P1B3/PP1N1PPP/R3KB1R w KQkq - 5 13',
            popularity: 100,
            uid: 'DaUKd',
            rating: 909,
            openingVariation: 'Sicilian_Defense_Alapin_Variation\r',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingFamily: 'Sicilian_Defense',
            ratingDeviation: 142,
            moves: 'e3b6 d5d2',
            gameUrl: 'https://lichess.org/o5rWt4at#25'
          },
          {
            moves: 'e2e3 c1f1',
            openingVariation: '',
            randomNumberQuery: 7264,
            fen: '6k1/pp3pp1/4b2p/3p4/8/4qB2/P3R1PP/1Nr2R1K w - - 8 30',
            gameUrl: 'https://lichess.org/b9kduHys#59',
            uid: 'DG8KP',
            ratingDeviation: 82,
            nbPlays: 124,
            openingFamily: '\r',
            rating: 703,
            popularity: 43,
            themes: [
              'backRankMate',
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn1',
              'oneMove'
            ]
          },
          {
            rating: 973,
            themes: [
              'endgame',
              'master',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            randomNumberQuery: 7269,
            gameUrl: 'https://lichess.org/a7eiSWtp#79',
            openingFamily: '\r',
            ratingDeviation: 76,
            moves: 'e3d4 e7e4',
            uid: 'DkmDb',
            nbPlays: 334,
            openingVariation: '',
            popularity: 90,
            fen: '8/4r3/2k3p1/6Rp/2p2PP1/2BbK2P/1P6/8 w - - 7 40'
          },
          {
            gameUrl: 'https://lichess.org/ou9GpOvi#67',
            popularity: 100,
            openingFamily: '\r',
            themes: [
              'anastasiaMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingVariation: '',
            nbPlays: 48,
            randomNumberQuery: 7270,
            fen: '6k1/R7/1p6/2p2rN1/8/8/P3n1PK/8 w - - 1 34',
            rating: 873,
            moves: 'g5e6 f5h5',
            uid: '0Gybi',
            ratingDeviation: 81
          },
          {
            gameUrl: 'https://lichess.org/pZ51lc0Z#33',
            uid: 'D7o1n',
            popularity: 88,
            randomNumberQuery: 7282,
            rating: 901,
            moves: 'c3e4 d6h2',
            nbPlays: 232,
            openingFamily: 'Queens_Gambit_Declined',
            ratingDeviation: 79,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            fen: 'r3k2r/pp3pp1/2pq4/5b1p/1P1Pp1n1/P1N1P2P/2QN1PP1/R4RK1 w kq - 0 17',
            openingVariation: 'Queens_Gambit_Declined_Other_variations\r'
          },
          {
            uid: '2KMWW',
            popularity: 100,
            randomNumberQuery: 7285,
            openingVariation: '',
            openingFamily: '\r',
            moves: 'e7e1 b1e1',
            themes: [
              'endgame',
              'hangingPiece',
              'master',
              'mate',
              'mateIn1',
              'oneMove',
              'queenEndgame'
            ],
            ratingDeviation: 89,
            fen: '8/4Q3/3P2pk/p7/PpP5/1P4pP/6P1/1q4K1 w - - 0 52',
            rating: 600,
            nbPlays: 346,
            gameUrl: 'https://lichess.org/2xSncdHU#103'
          },
          {
            uid: 'C8V4M',
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            popularity: 90,
            moves: 'e3f4 h3f3',
            gameUrl: 'https://lichess.org/PNa1rtV0#105',
            openingVariation: '',
            fen: '8/1p6/2bk1pB1/1p5P/1R4P1/P3K2r/1P6/8 w - - 7 53',
            rating: 687,
            nbPlays: 277,
            randomNumberQuery: 7288,
            ratingDeviation: 85
          },
          {
            nbPlays: 43,
            openingFamily: '\r',
            randomNumberQuery: 7289,
            openingVariation: '',
            popularity: 100,
            gameUrl: 'https://lichess.org/xXbcJKQK#17',
            uid: '1zyDY',
            ratingDeviation: 100,
            moves: 'e1g1 e5h2',
            rating: 896,
            fen: 'r1b1k2r/ppp2ppp/3b1n2/3pq3/8/2NBP2P/PPP2PP1/R1BQK2R w KQkq - 1 9',
            themes: [
              'master',
              'mate',
              'mateIn1',
              'oneMove',
              'opening'
            ]
          },
          {
            openingVariation: '',
            uid: 'DVNGX',
            fen: '8/1p3p2/pBk3p1/P1P1p2p/bb1KPN2/5P2/6PP/8 w - - 0 40',
            randomNumberQuery: 7289,
            nbPlays: 657,
            popularity: 100,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingFamily: '\r',
            rating: 787,
            gameUrl: 'https://lichess.org/IOstxdKH#79',
            moves: 'd4e5 b4c3',
            ratingDeviation: 77
          },
          {
            ratingDeviation: 78,
            fen: 'r1b1k1nN/ppp3pp/3b1n2/B3q1N1/4P3/8/PP3PPP/2RQ1RK1 w q - 4 17',
            randomNumberQuery: 7296,
            nbPlays: 149,
            uid: '0WqJQ',
            openingVariation: 'Queens_Gambit_Accepted_Normal_Variation\r',
            moves: 'h8f7 e5h2',
            openingFamily: 'Queens_Gambit_Accepted',
            rating: 926,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'oneMove',
              'opening'
            ],
            popularity: 92,
            gameUrl: 'https://lichess.org/g5snvzNY#33'
          },
          {
            rating: 664,
            randomNumberQuery: 7297,
            openingFamily: '\r',
            openingVariation: '',
            nbPlays: 56,
            fen: '8/8/1p6/6Bp/PRP4P/5rk1/8/7K w - - 1 50',
            popularity: 54,
            moves: 'b4b6 f3f1',
            uid: 'DD2P6',
            ratingDeviation: 101,
            gameUrl: 'https://lichess.org/TbsQn2It#99',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ]
          },
          {
            randomNumberQuery: 7306,
            openingVariation: 'Canard_Opening_Other_variations\r',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            fen: 'r4rk1/ppq1b1p1/2p1p1Np/2Pp4/1P1P2n1/P1NQP3/6PP/R4RK1 w - - 2 19',
            moves: 'g6f8 c7h2',
            openingFamily: 'Canard_Opening',
            popularity: 95,
            nbPlays: 1484,
            gameUrl: 'https://lichess.org/cuCHbYHL#37',
            rating: 997,
            ratingDeviation: 81,
            uid: 'E2JIA'
          },
          {
            openingVariation: '',
            moves: 'a3c2 f8f1',
            gameUrl: 'https://lichess.org/KeanT7oP#41',
            uid: '0VF5U',
            rating: 955,
            fen: '5rk1/ppp3pp/2n1p3/4p3/1P6/N1P1q3/P5PP/R2QB2K w - - 6 21',
            ratingDeviation: 155,
            openingFamily: '\r',
            randomNumberQuery: 7310,
            nbPlays: 26,
            popularity: 57,
            themes: [
              'backRankMate',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ]
          },
          {
            ratingDeviation: 97,
            fen: 'r3r1k1/pppn1ppp/8/3p4/6Q1/P1P5/BP4PP/R3q2K w - - 1 19',
            popularity: 80,
            moves: 'a1e1 e8e1',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            nbPlays: 114,
            randomNumberQuery: 7318,
            uid: '1aIO0',
            openingFamily: '\r',
            rating: 613,
            gameUrl: 'https://lichess.org/IwNL6hUc#37',
            openingVariation: ''
          },
          {
            openingFamily: '\r',
            openingVariation: '',
            uid: '0B66I',
            moves: 'e2f1 f8f1',
            popularity: 88,
            ratingDeviation: 106,
            nbPlays: 521,
            rating: 654,
            fen: 'r4rk1/1p4pp/p7/P1p1p1Q1/2Pp4/3P2R1/2P1B1PP/5q1K w - - 6 29',
            randomNumberQuery: 7330,
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            gameUrl: 'https://lichess.org/8g2Sf3z8#57'
          },
          {
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            randomNumberQuery: 7332,
            openingVariation: '',
            uid: '2U3W0',
            nbPlays: 338,
            popularity: 81,
            gameUrl: 'https://lichess.org/2Qn3bxSE#75',
            openingFamily: '\r',
            fen: '5k2/8/8/3R3N/6n1/1r6/6P1/6K1 w - - 6 38',
            moves: 'd5g5 b3b1',
            ratingDeviation: 87,
            rating: 600
          }
        ]
      },
      {
        time: 30,
        puzzlesCount: 0,
        themes: [
          'mateIn2'
        ],
        eloStart: 800,
        eloEnd: 1500,
        color: 'white',
        puzzleTimes: {
          warningOn: 6,
          dangerOn: 3,
          total: 10
        },
        puzzlesPlayed: [
          {
            uid: '1gbiudjko5u2llz56dxbj5',
            uidUser: 't1',
            uidPuzzle: '21QUx',
            date: 1707343627287,
            resolved: false,
            resolvedTime: 10,
            currentEloUser: 0,
            eloPuzzle: 965,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            openingFamily: '\r',
            openingVariation: '',
            fenPuzzle: '2k2bnr/3r4/pp2pPp1/1p2p1Pp/4P2P/1P6/P1P3Q1/2K3NR w - - 0 23'
          },
          {
            uid: 'fd9g0e9175qgikm40rpl7t',
            uidUser: 't1',
            uidPuzzle: '079fX',
            date: 1707343637057,
            resolved: true,
            resolvedTime: 9,
            currentEloUser: 0,
            eloPuzzle: 1418,
            themes: [
              'doubleCheck',
              'mate',
              'mateIn2',
              'opening',
              'short'
            ],
            openingFamily: 'Russian_Game',
            openingVariation: 'Russian_Game_Damiano_Variation\r',
            fenPuzzle: 'rnbkr3/ppp1bppp/5n2/3p4/5B2/3P4/PPP1QPPP/RN2KB1R w KQ - 2 9'
          },
          {
            uid: '0jiyrj1i86nfm83rptxaou',
            uidUser: 't1',
            uidPuzzle: '1jMIR',
            date: 1707343644214,
            resolved: true,
            resolvedTime: 7,
            currentEloUser: 0,
            eloPuzzle: 871,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingFamily: '\r',
            openingVariation: '',
            fenPuzzle: '4r3/6qk/p3R2p/1p3p2/2p5/6Q1/P4PPP/6K1 w - - 0 33'
          }
        ],
        nextPuzzleImmediately: true,
        puzzles: [
          {
            ratingDeviation: 80,
            uid: '21QUx',
            gameUrl: 'https://lichess.org/5fIcaVYd#45',
            openingFamily: '\r',
            popularity: 97,
            fen: '2k2bnr/3r4/pp2pPp1/1p2p1Pp/4P2P/1P6/P1P3Q1/2K3NR w - - 0 23',
            openingVariation: '',
            nbPlays: 234,
            rating: 965,
            moves: 'g2h3 f8a3 c1b1 d7d1',
            randomNumberQuery: 5210,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ]
          },
          {
            nbPlays: 464,
            popularity: 86,
            themes: [
              'doubleCheck',
              'mate',
              'mateIn2',
              'opening',
              'short'
            ],
            fen: 'rnbkr3/ppp1bppp/5n2/3p4/5B2/3P4/PPP1QPPP/RN2KB1R w KQ - 2 9',
            moves: 'e2f3 e7b4 e1d1 e8e1',
            gameUrl: 'https://lichess.org/UeLPtUYc#17',
            rating: 1418,
            randomNumberQuery: 5211,
            ratingDeviation: 76,
            openingVariation: 'Russian_Game_Damiano_Variation\r',
            uid: '079fX',
            openingFamily: 'Russian_Game'
          },
          {
            moves: 'e6e8 g7a1 e8e1 a1e1',
            uid: '1jMIR',
            openingVariation: '',
            nbPlays: 889,
            popularity: 96,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            ratingDeviation: 77,
            fen: '4r3/6qk/p3R2p/1p3p2/2p5/6Q1/P4PPP/6K1 w - - 0 33',
            gameUrl: 'https://lichess.org/3YEk6h7C#65',
            randomNumberQuery: 5212,
            rating: 871,
            openingFamily: '\r'
          },
          {
            nbPlays: 53,
            gameUrl: 'https://lichess.org/fYqX4XEW#73',
            openingVariation: '',
            fen: '1q4k1/7p/QpR3p1/1PpPbp1n/2P1p3/4B1PP/5PBK/3r4 w - - 2 37',
            ratingDeviation: 91,
            uid: '0VoQy',
            openingFamily: '\r',
            rating: 1130,
            moves: 'c6b6 e5g3 f2g3 b8g3',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            popularity: 100,
            randomNumberQuery: 5215
          },
          {
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            ratingDeviation: 97,
            rating: 801,
            openingFamily: '\r',
            popularity: 86,
            uid: '1RJzk',
            fen: '6k1/p4ppp/4p3/3p4/3Nn3/1Pr1P3/P4PPP/4R1K1 w - - 2 22',
            gameUrl: 'https://lichess.org/UsBVh7XQ#43',
            openingVariation: '',
            nbPlays: 75,
            randomNumberQuery: 5215,
            moves: 'e1e2 c3c1 e2e1 c1e1'
          },
          {
            fen: '4r2r/5pk1/p5np/1p1Q4/3P4/3B3R/PP1q2PP/R5K1 w - - 0 26',
            ratingDeviation: 77,
            openingVariation: '',
            popularity: 100,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            moves: 'd3g6 e8e1 a1e1 d2e1',
            nbPlays: 885,
            uid: '1Z555',
            randomNumberQuery: 5215,
            gameUrl: 'https://lichess.org/IX0UcedB#51',
            rating: 1173,
            openingFamily: '\r'
          },
          {
            moves: 'c3d2 d5h1 d2h2 h1h2',
            openingFamily: '\r',
            uid: '2FHRo',
            popularity: 100,
            openingVariation: '',
            nbPlays: 7,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'queenEndgame',
              'short'
            ],
            gameUrl: 'https://lichess.org/ZYaDF2k3#97',
            fen: '8/8/4p1pk/3q1p2/3P1P1K/2Q3P1/8/8 w - - 4 49',
            rating: 1223,
            ratingDeviation: 282,
            randomNumberQuery: 5215
          },
          {
            gameUrl: 'https://lichess.org/ey9r3ilK#49',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            fen: '3r2k1/p4pp1/1p5p/P1p1p3/4P3/2P5/1RPr1PPP/1R4K1 w - - 1 25',
            nbPlays: 28,
            popularity: 86,
            rating: 987,
            moves: 'a5b6 d2d1 b1d1 d8d1',
            openingVariation: '',
            uid: 'DHlK3',
            openingFamily: '\r',
            ratingDeviation: 107,
            randomNumberQuery: 5223
          },
          {
            popularity: 100,
            fen: '4r1k1/pQ4bp/5qp1/4p3/3Pp3/PP2P2P/1Br2PP1/3RR1K1 w - - 1 21',
            nbPlays: 11,
            uid: 'DvePW',
            ratingDeviation: 330,
            openingVariation: '',
            randomNumberQuery: 5223,
            gameUrl: 'https://lichess.org/tcL4VVFz#41',
            moves: 'b2a1 f6f2 g1h2 f2g2',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            rating: 1198,
            openingFamily: '\r'
          },
          {
            uid: 'Dy9n2',
            openingVariation: '',
            fen: '3rr3/pQp3bk/6p1/7p/8/2P3R1/PP4PP/4R2K w - - 1 31',
            gameUrl: 'https://lichess.org/nTYYq9vI#61',
            popularity: 89,
            randomNumberQuery: 5224,
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            rating: 1138,
            ratingDeviation: 76,
            moves: 'e1e8 d8d1 e8e1 d1e1',
            openingFamily: '\r',
            nbPlays: 505
          },
          {
            nbPlays: 2,
            openingVariation: '',
            popularity: -100,
            ratingDeviation: 462,
            randomNumberQuery: 5225,
            openingFamily: '\r',
            themes: [
              'backRankMate',
              'hangingPiece',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            moves: 'f3d3 d4a1 d3d1 a1d1',
            rating: 1090,
            fen: 'rn1R2BN/kppb2p1/p6p/8/2Nq4/5Q2/P1P3PP/R6K w - - 5 23',
            gameUrl: 'https://lichess.org/uz4muEqO#45',
            uid: '2D42l'
          },
          {
            uid: '1XKmb',
            openingFamily: '\r',
            rating: 1070,
            openingVariation: '',
            moves: 'e3b6 e5e1 a1e1 e8e1',
            nbPlays: 12,
            popularity: 82,
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            gameUrl: 'https://lichess.org/X6AZy14Q#61',
            ratingDeviation: 170,
            fen: '4r2k/p5bp/1q4p1/1p2r3/1P6/P3B3/B4PPP/R3Q1K1 w - - 0 31',
            randomNumberQuery: 5227
          },
          {
            popularity: 100,
            gameUrl: 'https://lichess.org/N8htfgZo#27',
            moves: 'h5e2 d8d4 c3b3 d4b4',
            nbPlays: 14,
            rating: 1112,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            openingVariation: 'Englund_Gambit_Other_variations\r',
            openingFamily: 'Englund_Gambit',
            uid: '2GYQP',
            ratingDeviation: 129,
            randomNumberQuery: 5229,
            fen: 'r2q3r/ppp3pp/2k1p2n/2b3NQ/4PB2/2K5/PPP1n1PP/RN5R w - - 3 14'
          },
          {
            popularity: 100,
            randomNumberQuery: 5230,
            nbPlays: 723,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            fen: '6R1/kp5r/p7/8/2P3N1/7P/P2r4/1R5K w - - 3 37',
            rating: 856,
            ratingDeviation: 76,
            gameUrl: 'https://lichess.org/08Kgo8FM#73',
            moves: 'b1g1 h7h3 g4h2 d2h2',
            openingVariation: '',
            openingFamily: '\r',
            uid: '1W2pr'
          },
          {
            rating: 1142,
            moves: 'd5d7 f4h2 g1f1 h2h1',
            nbPlays: 37,
            fen: '4r2k/2bn2pp/p7/1pBQ4/PP1P1q2/7P/5PP1/R1R3K1 w - - 1 28',
            ratingDeviation: 105,
            openingVariation: '',
            popularity: 100,
            randomNumberQuery: 5230,
            gameUrl: 'https://lichess.org/iikohfGa#55',
            uid: '2HXJu',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            openingFamily: '\r'
          },
          {
            nbPlays: 235,
            popularity: 96,
            ratingDeviation: 75,
            rating: 1253,
            openingFamily: '\r',
            randomNumberQuery: 5231,
            fen: '2r1rk2/Q5Rp/6p1/8/2q5/8/5PPP/5RK1 w - - 1 27',
            uid: 'DxfDV',
            themes: [
              'attraction',
              'endgame',
              'mate',
              'mateIn2',
              'sacrifice',
              'short'
            ],
            moves: 'g7h7 c4f1 g1f1 c8c1',
            openingVariation: '',
            gameUrl: 'https://lichess.org/1c0gj3a8#53'
          },
          {
            popularity: 73,
            nbPlays: 146,
            moves: 'f1c1 d3d1 c1d1 d8d1',
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            openingFamily: '\r',
            uid: '06Kkm',
            rating: 891,
            gameUrl: 'https://lichess.org/ekGGXMWX#49',
            fen: '2kr4/ppb2pp1/2p5/4Pbp1/NPP5/P1Rr2B1/5PPP/5RK1 w - - 3 25',
            ratingDeviation: 83,
            randomNumberQuery: 5233,
            openingVariation: ''
          },
          {
            ratingDeviation: 77,
            rating: 991,
            popularity: 98,
            openingVariation: '',
            openingFamily: '\r',
            fen: '8/7p/6pk/2NPP3/1PR2K2/r5P1/4n1P1/8 w - - 5 46',
            randomNumberQuery: 5236,
            nbPlays: 1020,
            uid: 'DWXlJ',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'f4g4 a3g3 g4h4 g6g5',
            gameUrl: 'https://lichess.org/PuqkIqak#91'
          },
          {
            openingVariation: 'Sicilian_Defense_Smith-Morra_Gambit_Accepted\r',
            ratingDeviation: 77,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            fen: 'r3k3/1p2npp1/p1nq2p1/3N4/2B3P1/7r/PP2QP2/R2R2K1 w q - 0 19',
            rating: 1077,
            randomNumberQuery: 5236,
            moves: 'd5e7 d6h2 g1f1 h2h1',
            nbPlays: 1472,
            popularity: 95,
            gameUrl: 'https://lichess.org/0fKzh79R#37',
            openingFamily: 'Sicilian_Defense',
            uid: 'Dy15z'
          },
          {
            ratingDeviation: 104,
            nbPlays: 40,
            themes: [
              'endgame',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'short'
            ],
            openingVariation: '',
            rating: 1160,
            randomNumberQuery: 5241,
            openingFamily: '\r',
            uid: '25wpj',
            fen: '6k1/3N2pp/2p5/p1P2p2/P2PpP1q/1b2P2P/2rQ2P1/R5K1 w - - 19 38',
            popularity: 100,
            moves: 'd2a5 h4f2 g1h2 f2g2',
            gameUrl: 'https://lichess.org/iJwsQdwz#75'
          },
          {
            uid: '00VSe',
            openingVariation: 'Sicilian_Defense_Lowenthal_Variation\r',
            ratingDeviation: 78,
            randomNumberQuery: 5243,
            rating: 971,
            openingFamily: 'Sicilian_Defense',
            fen: '6nr/1pN2ppp/p2Qbk2/2B1p3/3nq3/8/PP2BPPP/5K1R w - - 8 19',
            moves: 'c5d4 e4b1 e2d1 b1d1',
            nbPlays: 428,
            popularity: 94,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            gameUrl: 'https://lichess.org/xBVkshTD#37'
          },
          {
            openingVariation: '',
            moves: 'c4e5 d8d1 f2f1 d1f1',
            popularity: 93,
            randomNumberQuery: 5245,
            openingFamily: '\r',
            rating: 959,
            uid: '0XSCy',
            fen: '3qr1k1/p1p2p2/6p1/1b2bP1p/1PN1P3/PR5Q/5RPP/2B4K w - - 2 30',
            themes: [
              'fork',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            ratingDeviation: 89,
            gameUrl: 'https://lichess.org/SI6En62o#59',
            nbPlays: 76
          },
          {
            uid: '1XR2i',
            moves: 'f1f4 e7e1 f4f1 e1f1',
            ratingDeviation: 96,
            openingVariation: '',
            nbPlays: 485,
            gameUrl: 'https://lichess.org/ljlktoDQ#59',
            popularity: 87,
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            rating: 846,
            fen: '1r6/p1p1rNpk/1q5p/1PnB1p1Q/2P2n2/P2P3R/6PP/5R1K w - - 0 30',
            openingFamily: '\r',
            randomNumberQuery: 5245
          },
          {
            uid: 'DLxIY',
            popularity: 73,
            nbPlays: 75,
            randomNumberQuery: 5247,
            rating: 916,
            moves: 'e5f6 e7e1 d1e1 e8e1',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            fen: 'r3r1k1/4qppp/1bp2n2/1p1pP1B1/p5Q1/P1P5/BP3PPP/3RR1K1 w - - 6 22',
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/itZsG0w8#43',
            ratingDeviation: 84,
            openingVariation: ''
          },
          {
            uid: '1lz7L',
            randomNumberQuery: 5252,
            popularity: 100,
            gameUrl: 'https://lichess.org/KftkPLG8#63',
            moves: 'f3e5 f4e2 g1h1 h8h5',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            fen: '7r/p4pk1/8/4q2P/1P3n2/P1P2N2/5PP1/5RK1 w - - 0 32',
            nbPlays: 21,
            rating: 1250,
            openingVariation: '',
            ratingDeviation: 154,
            openingFamily: '\r'
          },
          {
            popularity: 100,
            nbPlays: 129,
            fen: '7r/p5k1/5p2/3P2p1/6q1/PP2P1n1/1BQNP1R1/6K1 w - - 0 37',
            ratingDeviation: 80,
            openingVariation: '',
            rating: 1368,
            randomNumberQuery: 5252,
            uid: '2PIv7',
            openingFamily: '\r',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            gameUrl: 'https://lichess.org/kBOKPK9A#73',
            moves: 'd2f3 h8h1 g1f2 h1f1'
          },
          {
            popularity: 77,
            fen: '1k2r3/pp3ppp/2p2n2/5Q2/N1Pq4/1P3B2/P4PPP/R5K1 w - - 2 20',
            openingVariation: '',
            moves: 'a1d1 d4d1 f3d1 e8e1',
            uid: '0XA6S',
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            ratingDeviation: 100,
            rating: 883,
            gameUrl: 'https://lichess.org/qyYAHcBr#39',
            randomNumberQuery: 5253,
            nbPlays: 450,
            openingFamily: '\r'
          },
          {
            openingVariation: '',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'queenEndgame',
              'short'
            ],
            uid: '1lsKo',
            openingFamily: '\r',
            randomNumberQuery: 5253,
            moves: 'e7e5 f5b1 e5e1 b1e1',
            nbPlays: 931,
            gameUrl: 'https://lichess.org/8m8NKITP#69',
            fen: '8/p3Q2p/2p3p1/5q2/2PP4/5kP1/PP5P/6K1 w - - 1 35',
            rating: 907,
            ratingDeviation: 79,
            popularity: 96
          },
          {
            randomNumberQuery: 5254,
            nbPlays: 508,
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'a6f6 b7f3 e2d2 h1d1',
            popularity: 94,
            ratingDeviation: 89,
            fen: '1k6/1bp1N3/R4n2/2B1pp2/3p2p1/3P2P1/2P1KP2/7r w - - 0 38',
            uid: '087i8',
            openingVariation: '',
            gameUrl: 'https://lichess.org/cbU1U5iV#75',
            rating: 969
          },
          {
            moves: 'f6f7 a4a1 b7b1 a1b1',
            randomNumberQuery: 5254,
            nbPlays: 23,
            openingFamily: '\r',
            popularity: 100,
            openingVariation: '',
            uid: 'CA8cA',
            gameUrl: 'https://lichess.org/5xoUYbw1#87',
            ratingDeviation: 122,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            fen: '8/PR6/2pp1P2/4p3/r3Pp2/6k1/6P1/6K1 w - - 1 44',
            rating: 1017
          },
          {
            popularity: 96,
            rating: 994,
            nbPlays: 262,
            openingVariation: '',
            moves: 'h5h4 e4e3 f2f3 e3f3',
            fen: '2k3r1/1pp5/p7/7R/3Pr3/P1P4K/1P3R1P/8 w - - 7 41',
            randomNumberQuery: 5259,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            uid: '2P2i3',
            ratingDeviation: 81,
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/1V6dYy34#81'
          },
          {
            openingVariation: '',
            popularity: 88,
            rating: 1371,
            uid: '1kp2p',
            gameUrl: 'https://lichess.org/KBgDpQSI#67',
            fen: '8/5pk1/5bpp/1pq1p3/1p2P3/1N2R1P1/1Q3P1P/3r1bK1 w - - 0 34',
            ratingDeviation: 89,
            themes: [
              'discoveredAttack',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'b3c5 f1h3 e3e1 d1e1',
            openingFamily: '\r',
            randomNumberQuery: 5263,
            nbPlays: 62
          },
          {
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            ratingDeviation: 76,
            popularity: 98,
            uid: '0Ckr9',
            gameUrl: 'https://lichess.org/jOxJELVi#53',
            randomNumberQuery: 5265,
            moves: 'g1h1 f5g3 h2g3 a8h8',
            nbPlays: 4152,
            fen: 'r7/pp6/5k2/2q1pn2/2P5/2N2P2/PPP3PP/R2QR1K1 w - - 1 27',
            openingFamily: '\r',
            rating: 1242,
            openingVariation: ''
          },
          {
            ratingDeviation: 83,
            openingVariation: '',
            uid: 'DHntM',
            gameUrl: 'https://lichess.org/4rXVpi5j#41',
            nbPlays: 173,
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            moves: 'd4e6 d7d1 a1d1 d8d1',
            fen: '3r2k1/1b1q1rpp/pp2p3/4PpQ1/3NpP2/2P3R1/PP4PP/R6K w - - 1 21',
            openingFamily: '\r',
            randomNumberQuery: 5267,
            rating: 1477,
            popularity: 63
          },
          {
            randomNumberQuery: 5271,
            ratingDeviation: 79,
            moves: 'd5e6 g5f4 g2g3 f4f2',
            gameUrl: 'https://lichess.org/y5rTuqyA#65',
            rating: 1155,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingFamily: '\r',
            nbPlays: 217,
            uid: 'D7tSP',
            fen: '7k/p2RR1pp/1p2r3/3Q1pq1/8/7P/5PPK/2r5 w - - 0 33',
            popularity: 58,
            openingVariation: ''
          },
          {
            randomNumberQuery: 5271,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            popularity: 87,
            moves: 'f3g4 h7h5 g4g5 d3g3',
            gameUrl: 'https://lichess.org/uAOb7G5c#91',
            uid: 'Dvl7t',
            fen: '8/2R2Pkp/2p3p1/2p5/2P2P1P/3r1K2/8/8 w - - 0 46',
            nbPlays: 726,
            openingFamily: '\r',
            ratingDeviation: 77,
            openingVariation: '',
            rating: 1292
          },
          {
            openingVariation: '',
            openingFamily: '\r',
            ratingDeviation: 78,
            popularity: 87,
            gameUrl: 'https://lichess.org/n5zQBthX#63',
            rating: 1235,
            fen: '1r5k/4Q3/p3p1p1/6P1/4q2P/8/Pr6/KR5R w - - 0 32',
            randomNumberQuery: 5273,
            moves: 'b1b2 e4h1 b2b1 h1b1',
            themes: [
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn2',
              'short'
            ],
            nbPlays: 1331,
            uid: 'DHSvE'
          },
          {
            openingVariation: '',
            nbPlays: 2644,
            themes: [
              'attraction',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            rating: 1007,
            randomNumberQuery: 5276,
            ratingDeviation: 77,
            openingFamily: '\r',
            fen: '7k/ppp3p1/5pQp/8/8/1P6/PB1q1PPP/4rRK1 w - - 4 27',
            moves: 'b2f6 e1f1 g1f1 d2d1',
            popularity: 98,
            gameUrl: 'https://lichess.org/thIHBaIX#53',
            uid: '06fev'
          },
          {
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'queenEndgame',
              'short'
            ],
            nbPlays: 57,
            uid: 'DmsP0',
            randomNumberQuery: 5278,
            ratingDeviation: 87,
            openingVariation: '',
            popularity: 100,
            gameUrl: 'https://lichess.org/UG2mX6w5#107',
            openingFamily: '\r',
            rating: 1297,
            fen: '6k1/4Qp2/3P2p1/3q4/8/5KP1/5P2/8 w - - 7 54',
            moves: 'f3g4 d5f5 g4h4 f5h5'
          },
          {
            popularity: 82,
            gameUrl: 'https://lichess.org/JBoixFfW#143',
            nbPlays: 4,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            randomNumberQuery: 5279,
            openingFamily: '\r',
            moves: 'd6d4 b3b1 d4d1 b1d1',
            uid: '1V9wy',
            rating: 1018,
            openingVariation: '',
            ratingDeviation: 175,
            fen: '8/8/P2R4/8/3p2P1/1r3k1p/7B/6K1 w - - 1 72'
          },
          {
            uid: 'DpGBx',
            fen: '8/5pP1/8/6P1/8/p7/Kpk5/8 w - - 1 52',
            openingFamily: '\r',
            ratingDeviation: 75,
            moves: 'g7g8q b2b1q a2a3 b1b3',
            randomNumberQuery: 5284,
            openingVariation: '',
            themes: [
              'advancedPawn',
              'endgame',
              'mate',
              'mateIn2',
              'promotion',
              'queenEndgame',
              'short'
            ],
            rating: 1135,
            gameUrl: 'https://lichess.org/BnHKNdmS#103',
            nbPlays: 467,
            popularity: 98
          },
          {
            openingFamily: 'Queens_Pawn_Game',
            uid: '1Yeon',
            ratingDeviation: 76,
            openingVariation: 'Queens_Pawn_Game_Other_variations\r',
            nbPlays: 207,
            fen: 'rnbqk2r/ppp2ppp/4p3/3pP3/4n1P1/4P3/PPP1BP1P/RN1QK1NR w KQkq - 1 8',
            moves: 'f2f3 d8h4 e1f1 h4f2',
            popularity: 100,
            rating: 1222,
            randomNumberQuery: 5285,
            themes: [
              'mate',
              'mateIn2',
              'opening',
              'short'
            ],
            gameUrl: 'https://lichess.org/gl4fzJgK#15'
          },
          {
            gameUrl: 'https://lichess.org/dIwXp5KP#91',
            moves: 'g1h1 g5c1 e2f1 c1f1',
            openingVariation: '',
            fen: '6k1/5p2/4pPp1/2bbP1q1/6N1/8/4Q1BP/6K1 w - - 3 46',
            rating: 1482,
            randomNumberQuery: 5290,
            nbPlays: 17,
            popularity: 82,
            uid: 'DbBF1',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'pin',
              'short'
            ],
            openingFamily: '\r',
            ratingDeviation: 105
          },
          {
            popularity: 71,
            openingVariation: '',
            fen: '3r3r/Bnp2p1p/1p4p1/3q3k/3Q1R1P/2P2P2/PP3P2/K6R w - - 0 27',
            openingFamily: '\r',
            rating: 882,
            randomNumberQuery: 5291,
            moves: 'd4f6 d5d1 h1d1 d8d1',
            ratingDeviation: 83,
            uid: '20MnR',
            nbPlays: 75,
            gameUrl: 'https://lichess.org/ucR2QND7#53',
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ]
          },
          {
            fen: '7r/7k/p7/1p1NPb2/1P3p1K/P4P2/1P6/R4R2 w - - 1 41',
            themes: [
              'discoveredAttack',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingVariation: '',
            nbPlays: 77,
            ratingDeviation: 82,
            moves: 'd5f6 h7g6 f6h7 h8h7',
            randomNumberQuery: 5296,
            openingFamily: '\r',
            uid: '04tpr',
            rating: 1452,
            gameUrl: 'https://lichess.org/bqzlfafX#81',
            popularity: 75
          },
          {
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            nbPlays: 1030,
            ratingDeviation: 77,
            gameUrl: 'https://lichess.org/U28ZfleG#75',
            fen: '6k1/1R3p2/8/5B2/6P1/P1r5/P5KP/3r4 w - - 1 38',
            randomNumberQuery: 5300,
            popularity: 95,
            rating: 1055,
            uid: '0CKPi',
            moves: 'b7b3 d1d2 g2f1 c3c1',
            openingVariation: ''
          },
          {
            randomNumberQuery: 5300,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            popularity: 58,
            openingFamily: '\r',
            rating: 1469,
            uid: '1nB7f',
            gameUrl: 'https://lichess.org/cxjjKwpT#45',
            fen: '5rk1/p5p1/1pp1R2p/3n4/2BP1q2/1Q6/PP3PPP/6K1 w - - 1 23',
            nbPlays: 27,
            moves: 'c4d5 f4f2 g1h1 f2f1',
            ratingDeviation: 95,
            openingVariation: ''
          },
          {
            popularity: 86,
            nbPlays: 328,
            ratingDeviation: 75,
            openingVariation: '',
            rating: 1245,
            gameUrl: 'https://lichess.org/crFjt4aR#51',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'queensideAttack',
              'short'
            ],
            moves: 'f4f6 b2b1 c1d2 b8b2',
            fen: '1r4k1/5p1p/p2p1qp1/2pBp3/4PR2/2PPQP2/1r3P1P/2K1R3 w - - 0 26',
            randomNumberQuery: 5300,
            openingFamily: '\r',
            uid: 'DGqcl'
          },
          {
            nbPlays: 81,
            moves: 'h2h1 f2f1 a1f1 f8f1',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            ratingDeviation: 113,
            fen: '5r1k/p6p/6p1/4b3/3p2Q1/P2P3P/1PPB1qPK/R4N2 w - - 7 27',
            rating: 1099,
            gameUrl: 'https://lichess.org/dZGXIXDf#53',
            openingFamily: '\r',
            popularity: 100,
            randomNumberQuery: 5303,
            uid: 'DP9sy',
            openingVariation: ''
          },
          {
            openingFamily: '\r',
            nbPlays: 174,
            fen: '1k6/p5p1/1p2pp1p/3rq3/2R1bB2/1P3Q2/P4PPP/6K1 w - - 2 26',
            ratingDeviation: 95,
            openingVariation: '',
            uid: 'DI93o',
            gameUrl: 'https://lichess.org/R80Hezzw#51',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            rating: 979,
            moves: 'f3e4 d5d1 e4e1 d1e1',
            popularity: 92,
            randomNumberQuery: 5306
          },
          {
            ratingDeviation: 78,
            fen: '5r1k/6pp/8/1Q6/P2N3q/2P5/1P4PP/R6K w - - 0 30',
            uid: '0Gib9',
            gameUrl: 'https://lichess.org/wjAdZzjj#59',
            openingVariation: '',
            rating: 815,
            openingFamily: '\r',
            themes: [
              'backRankMate',
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn2',
              'short'
            ],
            randomNumberQuery: 5307,
            nbPlays: 752,
            popularity: 96,
            moves: 'a1e1 h4e1 b5f1 f8f1'
          },
          {
            randomNumberQuery: 5308,
            nbPlays: 10,
            openingVariation: '',
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            openingFamily: '\r',
            ratingDeviation: 216,
            uid: 'DCkH2',
            fen: '4r1rk/ppp3p1/7p/8/5PQ1/PP3RbP/1BPPq1P1/3K3R w - - 1 26',
            rating: 1027,
            gameUrl: 'https://lichess.org/JoPQMHpA#51',
            moves: 'd1c1 e2e1 h1e1 e8e1',
            popularity: 100
          },
          {
            uid: '1qLbM',
            openingFamily: '\r',
            openingVariation: '',
            gameUrl: 'https://lichess.org/OEP9DSeC#53',
            popularity: 84,
            nbPlays: 684,
            fen: '1N4k1/1b4bp/4p1p1/5r2/BQ1Pp3/1P2PpPq/P4P1P/2R3RK w - - 5 27',
            ratingDeviation: 78,
            rating: 1394,
            themes: [
              'attraction',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            randomNumberQuery: 5311,
            moves: 'b4b7 h3h2 h1h2 f5h5'
          },
          {
            randomNumberQuery: 5312,
            moves: 'e5f6 h6h5 g4h4 d4f6',
            uid: '25EqL',
            rating: 1477,
            ratingDeviation: 92,
            fen: '8/6p1/1p4kp/1B2Pp2/P2b1PK1/6PP/3R4/5r2 w - f6 0 37',
            openingFamily: '\r',
            popularity: 86,
            gameUrl: 'https://lichess.org/oZZ0CfYa#73',
            openingVariation: '',
            themes: [
              'endgame',
              'intermezzo',
              'mate',
              'mateIn2',
              'short'
            ],
            nbPlays: 54
          },
          {
            fen: '5rk1/ppp4p/6pb/3Pp3/q1P1Q1P1/6P1/PPK1N3/5N1R w - - 3 23',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            openingVariation: '',
            ratingDeviation: 78,
            gameUrl: 'https://lichess.org/LpiNvTW4#45',
            popularity: 95,
            nbPlays: 717,
            openingFamily: '\r',
            uid: '2Mces',
            moves: 'c2b1 a4d1 e2c1 d1c1',
            rating: 1103,
            randomNumberQuery: 5312
          },
          {
            nbPlays: 728,
            fen: '2r2rk1/3q1pp1/p3p2p/1p2P3/1P6/P4Q2/2R1RPPP/6K1 w - - 1 25',
            moves: 'c2c8 d7d1 e2e1 d1e1',
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingVariation: '',
            gameUrl: 'https://lichess.org/GyAbR0jL#49',
            popularity: 95,
            uid: 'CDXZ6',
            ratingDeviation: 81,
            rating: 997,
            randomNumberQuery: 5313
          },
          {
            rating: 966,
            openingVariation: '',
            gameUrl: 'https://lichess.org/c7pScAeF#61',
            nbPlays: 164,
            fen: '6k1/2Np1p2/p5p1/5qnp/3Q4/1P3N2/5PPP/6K1 w - - 1 31',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            randomNumberQuery: 5314,
            openingFamily: '\r',
            uid: 'CBwWw',
            ratingDeviation: 75,
            popularity: 94,
            moves: 'f3g5 f5b1 d4d1 b1d1'
          },
          {
            popularity: 98,
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            gameUrl: 'https://lichess.org/emON0e63#47',
            uid: 'DHH2y',
            fen: '1rr5/3b1ppk/p3p3/4P3/8/5N2/Q4PPP/1R4K1 w - - 1 24',
            openingFamily: '\r',
            ratingDeviation: 75,
            randomNumberQuery: 5316,
            moves: 'b1b8 c8c1 f3e1 c1e1',
            nbPlays: 2007,
            openingVariation: '',
            rating: 1096
          },
          {
            rating: 1098,
            moves: 'h5g6 f4f1 g1f1 f6f1',
            popularity: 85,
            openingVariation: '',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            gameUrl: 'https://lichess.org/alNqHbrp#73',
            uid: '1yRTT',
            openingFamily: '\r',
            fen: '6k1/4pp2/p4rp1/7P/1p3q2/8/PPP3R1/1K4Q1 w - - 5 37',
            randomNumberQuery: 5319,
            ratingDeviation: 76,
            nbPlays: 458
          },
          {
            randomNumberQuery: 5321,
            openingVariation: '',
            fen: 'r3r2k/6pp/p4p2/8/1B6/P1N2Q2/1q4PP/1R5K w - - 0 24',
            uid: '0UfIV',
            rating: 816,
            openingFamily: '\r',
            nbPlays: 13,
            gameUrl: 'https://lichess.org/V52OgcBI#47',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            popularity: 22,
            ratingDeviation: 180,
            moves: 'b1b2 e8e1 f3f1 e1f1'
          },
          {
            gameUrl: 'https://lichess.org/SMNYrZlB#49',
            themes: [
              'fork',
              'hangingPiece',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            nbPlays: 675,
            openingFamily: '\r',
            fen: '1r4k1/2p3pp/p1p5/3pN3/P1bPn3/2P1RP2/2Q3PP/Br4K1 w - - 1 25',
            randomNumberQuery: 5321,
            popularity: 97,
            moves: 'c2b1 b8b1 e3e1 b1e1',
            ratingDeviation: 77,
            rating: 1008,
            uid: 'DHt1N',
            openingVariation: ''
          },
          {
            fen: '4r1k1/ppp1qpp1/3b3p/3b3Q/3P4/2N4P/PPP2PP1/R5K1 w - - 0 24',
            moves: 'c3d5 e7e1 a1e1 e8e1',
            themes: [
              'endgame',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'sacrifice',
              'short'
            ],
            openingVariation: '',
            gameUrl: 'https://lichess.org/mu7khGKt#47',
            popularity: 100,
            openingFamily: '\r',
            randomNumberQuery: 5328,
            rating: 1077,
            uid: '1aNc9',
            ratingDeviation: 168,
            nbPlays: 23
          },
          {
            ratingDeviation: 76,
            fen: '4N3/7p/4p1pk/3pP3/1b3PP1/1n4KP/8/6B1 w - - 4 42',
            randomNumberQuery: 5330,
            nbPlays: 1317,
            openingFamily: '\r',
            moves: 'g3h4 b4e1 g1f2 e1f2',
            uid: '22irr',
            openingVariation: '',
            gameUrl: 'https://lichess.org/TP91R8nO#83',
            themes: [
              'endgame',
              'master',
              'mate',
              'mateIn2',
              'short'
            ],
            popularity: 92,
            rating: 1170
          },
          {
            openingFamily: '\r',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            moves: 'c5e4 e7a3 c1b1 a3b2',
            uid: 'C8P6g',
            randomNumberQuery: 5332,
            gameUrl: 'https://lichess.org/cpdiqqzb#41',
            popularity: 100,
            nbPlays: 66,
            ratingDeviation: 91,
            openingVariation: '',
            fen: '1rb2rk1/4q1bp/2p1p1p1/p1N5/4pPP1/1P2B2P/P1PQ4/2KR3R w - - 2 21',
            rating: 1000
          },
          {
            moves: 'a4a5 g5g4 h3h4 b2h2',
            themes: [
              'deflection',
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            uid: '1phyo',
            nbPlays: 562,
            openingFamily: '\r',
            rating: 982,
            ratingDeviation: 90,
            randomNumberQuery: 5334,
            gameUrl: 'https://lichess.org/dIWqLIte#85',
            popularity: 86,
            openingVariation: '',
            fen: '8/8/Rp5k/6pp/P7/6PK/1r5P/8 w - - 0 43'
          },
          {
            fen: 'r1b1k1nr/pppp1ppp/5q2/8/4P1n1/2N2B2/PPPP1KPP/R1BQ3R w kq - 4 8',
            ratingDeviation: 76,
            openingFamily: 'Three_Knights_Opening',
            openingVariation: 'Three_Knights_Opening_Other_variations\r',
            popularity: 96,
            rating: 1393,
            moves: 'f2g1 f6d4 g1f1 d4f2',
            randomNumberQuery: 5335,
            gameUrl: 'https://lichess.org/t5BQl1zD#15',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'opening',
              'short'
            ],
            uid: '0HpVa',
            nbPlays: 8383
          },
          {
            nbPlays: 36,
            uid: 'DEuYV',
            moves: 'f8d8 e7e1 d3f1 e1f1',
            randomNumberQuery: 5335,
            gameUrl: 'https://lichess.org/AD3xYqdt#69',
            ratingDeviation: 112,
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            fen: '3r1R2/p3q2p/1pk5/8/8/3Q4/PPP3PP/7K w - - 11 35',
            openingVariation: '',
            rating: 839,
            popularity: 100
          },
          {
            rating: 1188,
            randomNumberQuery: 5335,
            openingFamily: '\r',
            themes: [
              'master',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            moves: 'g2h2 c6h6 h2g2 h6h3',
            gameUrl: 'https://lichess.org/kCKmRnyS#51',
            popularity: 88,
            ratingDeviation: 77,
            openingVariation: '',
            fen: '4rk2/p5p1/1bq5/3p4/4pPp1/P1P3P1/1P1PQ1Kr/R1B2R2 w - - 2 26',
            nbPlays: 130,
            uid: 'DUO0G'
          },
          {
            ratingDeviation: 77,
            rating: 1391,
            moves: 'g3g2 d3b1 e2f1 f7f1',
            nbPlays: 148,
            fen: '6k1/1b3r1p/4p1p1/p1p5/2P1p1P1/1P1qP1R1/P3Q2P/B5K1 w - - 3 33',
            openingFamily: '\r',
            uid: 'DMTJO',
            themes: [
              'endgame',
              'fork',
              'mate',
              'mateIn2',
              'short'
            ],
            openingVariation: '',
            popularity: 81,
            gameUrl: 'https://lichess.org/I6A0mwls#65',
            randomNumberQuery: 5336
          },
          {
            openingVariation: '',
            fen: '8/6pB/pkn3Q1/1p4P1/3bNq2/8/PPP4P/1K1R4 w - - 5 29',
            randomNumberQuery: 5340,
            ratingDeviation: 108,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'd1d4 f4f1 d4d1 f1d1',
            nbPlays: 17,
            gameUrl: 'https://lichess.org/9MfhbkCC#57',
            popularity: 83,
            rating: 983,
            openingFamily: '\r',
            uid: '2Bhtn'
          },
          {
            rating: 1313,
            ratingDeviation: 352,
            randomNumberQuery: 5342,
            openingVariation: '',
            nbPlays: 3,
            openingFamily: '\r',
            popularity: 100,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            fen: '6k1/pp3pp1/2p5/2Pp4/4q1n1/2P2N2/PP1Q1PP1/6K1 w - - 0 26',
            gameUrl: 'https://lichess.org/03PAa8Vm#51',
            moves: 'f3d4 e4b1 d2c1 b1c1',
            uid: 'DleAq'
          },
          {
            popularity: 80,
            fen: '5rk1/3qQ2p/p2r1pp1/1p1P2n1/2p5/2P3P1/PPB2PKP/3RR3 w - - 2 27',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            uid: 'DVjhj',
            openingFamily: '\r',
            randomNumberQuery: 5344,
            gameUrl: 'https://lichess.org/KvTZnMrH#53',
            moves: 'h2h4 d7h3 g2g1 g5f3',
            ratingDeviation: 100,
            nbPlays: 45,
            rating: 1123,
            openingVariation: ''
          },
          {
            gameUrl: 'https://lichess.org/rEgSMJhK#29',
            openingVariation: 'Nimzowitsch_Defense_Colorado_Countergambit_Accepted\r',
            ratingDeviation: 75,
            rating: 1312,
            moves: 'f1g1 h8h3 g4h3 g3h3',
            openingFamily: 'Nimzowitsch_Defense',
            nbPlays: 8047,
            fen: 'r3k2r/ppp3p1/2n1pnp1/3p2B1/3P2B1/6qP/PPP5/RN1Q1R1K w kq - 0 15',
            popularity: 97,
            uid: '1gPRt',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            randomNumberQuery: 5348
          },
          {
            rating: 991,
            gameUrl: 'https://lichess.org/0yGzEcC1#61',
            openingFamily: '\r',
            fen: '2k5/R1p2pp1/4r3/2K3p1/5rP1/2P4P/P7/R7 w - - 9 31',
            openingVariation: '',
            nbPlays: 512,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            popularity: 96,
            randomNumberQuery: 5352,
            ratingDeviation: 81,
            moves: 'a1b1 e6e5 c5c6 f4c4',
            uid: 'DMneI'
          },
          {
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            popularity: 97,
            fen: '7k/p2B1p1p/7q/4p2r/3PP1n1/PR3N2/5PP1/3Q1RK1 w - - 1 24',
            openingFamily: '\r',
            ratingDeviation: 75,
            nbPlays: 7563,
            randomNumberQuery: 5353,
            rating: 1443,
            gameUrl: 'https://lichess.org/le5DKR8r#47',
            uid: '0b3mE',
            openingVariation: '',
            moves: 'g2g3 h5h1 g1g2 h6h3'
          },
          {
            gameUrl: 'https://lichess.org/Rm2ucny5#43',
            randomNumberQuery: 5357,
            popularity: 100,
            openingVariation: '',
            openingFamily: '\r',
            fen: '5rk1/5ppp/p7/1pq5/3R4/P2Q4/1Pr2PPP/3R2K1 w - - 0 22',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'd4d8 c5f2 g1h1 f2g2',
            uid: 'DhB9S',
            nbPlays: 663,
            rating: 1105,
            ratingDeviation: 76
          },
          {
            popularity: 82,
            openingFamily: 'Scotch_Game',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'queensideAttack',
              'short'
            ],
            moves: 'c4a5 f2e3 c1b1 d8d1',
            nbPlays: 6,
            gameUrl: 'https://lichess.org/pcegcr4B#35',
            uid: 'DZVDw',
            fen: '2kr4/1pp2p1p/4bp2/p7/P1N1P3/5P2/1PP2b1P/2K2B1R w - - 0 18',
            ratingDeviation: 202,
            rating: 1026,
            openingVariation: 'Scotch_Game_Classical_Variation\r',
            randomNumberQuery: 5360
          },
          {
            ratingDeviation: 82,
            themes: [
              'endgame',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'short'
            ],
            nbPlays: 70,
            rating: 1103,
            moves: 'c2e2 d6h2 g1f1 h2h1',
            uid: '1bY0D',
            openingFamily: '\r',
            randomNumberQuery: 5362,
            popularity: 82,
            fen: '7k/pbb3pp/1p1q4/5p2/2BBp3/1PP1P3/P1Q2PPP/6K1 w - - 3 27',
            openingVariation: '',
            gameUrl: 'https://lichess.org/EbDiFlda#53'
          },
          {
            randomNumberQuery: 5362,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            moves: 'g2h3 h7h3 h1g2 h3h2',
            ratingDeviation: 84,
            nbPlays: 388,
            popularity: 93,
            openingFamily: '\r',
            uid: 'DisgX',
            openingVariation: '',
            rating: 966,
            fen: '1k5r/5pbr/pq1p2p1/1P2p3/1P2P3/2NB1QNb/2P3P1/R4R1K w - - 0 22',
            gameUrl: 'https://lichess.org/bORovf6C#43'
          },
          {
            gameUrl: 'https://lichess.org/GqAOIEh0#53',
            themes: [
              'backRankMate',
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'e8e2 c3c1 e2e1 c1e1',
            openingFamily: '\r',
            randomNumberQuery: 5367,
            nbPlays: 40,
            ratingDeviation: 107,
            openingVariation: '',
            fen: '4Rn2/1p3pkp/p2p2p1/3N4/PP6/2r5/4rPPP/2R3K1 w - - 0 27',
            popularity: 51,
            rating: 830,
            uid: '1pwKG'
          },
          {
            ratingDeviation: 78,
            openingVariation: 'English_Opening_Anglo-Indian_Defense\r',
            rating: 1127,
            gameUrl: 'https://lichess.org/CvJIUwYI#35',
            openingFamily: 'English_Opening',
            moves: 'd1c2 f6f2 g1h1 f2g1',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            randomNumberQuery: 5372,
            fen: '1r3rk1/pPp2pp1/1b3q2/4p1N1/8/6P1/PP1B1P1P/R2Q1BK1 w - - 1 18',
            nbPlays: 1912,
            popularity: 96,
            uid: '03Anu'
          },
          {
            randomNumberQuery: 5375,
            openingVariation: '',
            nbPlays: 782,
            openingFamily: '\r',
            ratingDeviation: 75,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            rating: 1373,
            fen: 'r4r2/1p2bkpQ/p2p2n1/2pPn1P1/2P2B2/1N2P1N1/PPq2P2/R3K2R w KQ - 3 21',
            gameUrl: 'https://lichess.org/SDJ9l4ZO#41',
            uid: '2BGfc',
            moves: 'h7h5 e5d3 e1f1 c2f2',
            popularity: 98
          },
          {
            popularity: 54,
            rating: 1075,
            fen: '8/1p6/3prppk/p2P3p/2P2P1K/1P1r4/6PP/R7 w - - 0 32',
            openingFamily: '\r',
            nbPlays: 15,
            moves: 'd5e6 g6g5 f4g5 f6g5',
            uid: '1mW9s',
            gameUrl: 'https://lichess.org/F9xBRp0O#63',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            randomNumberQuery: 5378,
            openingVariation: '',
            ratingDeviation: 179
          },
          {
            themes: [
              'deflection',
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            fen: '8/5pp1/3k3p/3P4/6P1/r5KP/P2R4/8 w - - 7 40',
            uid: '1yK3Q',
            ratingDeviation: 77,
            rating: 972,
            moves: 'g3h4 g7g5 h4h5 a3h3',
            openingVariation: '',
            openingFamily: '\r',
            popularity: 97,
            nbPlays: 1164,
            gameUrl: 'https://lichess.org/JZG7RjYI#79',
            randomNumberQuery: 5378
          },
          {
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            uid: 'DSZ2i',
            randomNumberQuery: 5378,
            moves: 'c1d1 g4d1 c3e1 d1e1',
            fen: '8/5R2/p3p1pk/1p5p/1P4q1/P1Q5/5PPP/2Rr2K1 w - - 1 35',
            nbPlays: 21,
            ratingDeviation: 191,
            openingFamily: '\r',
            rating: 952,
            openingVariation: '',
            gameUrl: 'https://lichess.org/ww3c4o95#69',
            popularity: 100
          },
          {
            popularity: 87,
            randomNumberQuery: 5379,
            ratingDeviation: 76,
            gameUrl: 'https://lichess.org/eU29GgMu#39',
            rating: 1014,
            uid: '2W5dK',
            openingFamily: '\r',
            nbPlays: 263,
            moves: 'f2g1 e8e1 a1e1 h4e1',
            openingVariation: '',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            fen: 'r3r2k/pNpb2pp/8/1p3p2/3P1P1q/1QP5/PP3KPP/R3R3 w - - 1 20'
          },
          {
            rating: 1473,
            ratingDeviation: 75,
            popularity: 96,
            fen: '6k1/1p3pp1/pQp4p/3q4/2NP4/PP3n1P/3Rr1P1/6K1 w - - 0 31',
            gameUrl: 'https://lichess.org/bbMu0IAb#61',
            openingFamily: '\r',
            uid: 'DlZde',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'g2f3 d5g5 g1f1 g5g2',
            openingVariation: '',
            nbPlays: 8565,
            randomNumberQuery: 5380
          },
          {
            openingFamily: '\r',
            popularity: 67,
            nbPlays: 39,
            moves: 'e1e3 a2a1 e3e1 a1e1',
            uid: '1V6D6',
            fen: '4k3/4P2p/7p/8/1p5N/6Pb/rP3P1P/4R1K1 w - - 1 33',
            gameUrl: 'https://lichess.org/2gtAhDl8#65',
            openingVariation: '',
            randomNumberQuery: 5381,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            rating: 834,
            ratingDeviation: 119
          },
          {
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            uid: '0GyFL',
            moves: 'd2f2 h2h5 g3g4 h5g4',
            popularity: 94,
            randomNumberQuery: 5383,
            openingVariation: '',
            fen: '8/4kp2/1b2p3/1p1pPp2/1Pp2P2/2P1PKP1/3Q2Bq/8 w - - 5 44',
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/sZ40RH0J#87',
            ratingDeviation: 77,
            rating: 1432,
            nbPlays: 1014
          },
          {
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/NPMFHwcf#69',
            moves: 'e5g3 g5f3 h2h1 f2f1',
            randomNumberQuery: 5386,
            openingVariation: '',
            nbPlays: 536,
            fen: '6k1/5pp1/7p/4B1n1/2Q1P3/3P3P/5qPK/8 w - - 1 35',
            popularity: 90,
            ratingDeviation: 80,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'pin',
              'short'
            ],
            uid: '07sX1',
            rating: 1121
          },
          {
            fen: '8/7p/p1Q4r/2p2pk1/2P1p3/4R1PB/5P1K/q7 w - - 10 45',
            openingVariation: '',
            uid: '0KKVn',
            nbPlays: 71,
            ratingDeviation: 89,
            rating: 1205,
            popularity: 82,
            randomNumberQuery: 5387,
            themes: [
              'attraction',
              'endgame',
              'mate',
              'mateIn2',
              'sacrifice',
              'short'
            ],
            openingFamily: '\r',
            moves: 'c6c5 h6h3 h2h3 a1h1',
            gameUrl: 'https://lichess.org/8r8bpfUX#89'
          },
          {
            popularity: 90,
            fen: '3rr3/pp6/5Q1p/5p2/5Nk1/8/PP4PP/4R2K w - - 5 29',
            ratingDeviation: 79,
            moves: 'e1e8 d8d1 e8e1 d1e1',
            openingFamily: '\r',
            openingVariation: '',
            uid: '1dsR2',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            rating: 1179,
            randomNumberQuery: 5387,
            gameUrl: 'https://lichess.org/pY9yNPfq#57',
            nbPlays: 275
          },
          {
            gameUrl: 'https://lichess.org/TSPnjpZH#39',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            fen: '3r2kr/p4p1p/2Q3p1/7q/3B4/8/PPP2PPP/R4K2 w - - 1 20',
            rating: 1025,
            openingFamily: '\r',
            openingVariation: '',
            nbPlays: 1139,
            uid: '0Zvp4',
            randomNumberQuery: 5388,
            ratingDeviation: 76,
            moves: 'd4h8 d8d1 a1d1 h5d1',
            popularity: 96
          },
          {
            popularity: 73,
            ratingDeviation: 76,
            uid: 'DEzNZ',
            nbPlays: 112,
            moves: 'f3e5 f4e3 g1h1 f6f1',
            randomNumberQuery: 5390,
            gameUrl: 'https://lichess.org/uWzegZQ4#63',
            fen: '2R5/p5k1/1p3r1p/3p3B/1P1Pbb2/5N2/P5PP/6K1 w - - 2 32',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingVariation: '',
            rating: 1099,
            openingFamily: '\r'
          },
          {
            rating: 1191,
            gameUrl: 'https://lichess.org/s3lxYXeq#67',
            fen: '8/3nb3/p3k1p1/2p1n2p/1pP1N3/1P2K1PP/PB2B3/8 w - - 0 34',
            popularity: 87,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            ratingDeviation: 76,
            openingVariation: '',
            randomNumberQuery: 5390,
            nbPlays: 82,
            openingFamily: '\r',
            moves: 'e4f2 e7g5 e3e4 d7f6',
            uid: 'DUm0k'
          },
          {
            popularity: 93,
            openingVariation: '',
            openingFamily: '\r',
            fen: '2r5/p6p/1p2Pk1p/3p1P2/3Nn1P1/7P/PP6/1K2R3 w - - 0 37',
            nbPlays: 453,
            ratingDeviation: 90,
            moves: 'e1c1 e4d2 b1a1 c8c1',
            rating: 948,
            uid: '28Mex',
            gameUrl: 'https://lichess.org/OB2Q1uL2#73',
            themes: [
              'backRankMate',
              'deflection',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            randomNumberQuery: 5392
          }
        ]
      },
      {
        time: -1,
        puzzlesCount: 1,
        themes: [
          'mate'
        ],
        eloStart: 800,
        eloEnd: 1500,
        puzzlesPlayed: [
          {
            uid: '8pavd6bqq8taaysioje0uw',
            uidUser: 't1',
            uidPuzzle: '1gSFk',
            date: 1707343663821,
            resolved: true,
            resolvedTime: 4,
            currentEloUser: 0,
            eloPuzzle: 971,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            openingFamily: '\r',
            openingVariation: '',
            fenPuzzle: '4r1k1/ppp4p/n2p2p1/3P2q1/2P2p2/P1N2n1P/BP3P2/R1BQ3K w - - 0 22'
          }
        ],
        color: 'white',
        puzzles: [
          {
            uid: '1gSFk',
            nbPlays: 835,
            openingFamily: '\r',
            popularity: 100,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            moves: 'd1f3 e8e1 h1h2 g5g1',
            rating: 971,
            fen: '4r1k1/ppp4p/n2p2p1/3P2q1/2P2p2/P1N2n1P/BP3P2/R1BQ3K w - - 0 22',
            randomNumberQuery: 7381,
            openingVariation: '',
            ratingDeviation: 75,
            gameUrl: 'https://lichess.org/cz6eXGEk#43'
          },
          {
            fen: '3R4/2B2p1k/1p2p1p1/1Pq4p/2P1Q3/7P/r4PP1/6K1 w - - 3 27',
            uid: '1fYYD',
            ratingDeviation: 75,
            openingFamily: '\r',
            nbPlays: 2328,
            randomNumberQuery: 7382,
            moves: 'e4e5 c5f2 g1h2 f2g2',
            gameUrl: 'https://lichess.org/tbSdZIDd#53',
            popularity: 93,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingVariation: '',
            rating: 1296
          },
          {
            gameUrl: 'https://lichess.org/5XbX6mMK#65',
            popularity: 100,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'd4e5 b6e3 c4e2 f2e2',
            openingFamily: '\r',
            rating: 1371,
            uid: 'DVYxg',
            randomNumberQuery: 7382,
            ratingDeviation: 92,
            nbPlays: 65,
            fen: '3k1r2/pp5R/1q1p2p1/4p1P1/2QPP3/2P5/1P3rP1/3RK3 w - - 1 33',
            openingVariation: ''
          },
          {
            fen: '1k5r/p4ppp/1pp3q1/2b1p2n/4P3/2N2P2/PPPQ2PP/R2R3K w - - 2 19',
            rating: 1421,
            randomNumberQuery: 7384,
            nbPlays: 14289,
            moves: 'a2a4 h5g3 h2g3 g6h5',
            popularity: 96,
            ratingDeviation: 76,
            themes: [
              'clearance',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            uid: '26jP9',
            openingFamily: 'Philidor_Defense',
            openingVariation: 'Philidor_Defense_Other_variations\r',
            gameUrl: 'https://lichess.org/e9nOSw2L#37'
          },
          {
            openingVariation: '',
            popularity: 100,
            rating: 1195,
            fen: '2b2qkr/5ppp/2Q1p3/pB1P4/8/r7/2P3PP/1K1R3R w - - 1 23',
            openingFamily: '\r',
            uid: '1UMhD',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            ratingDeviation: 76,
            randomNumberQuery: 7386,
            moves: 'd5e6 f8b4 b1c1 a3a1',
            gameUrl: 'https://lichess.org/KIiWsAx6#45',
            nbPlays: 256
          },
          {
            openingFamily: '\r',
            ratingDeviation: 77,
            rating: 1246,
            uid: '2Wigq',
            openingVariation: '',
            themes: [
              'long',
              'mate',
              'mateIn3',
              'middlegame',
              'sacrifice'
            ],
            gameUrl: 'https://lichess.org/UrVPNIX5#51',
            popularity: 77,
            moves: 'b1a1 d4b3 a2b3 c6a6 c3a5 a6a5',
            randomNumberQuery: 7387,
            fen: '1k4n1/1p3pp1/2rp4/2p1p1b1/2PnP3/2BP1P2/PPb4Q/1K3RNB w - - 2 26',
            nbPlays: 536
          },
          {
            rating: 1380,
            openingFamily: '\r',
            ratingDeviation: 77,
            openingVariation: '',
            randomNumberQuery: 7388,
            uid: '2HCXG',
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            gameUrl: 'https://lichess.org/lGFROBlz#39',
            nbPlays: 177,
            popularity: 85,
            fen: 'r3rk2/pp1q1p2/2n5/2pN1pQp/P2b4/1B1P4/1PP2nPP/R1B2R1K w - - 1 20',
            moves: 'f1f2 e8e1 f2f1 e1f1'
          },
          {
            openingVariation: '',
            openingFamily: '\r',
            randomNumberQuery: 7390,
            fen: '1r3k1r/pbp2p2/3qnN2/2pp4/2PP4/4BQ2/PP3PpP/3RR1K1 w - - 1 26',
            popularity: 100,
            moves: 'c4d5 d6h2',
            uid: '1RyT6',
            ratingDeviation: 151,
            gameUrl: 'https://lichess.org/7AcGqlJs#51',
            nbPlays: 55,
            rating: 948,
            themes: [
              'kingsideAttack',
              'master',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ]
          },
          {
            uid: '25kmE',
            popularity: 97,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            ratingDeviation: 83,
            rating: 962,
            gameUrl: 'https://lichess.org/0qHKZZ6f#45',
            fen: 'r7/pp1kq1pp/2pP2r1/8/6b1/1BN5/PPP2P1P/R4R1K w - - 0 23',
            moves: 'd6e7 g4f3',
            openingVariation: '',
            nbPlays: 523,
            openingFamily: '\r',
            randomNumberQuery: 7390
          },
          {
            ratingDeviation: 90,
            rating: 1094,
            randomNumberQuery: 7391,
            popularity: 63,
            gameUrl: 'https://lichess.org/rQ9zApec#39',
            fen: 'r4rk1/p2Rn1pp/2p5/2p2q2/4Q3/2N5/PP3PPP/3R2K1 w - - 1 20',
            uid: '23WOE',
            nbPlays: 46,
            moves: 'e4e7 f5f2 g1h1 f2f1 d1f1 f8f1',
            themes: [
              'backRankMate',
              'long',
              'mate',
              'mateIn3',
              'middlegame',
              'sacrifice'
            ],
            openingFamily: '\r',
            openingVariation: ''
          },
          {
            fen: '2Q5/1p2r1bk/4Pq1p/8/p7/8/PPP2PR1/1K1r2R1 w - - 4 35',
            gameUrl: 'https://lichess.org/T3WH2u0c#69',
            nbPlays: 57,
            openingFamily: '\r',
            randomNumberQuery: 7393,
            rating: 907,
            uid: 'DVuf1',
            popularity: 87,
            openingVariation: '',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            ratingDeviation: 79,
            moves: 'g1d1 f6b2'
          },
          {
            ratingDeviation: 75,
            popularity: 98,
            randomNumberQuery: 7395,
            themes: [
              'backRankMate',
              'fork',
              'mate',
              'mateIn2',
              'opening',
              'short'
            ],
            openingVariation: 'Italian_Game_Giuoco_Piano\r',
            fen: 'r1b1kr2/pppp1ppQ/5q2/2b5/4P3/3B4/PPn2PPP/RNB1R1K1 w q - 0 12',
            gameUrl: 'https://lichess.org/x8KSlnM8#23',
            openingFamily: 'Italian_Game',
            uid: '2MI5p',
            moves: 'd3c2 f6f2 g1h1 f2e1',
            nbPlays: 3180,
            rating: 1009
          },
          {
            randomNumberQuery: 7395,
            moves: 'd2e3 f6d5',
            nbPlays: 14,
            gameUrl: 'https://lichess.org/ph1zpb0E#35',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            fen: '5rk1/p4ppp/5n2/5b2/3B4/P4P2/1PrK2PP/3R1B1R w - - 1 18',
            openingVariation: 'Sicilian_Defense_Taimanov_Variation\r',
            popularity: 100,
            openingFamily: 'Sicilian_Defense',
            uid: 'DYJ03',
            rating: 1208,
            ratingDeviation: 300
          },
          {
            themes: [
              'endgame',
              'master',
              'masterVsMaster',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'c7e7 g5g4 h3g4 f5g4',
            popularity: 94,
            fen: '8/2R5/1R2b3/3pkpp1/2p4p/4PK1P/r4PP1/8 w - - 0 50',
            openingVariation: '',
            gameUrl: 'https://lichess.org/y9XPCG8J#99',
            randomNumberQuery: 7398,
            rating: 993,
            uid: '0F9GH',
            nbPlays: 1295,
            ratingDeviation: 75,
            openingFamily: '\r'
          },
          {
            openingVariation: '',
            gameUrl: 'https://lichess.org/uEqg62ob#43',
            rating: 1069,
            popularity: 93,
            themes: [
              'attraction',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            randomNumberQuery: 7398,
            openingFamily: '\r',
            uid: '2PSRw',
            nbPlays: 927,
            fen: '4r1k1/pp3ppp/5n2/8/1bNB4/3P1Q2/P1P2PPP/4qRK1 w - - 0 22',
            moves: 'd4f6 e1f1 g1f1 e8e1',
            ratingDeviation: 81
          },
          {
            rating: 1312,
            gameUrl: 'https://lichess.org/Xb9BpTpl#37',
            moves: 'f3e4 f6a1',
            openingVariation: '',
            ratingDeviation: 348,
            uid: 'DP7h0',
            popularity: 100,
            nbPlays: 16,
            randomNumberQuery: 7398,
            fen: '5rk1/2p2p2/p2p1qp1/1p1n4/4p2P/1P1P1P2/P1PQ1P2/2KR2R1 w - - 0 19',
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ]
          },
          {
            randomNumberQuery: 7401,
            gameUrl: 'https://lichess.org/5O0j1WzF#71',
            fen: '5r2/7k/1p6/p1bRP2p/2P3p1/6P1/P3R2P/7K w - - 0 36',
            openingVariation: '',
            rating: 1282,
            uid: '1r0l9',
            openingFamily: '\r',
            ratingDeviation: 75,
            nbPlays: 2764,
            moves: 'e5e6 f8f1 h1g2 f1g1',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            popularity: 96
          },
          {
            moves: 'c4b3 a4a1',
            openingVariation: '',
            fen: 'r5k1/5pp1/4p2p/8/qNQ3PP/5P2/1KR5/8 w - - 2 42',
            rating: 1354,
            popularity: 95,
            openingFamily: '\r',
            nbPlays: 40,
            uid: '1leoi',
            randomNumberQuery: 7403,
            gameUrl: 'https://lichess.org/1mySBR25#83',
            themes: [
              'endgame',
              'master',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            ratingDeviation: 165
          },
          {
            openingFamily: '\r',
            themes: [
              'advancedPawn',
              'mate',
              'mateIn1',
              'oneMove',
              'opening',
              'promotion'
            ],
            nbPlays: 153,
            rating: 1235,
            fen: 'Qn2kb1r/p1p1pppp/5n2/6N1/6b1/2N5/PPp2PPP/R1BqKB1R w KQk - 1 9',
            randomNumberQuery: 7403,
            gameUrl: 'https://lichess.org/ZjLwhLov#17',
            ratingDeviation: 76,
            openingVariation: '',
            moves: 'c3d1 c2d1q',
            popularity: 81,
            uid: '1scn0'
          },
          {
            fen: '1Q6/p1p3kp/3p2p1/3B2r1/2Pb2b1/3P2n1/P3r2P/5R1K w - - 0 28',
            ratingDeviation: 500,
            nbPlays: 0,
            rating: 1500,
            popularity: 100,
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/QZ70vwxo#55',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            randomNumberQuery: 7404,
            uid: '1XArn',
            moves: 'h2g3 g5h5',
            openingVariation: ''
          },
          {
            themes: [
              'master',
              'masterVsMaster',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            openingFamily: '\r',
            popularity: 97,
            openingVariation: '',
            uid: '1vL8I',
            gameUrl: 'https://lichess.org/KuWXMkaG#69',
            randomNumberQuery: 7405,
            moves: 'h1c1 c4c1',
            nbPlays: 265,
            ratingDeviation: 78,
            fen: '6k1/4bp1p/3pb1P1/4p1P1/pnq1P3/Q4PN1/1P5R/K1r4R w - - 0 35',
            rating: 1092
          },
          {
            moves: 'c6c7 h2h1',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove',
              'rookEndgame'
            ],
            rating: 1434,
            openingFamily: '\r',
            ratingDeviation: 81,
            randomNumberQuery: 7405,
            openingVariation: '',
            gameUrl: 'https://lichess.org/uEru2qfr#79',
            popularity: 92,
            uid: 'DIiiE',
            nbPlays: 946,
            fen: '6k1/5pp1/2P5/4P2p/p4P2/4P3/r6r/1RR2K2 w - - 5 40'
          },
          {
            gameUrl: 'https://lichess.org/DqJPxrSy#55',
            openingVariation: '',
            ratingDeviation: 120,
            openingFamily: '\r',
            uid: 'DCxoF',
            popularity: 100,
            fen: '1r3r1k/Q3Rp1p/3p1n2/2p5/8/2N3R1/PPPq2PP/1K6 w - - 2 28',
            randomNumberQuery: 7406,
            moves: 'e7f7 d2e1 c3d1 e1d1',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            nbPlays: 40,
            rating: 1317
          },
          {
            fen: '8/8/8/5k1K/R7/8/8/6r1 w - - 12 70',
            ratingDeviation: 83,
            nbPlays: 285,
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/Rhvc9bEN#139',
            rating: 1240,
            randomNumberQuery: 7409,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            moves: 'a4a3 g1h1 a3h3 h1h3',
            uid: 'CAW0P',
            popularity: 82,
            openingVariation: ''
          },
          {
            moves: 'd2f3 h4h3 f1g1 h3g2',
            rating: 1239,
            randomNumberQuery: 7410,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            gameUrl: 'https://lichess.org/y5kuYN8l#39',
            fen: '1r3rk1/1Pp2ppp/p2p4/4p3/B3Pn1q/2P5/PP1N1P1N/R2QRK2 w - - 5 20',
            popularity: 68,
            uid: 'DXmLj',
            openingVariation: '',
            ratingDeviation: 75,
            openingFamily: '\r',
            nbPlays: 225
          },
          {
            nbPlays: 87,
            rating: 1361,
            moves: 'd4b3 d5d1 a1d1 d8d1',
            fen: '3r2k1/pp3pp1/2p2n1p/3q4/1P1N4/Pb2P1Q1/1B3PPP/R5K1 w - - 2 21',
            popularity: 84,
            openingVariation: '',
            openingFamily: '\r',
            randomNumberQuery: 7411,
            uid: 'Df585',
            ratingDeviation: 106,
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            gameUrl: 'https://lichess.org/yLh33qj2#41'
          },
          {
            randomNumberQuery: 7412,
            uid: '09iQ0',
            moves: 'f3g5 h3g2',
            fen: 'r4rk1/pp3pbp/2np2p1/2p1p3/4PP2/2PPnNBq/PP1NB3/R3QRK1 w - - 2 15',
            ratingDeviation: 445,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            nbPlays: 6,
            openingVariation: 'Sicilian_Defense_Big_Clamp_Formation\r',
            gameUrl: 'https://lichess.org/CJtqLZwX#29',
            openingFamily: 'Sicilian_Defense',
            popularity: 67,
            rating: 1459
          },
          {
            popularity: 97,
            ratingDeviation: 75,
            fen: '7k/p1p2R1p/4Q1p1/2p2nq1/5R2/7P/PP3PP1/3r2K1 w - - 5 32',
            openingVariation: '',
            moves: 'g1h2 g5f4 g2g3 f4f2',
            themes: [
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn2',
              'short'
            ],
            openingFamily: '\r',
            nbPlays: 3353,
            gameUrl: 'https://lichess.org/RVFxYeMQ#63',
            randomNumberQuery: 7413,
            uid: '2KX8F',
            rating: 1148
          },
          {
            fen: '3k1r2/p1q2b1p/2P5/8/PPB1P3/3Pn1Pp/3N1P2/2R2RK1 w - - 1 24',
            moves: 'f2e3 c7g3 g1h1 g3g2',
            gameUrl: 'https://lichess.org/O5RnVR1O#47',
            openingVariation: '',
            rating: 1054,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            popularity: 93,
            ratingDeviation: 82,
            randomNumberQuery: 7415,
            openingFamily: '\r',
            nbPlays: 197,
            uid: '2U18P'
          },
          {
            popularity: 86,
            openingVariation: '',
            uid: 'DAGgk',
            fen: '8/P4ppk/6rp/4P3/4QP2/q7/7R/2R4K w - - 1 54',
            rating: 906,
            openingFamily: '\r',
            ratingDeviation: 78,
            themes: [
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn2',
              'short'
            ],
            randomNumberQuery: 7417,
            nbPlays: 258,
            moves: 'a7a8q a3c1 e4e1 c1e1',
            gameUrl: 'https://lichess.org/p88KxSf5#107'
          },
          {
            ratingDeviation: 77,
            uid: '1yY9m',
            openingVariation: '',
            rating: 1058,
            openingFamily: '\r',
            randomNumberQuery: 7418,
            nbPlays: 162,
            popularity: 100,
            moves: 'a5a7 c3d4',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            fen: '8/7p/5p2/R4P2/1p4P1/1Pb2P1k/P1Bp1K2/3Rr3 w - - 0 47',
            gameUrl: 'https://lichess.org/vRxCkiJq#93'
          },
          {
            gameUrl: 'https://lichess.org/m6I5t3ih#45',
            randomNumberQuery: 7420,
            openingVariation: '',
            openingFamily: '\r',
            ratingDeviation: 81,
            moves: 'b2c1 c5a3 c1b1 a3b2',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            fen: '1r2k2r/5p1p/p1p1p1p1/2qpP3/2n2P1P/1P4Q1/PKPB2P1/3R3R w k - 1 23',
            nbPlays: 1863,
            uid: 'CBt0Z',
            rating: 1208,
            popularity: 93
          },
          {
            uid: 'Dcvjx',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            fen: '8/2P2k2/6pp/p3Q3/p7/P2P3P/2rr4/6K1 w - - 5 34',
            gameUrl: 'https://lichess.org/7woO1yud#67',
            ratingDeviation: 77,
            randomNumberQuery: 7420,
            openingFamily: '\r',
            openingVariation: '',
            popularity: 93,
            nbPlays: 5949,
            rating: 1458,
            moves: 'c7c8q d2d1 e5e1 d1e1'
          },
          {
            openingFamily: 'Russian_Game',
            moves: 'e1e2 h6e3 e2d1 e3e1',
            randomNumberQuery: 7420,
            popularity: 82,
            fen: 'r3k2r/ppp2ppp/2p4q/8/4P1QP/2NP4/PPPb2P1/R3KB1R w KQkq - 1 13',
            uid: 'Dz7jQ',
            gameUrl: 'https://lichess.org/T2HJHQ9m#25',
            nbPlays: 71,
            ratingDeviation: 80,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            rating: 947,
            openingVariation: 'Russian_Game_Stafford_Gambit\r'
          },
          {
            gameUrl: 'https://lichess.org/jGJcDmEu#95',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            moves: 'd6d5 a2a1 d5d1 a1d1',
            randomNumberQuery: 7423,
            openingFamily: '\r',
            fen: '8/8/3R4/p2b3R/8/4kp2/r7/5K2 w - - 4 48',
            ratingDeviation: 78,
            popularity: 100,
            uid: 'DaEld',
            nbPlays: 127,
            rating: 1288,
            openingVariation: ''
          },
          {
            ratingDeviation: 96,
            openingVariation: '',
            themes: [
              'backRankMate',
              'long',
              'mate',
              'mateIn3',
              'middlegame'
            ],
            openingFamily: '\r',
            fen: '2r2rk1/p2R1pp1/2q1n1p1/1pN5/1P5R/P4P2/1Q4PP/7K w - - 4 33',
            randomNumberQuery: 7424,
            nbPlays: 713,
            uid: '0Vwj5',
            rating: 836,
            gameUrl: 'https://lichess.org/dil045OS#65',
            moves: 'c5e6 c6c1 b2c1 c8c1 d7d1 c1d1',
            popularity: 95
          },
          {
            rating: 1459,
            nbPlays: 132,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            fen: 'r1q4k/2p3p1/p2p2rp/1p1P4/6bQ/P1N1B3/1P3P2/R3RK2 w - - 3 29',
            uid: '2BnRK',
            ratingDeviation: 75,
            moves: 'c3e2 g4h3 h4h3 c8h3',
            randomNumberQuery: 7424,
            popularity: 82,
            gameUrl: 'https://lichess.org/In0uZOMS#57',
            openingFamily: '\r',
            openingVariation: ''
          },
          {
            openingFamily: '\r',
            moves: 'a1d1 d8d1',
            rating: 1052,
            uid: 'DiimL',
            randomNumberQuery: 7426,
            popularity: 100,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            nbPlays: 30,
            openingVariation: '',
            fen: '3q1rk1/6pp/4PB2/8/2P3Q1/5pP1/5P1P/R2r2K1 w - - 1 31',
            ratingDeviation: 207,
            gameUrl: 'https://lichess.org/IjD1EXWW#61'
          },
          {
            popularity: 44,
            rating: 1338,
            gameUrl: 'https://lichess.org/Ty4QfqLm#71',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            moves: 'g1g3 d8d1',
            openingVariation: '',
            fen: '3r1k2/R4p2/4p1pp/8/2N3P1/1P6/P4r2/1K4R1 w - - 0 36',
            randomNumberQuery: 7427,
            nbPlays: 20,
            openingFamily: '\r',
            uid: '0C2Mz',
            ratingDeviation: 128
          },
          {
            nbPlays: 77,
            rating: 980,
            gameUrl: 'https://lichess.org/RZtkhCbV#73',
            themes: [
              'backRankMate',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            ratingDeviation: 80,
            popularity: 65,
            randomNumberQuery: 7427,
            uid: '0EDld',
            openingFamily: '\r',
            openingVariation: '',
            fen: '3r2k1/7p/3r2pP/Q1p1pb2/2P2b2/8/PP3R2/1K3R2 w - - 1 37',
            moves: 'b1a1 d6d1 f1d1 d8d1'
          },
          {
            moves: 'f1f2 h7b1 f2f1 b1f1',
            fen: '6rk/pp4pq/4Q3/3pB3/2pP4/2P5/PP2b1PP/5RK1 w - - 1 38',
            nbPlays: 752,
            openingFamily: '\r',
            randomNumberQuery: 7429,
            gameUrl: 'https://lichess.org/dR5JnFVH#75',
            openingVariation: '',
            popularity: 97,
            uid: 'DmAhX',
            ratingDeviation: 75,
            rating: 1153,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ]
          },
          {
            randomNumberQuery: 7430,
            openingFamily: '\r',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            moves: 'f3d5 g4g3 h2g1 b3b1',
            ratingDeviation: 121,
            popularity: 100,
            fen: '8/R4pk1/8/1P5p/P5p1/1r3B1P/6PK/8 w - - 0 38',
            nbPlays: 42,
            gameUrl: 'https://lichess.org/MzR4B72Y#75',
            uid: '0WMtM',
            rating: 1374,
            openingVariation: ''
          },
          {
            gameUrl: 'https://lichess.org/0UrIuCK2#39',
            openingVariation: '',
            fen: '2kr2n1/3q2Bp/5p2/1pp5/8/PPb1Pb2/2Q2P1P/R3K1R1 w Q - 0 20',
            popularity: 60,
            randomNumberQuery: 7431,
            ratingDeviation: 78,
            openingFamily: '\r',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            nbPlays: 117,
            rating: 1045,
            moves: 'c2c3 d7d1 a1d1 d8d1',
            uid: 'DvOLc'
          },
          {
            openingFamily: '\r',
            ratingDeviation: 94,
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            openingVariation: '',
            rating: 1228,
            nbPlays: 56,
            uid: 'CDfLe',
            fen: 'r3kb2/1B3p2/p2qpp2/7Q/8/1Pp1B3/P1P1nP2/2KR4 w q - 1 21',
            popularity: 100,
            moves: 'h5e2 d6a3 c1b1 a3b2',
            gameUrl: 'https://lichess.org/XTTweeXm#41',
            randomNumberQuery: 7433
          },
          {
            ratingDeviation: 76,
            uid: 'Dzw2x',
            fen: 'r2r1k2/pbp2ppp/1p6/3qn3/3P4/1P2P3/P3BPPP/2RQ1RK1 w - - 0 15',
            rating: 1113,
            moves: 'd4e5 d5g2',
            openingVariation: 'Queens_Gambit_Declined_Other_variations\r',
            popularity: 89,
            randomNumberQuery: 7433,
            nbPlays: 702,
            openingFamily: 'Queens_Gambit_Declined',
            gameUrl: 'https://lichess.org/OVGqhase#29',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ]
          },
          {
            gameUrl: 'https://lichess.org/9YvibIyr#33',
            rating: 1063,
            openingFamily: 'Englund_Gambit_Complex',
            uid: '1oR1A',
            moves: 'b7c7 h8g8 g1h1 c6f3',
            ratingDeviation: 77,
            randomNumberQuery: 7434,
            openingVariation: 'Englund_Gambit_Complex_Englund_Gambit\r',
            popularity: 98,
            fen: 'r3k2r/pRp2p1p/2bp4/5P2/8/3B1P2/P1P2P1P/5RK1 w kq - 1 17',
            nbPlays: 466,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ]
          },
          {
            randomNumberQuery: 7436,
            openingFamily: '\r',
            moves: 'c3e5 f3h3 e5h2 e2h2',
            fen: '6k1/pp3pp1/8/3R3p/2P5/PPB2r1P/4r3/6RK w - - 7 33',
            popularity: 100,
            ratingDeviation: 75,
            uid: 'DICMS',
            openingVariation: '',
            nbPlays: 842,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            gameUrl: 'https://lichess.org/MWV8wQvw#65',
            rating: 870
          },
          {
            rating: 1123,
            moves: 'c3e5 f7f1 e1f1 f8f1',
            uid: 'DbJDD',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            nbPlays: 443,
            popularity: 91,
            openingVariation: '',
            gameUrl: 'https://lichess.org/TML6CMRR#55',
            fen: 'r4rk1/1pp2qp1/2b3Q1/p3p3/2P5/2B3R1/P5PP/4R2K w - - 3 28',
            randomNumberQuery: 7436,
            openingFamily: '\r',
            ratingDeviation: 79
          },
          {
            openingVariation: '',
            gameUrl: 'https://lichess.org/7TG3rRKn#51',
            uid: '1WQnv',
            ratingDeviation: 76,
            nbPlays: 823,
            rating: 1385,
            moves: 'c1b2 b1h1 h2g2 a1f1',
            randomNumberQuery: 7437,
            fen: '6k1/p3pp2/2pp2pp/8/P3P2P/2R3P1/1r1QN2K/qrB5 w - - 1 26',
            openingFamily: '\r',
            popularity: 84,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ]
          },
          {
            ratingDeviation: 141,
            popularity: 100,
            moves: 'f3g5 c3e2',
            fen: '4r1k1/5ppp/p2b4/P1p5/4b1P1/2n1BN1P/5P2/R4RK1 w - - 2 27',
            uid: 'CEvTa',
            randomNumberQuery: 7438,
            gameUrl: 'https://lichess.org/gXhq0bUL#53',
            themes: [
              'master',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            rating: 1110,
            openingVariation: '',
            nbPlays: 43,
            openingFamily: '\r'
          },
          {
            moves: 'd1d5 c2h2',
            rating: 800,
            themes: [
              'arabianMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            openingFamily: '\r',
            openingVariation: '',
            popularity: 92,
            nbPlays: 319,
            ratingDeviation: 92,
            randomNumberQuery: 7440,
            fen: '6k1/5pp1/7p/BB1r4/P5P1/5n2/2r4P/1R1R3K w - - 1 35',
            uid: '20gQj',
            gameUrl: 'https://lichess.org/MQfEKn1n#69'
          },
          {
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            randomNumberQuery: 7440,
            rating: 842,
            uid: 'Dc2dT',
            openingVariation: '',
            fen: '3rnr1k/pp4pp/2p2p2/8/4Q1R1/4N3/PPP2PPP/3q2K1 w - - 0 21',
            gameUrl: 'https://lichess.org/KZzQ9VDW#41',
            moves: 'e3d1 d8d1 e4e1 d1e1',
            ratingDeviation: 120,
            popularity: 67,
            openingFamily: '\r',
            nbPlays: 20
          },
          {
            themes: [
              'master',
              'mate',
              'mateIn2',
              'middlegame',
              'sacrifice',
              'short'
            ],
            nbPlays: 86,
            fen: '1k2r3/1b4pp/pNpb1p2/1p1B4/8/P3BQ2/1Pq2PPP/R5K1 w - - 2 22',
            openingFamily: '\r',
            moves: 'a1c1 c2c1 e3c1 e8e1',
            uid: '2KjqS',
            rating: 1419,
            popularity: 100,
            randomNumberQuery: 7442,
            ratingDeviation: 91,
            openingVariation: '',
            gameUrl: 'https://lichess.org/jIfZ1DK6#43'
          },
          {
            moves: 'h3h6 c2e2 f1g1 e2e1 a1e1 e8e1',
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/EjLVRFuF#43',
            rating: 1137,
            fen: 'r3r1k1/p4p2/1p4pp/8/3Q4/7R/PPq2PPP/R4K2 w - - 0 22',
            openingVariation: '',
            nbPlays: 1417,
            popularity: 96,
            themes: [
              'backRankMate',
              'endgame',
              'long',
              'mate',
              'mateIn3',
              'sacrifice'
            ],
            ratingDeviation: 74,
            randomNumberQuery: 7443,
            uid: '0YrWG'
          },
          {
            moves: 'a7e7 g4d1 e3e1 d1e1',
            themes: [
              'hangingPiece',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            nbPlays: 141,
            rating: 925,
            popularity: 79,
            ratingDeviation: 96,
            gameUrl: 'https://lichess.org/kRAhERPl#53',
            fen: '2r2rk1/R3b1pp/2Np4/1pn5/1N2p1q1/2P1Q3/1P3PPP/3R2K1 w - - 4 27',
            openingFamily: '\r',
            randomNumberQuery: 7445,
            openingVariation: '',
            uid: '2Fb9d'
          },
          {
            rating: 995,
            openingVariation: 'Kings_Pawn_Game_Macleod_Attack\r',
            fen: '5r1k/pp4pp/1qp1B3/4Q3/8/2N5/PP3rPP/R4RK1 w - - 0 19',
            uid: 'Di37A',
            openingFamily: 'Kings_Pawn_Game',
            moves: 'f1f2 b6f2 g1h1 f2f1 a1f1 f8f1',
            themes: [
              'backRankMate',
              'long',
              'mate',
              'mateIn3',
              'middlegame'
            ],
            nbPlays: 110,
            popularity: 88,
            gameUrl: 'https://lichess.org/9SAzN4Yv#37',
            ratingDeviation: 78,
            randomNumberQuery: 7445
          },
          {
            gameUrl: 'https://lichess.org/sGGhhJNI#77',
            fen: '8/8/3Q1pk1/p2P2p1/P3Pp1P/4qb2/5R1R/1r3B1K w - - 1 39',
            uid: '1taKR',
            themes: [
              'attraction',
              'mate',
              'mateIn2',
              'middlegame',
              'pin',
              'sacrifice',
              'short'
            ],
            nbPlays: 14387,
            openingFamily: '\r',
            openingVariation: '',
            moves: 'h1g1 b1f1 g1f1 e3c1',
            randomNumberQuery: 7447,
            popularity: 96,
            ratingDeviation: 76,
            rating: 1334
          },
          {
            fen: 'r2r2k1/p4pp1/2pq3p/8/2Q5/4P3/PPR2PPP/2R3K1 w - - 2 22',
            openingVariation: '',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'sacrifice',
              'short'
            ],
            uid: 'DFL3L',
            rating: 960,
            popularity: 95,
            randomNumberQuery: 7449,
            ratingDeviation: 86,
            gameUrl: 'https://lichess.org/irmHfifL#43',
            moves: 'c4c6 d6d1 c1d1 d8d1',
            openingFamily: '\r',
            nbPlays: 1809
          },
          {
            ratingDeviation: 79,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            fen: '6k1/6p1/4R3/8/1P6/P7/2r3rp/4RKB1 w - - 0 43',
            openingVariation: '',
            moves: 'g1h2 c2f2',
            rating: 1189,
            gameUrl: 'https://lichess.org/jcsrRkRk#85',
            openingFamily: '\r',
            uid: '0X753',
            randomNumberQuery: 7451,
            popularity: 93,
            nbPlays: 330
          },
          {
            rating: 1033,
            ratingDeviation: 92,
            gameUrl: 'https://lichess.org/XkJDvaCX#29',
            moves: 'c4d5 c7h2',
            popularity: 100,
            nbPlays: 72,
            openingFamily: 'Caro-Kann_Defense',
            uid: '1RVFB',
            randomNumberQuery: 7452,
            openingVariation: 'Caro-Kann_Defense_Other_variations\r',
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            fen: 'rb2k2r/2q2ppp/p1p1pn2/3p4/Q1PP4/2N1B3/PP3PPP/R4RK1 w kq - 3 15'
          },
          {
            fen: '4brk1/2R4p/1p1Q2p1/3P4/3p4/4q1PP/1B4P1/7K w - - 2 33',
            randomNumberQuery: 7452,
            rating: 1335,
            openingFamily: '\r',
            openingVariation: '',
            uid: '2E7QY',
            popularity: 88,
            nbPlays: 1721,
            moves: 'd6e7 f8f1 h1h2 e3g1',
            ratingDeviation: 75,
            gameUrl: 'https://lichess.org/4MILemTO#65',
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ]
          },
          {
            uid: '2YxRc',
            popularity: 83,
            gameUrl: 'https://lichess.org/Ymj3aEZN#55',
            ratingDeviation: 79,
            nbPlays: 389,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            openingFamily: '\r',
            rating: 1161,
            moves: 'g1h2 d2f4 g2g3 f4f2',
            openingVariation: '',
            randomNumberQuery: 7453,
            fen: '6k1/R4ppp/8/8/1Qp5/2P4P/3q1PP1/4r1K1 w - - 1 28'
          },
          {
            openingFamily: '\r',
            moves: 'c7c8q g2h2 h4g5 h2g3 g5f6 g3f4',
            uid: 'DiXY4',
            openingVariation: '',
            randomNumberQuery: 7454,
            popularity: 100,
            gameUrl: 'https://lichess.org/WSsTVBYV#79',
            ratingDeviation: 76,
            themes: [
              'deflection',
              'endgame',
              'long',
              'mate',
              'mateIn3'
            ],
            rating: 1181,
            fen: '5bk1/p1PQ1p2/1p2p1p1/4P2p/1P3P1K/P5P1/6qP/8 w - - 3 40',
            nbPlays: 170
          },
          {
            fen: 'r4rk1/2p2qbp/p1n1p1p1/1pNb2B1/B2P4/8/PP3PPP/2RQR1K1 w - - 2 18',
            randomNumberQuery: 7456,
            popularity: 96,
            uid: '1Yxj4',
            nbPlays: 3394,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            ratingDeviation: 75,
            openingVariation: 'Modern_Defense_Other_variations\r',
            moves: 'a4b3 f7f2 g1h1 f2g2',
            openingFamily: 'Modern_Defense',
            gameUrl: 'https://lichess.org/60gdFeaC#35',
            rating: 1263
          },
          {
            popularity: 90,
            nbPlays: 1200,
            rating: 1157,
            randomNumberQuery: 7459,
            moves: 'h1g1 e4g2',
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/J1LDEeeJ#57',
            fen: '1R3bk1/p1p4p/6p1/8/p3qn2/P1P5/7P/R2Q3K w - - 0 29',
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            uid: '0DwbX',
            openingVariation: '',
            ratingDeviation: 79
          },
          {
            uid: '27gul',
            rating: 920,
            openingVariation: '',
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/kSO0G8BE#55',
            randomNumberQuery: 7460,
            nbPlays: 3,
            themes: [
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            fen: '2k4r/ppp1q3/3p2P1/4pP1n/3nP2p/3P3B/PPPBr3/R2Q1R1K w - - 10 28',
            ratingDeviation: 236,
            moves: 'f1e1 h5g3 h1g1 d4f3',
            popularity: -60
          },
          {
            randomNumberQuery: 7460,
            openingFamily: '\r',
            moves: 'c1d1 d8d1',
            openingVariation: '',
            popularity: 84,
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            fen: '3r4/k4ppp/1pp1p3/2b5/2B1P3/P4b1P/4N2R/2Rr1K2 w - - 3 26',
            ratingDeviation: 106,
            rating: 890,
            gameUrl: 'https://lichess.org/jTd3TuaV#51',
            uid: '2PRud',
            nbPlays: 77
          },
          {
            openingFamily: '\r',
            popularity: 84,
            openingVariation: '',
            moves: 'h3g4 g3h4',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            ratingDeviation: 81,
            gameUrl: 'https://lichess.org/coz0Wg1u#45',
            uid: '1rqdL',
            fen: '2r1k3/pp4p1/2n2r2/1B1Qp2p/2N3n1/2PP2qP/P4bP1/R1B2R1K w - - 4 23',
            randomNumberQuery: 7462,
            nbPlays: 64,
            rating: 1231
          },
          {
            ratingDeviation: 79,
            rating: 1403,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove',
              'rookEndgame'
            ],
            uid: '2VVVc',
            moves: 'd5d6 h2h1',
            randomNumberQuery: 7462,
            fen: '8/6pk/8/1p1P4/1P5p/3R3P/1r5r/2R2K2 w - - 6 42',
            openingVariation: '',
            gameUrl: 'https://lichess.org/cDSTFwnM#83',
            nbPlays: 211,
            popularity: 100,
            openingFamily: '\r'
          },
          {
            openingVariation: '',
            uid: '20Y6d',
            openingFamily: '\r',
            rating: 1460,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove',
              'queenEndgame'
            ],
            gameUrl: 'https://lichess.org/FQjqFoEj#99',
            moves: 'g2h3 e4h1',
            ratingDeviation: 88,
            popularity: 87,
            fen: '8/2Q2pk1/p7/7p/4q3/6P1/PP4K1/8 w - - 2 50',
            nbPlays: 1829,
            randomNumberQuery: 7463
          },
          {
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'rookEndgame',
              'short'
            ],
            nbPlays: 32,
            openingVariation: '',
            uid: 'Denrk',
            rating: 1163,
            openingFamily: '\r',
            fen: '8/5p1k/6pp/p3q3/8/P7/1PPr1PPP/4R1K1 w - - 0 27',
            moves: 'e1e5 d2d1 e5e1 d1e1',
            popularity: 67,
            ratingDeviation: 143,
            randomNumberQuery: 7463,
            gameUrl: 'https://lichess.org/oLQ3iq8T#53'
          },
          {
            fen: '2bk3r/1pNp1ppp/p2Q4/4p3/4P3/5n2/PPPBB2P/R2K2q1 w - - 5 19',
            uid: 'DpDF3',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove'
            ],
            gameUrl: 'https://lichess.org/qxT9QsOL#37',
            randomNumberQuery: 7463,
            moves: 'd2e1 g1e1',
            rating: 902,
            ratingDeviation: 166,
            nbPlays: 22,
            openingVariation: 'Sicilian_Defense_Lasker-Pelikan_Variation\r',
            openingFamily: 'Sicilian_Defense',
            popularity: 100
          },
          {
            moves: 'g5h6 f2f1 d3d1 f1d1',
            ratingDeviation: 76,
            randomNumberQuery: 7464,
            uid: 'Dv1Xn',
            openingVariation: '',
            popularity: 100,
            fen: '1r4k1/2p3n1/6Qp/p2qp1P1/3pN2P/P2R2R1/1PP2r2/1K6 w - - 0 30',
            rating: 928,
            gameUrl: 'https://lichess.org/EUSOTyyh#59',
            openingFamily: '\r',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'queensideAttack',
              'short'
            ],
            nbPlays: 476
          },
          {
            moves: 'g4f5 c6c1 d2d1 c1d1',
            randomNumberQuery: 7465,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            gameUrl: 'https://lichess.org/uwUv6Hus#59',
            ratingDeviation: 89,
            uid: '1z2WP',
            openingVariation: '',
            fen: '8/5kp1/1pr4p/p2p1p2/3Pb1P1/P6P/1P1R1P1B/6K1 w - - 0 30',
            openingFamily: '\r',
            rating: 1002,
            popularity: 78,
            nbPlays: 29
          },
          {
            moves: 'f4g2 f8f2 g1h2 f2g2',
            uid: '24C9p',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            ratingDeviation: 76,
            randomNumberQuery: 7465,
            fen: '5qk1/1p4p1/pn2R2p/3p3Q/3P1N1P/1P4P1/1r4r1/3R2K1 w - - 3 32',
            openingFamily: '\r',
            openingVariation: '',
            rating: 1181,
            nbPlays: 255,
            popularity: 87,
            gameUrl: 'https://lichess.org/vGYWnBzU#63'
          },
          {
            uid: '2WoS6',
            rating: 1180,
            gameUrl: 'https://lichess.org/fnptNO1g#63',
            popularity: 88,
            randomNumberQuery: 7465,
            openingFamily: '\r',
            ratingDeviation: 100,
            fen: '1r3r1k/p2q3p/2p2Pp1/2p3b1/2Pp1n2/1P1B1PN1/P1Q2B1K/1R3R2 w - - 4 32',
            moves: 'g3e4 d7h3 h2g1 h3g2',
            openingVariation: '',
            themes: [
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            nbPlays: 27
          },
          {
            openingFamily: 'French_Defense',
            rating: 1490,
            openingVariation: 'French_Defense_Advance_Variation\r',
            nbPlays: 6981,
            ratingDeviation: 76,
            uid: '0ZbMc',
            randomNumberQuery: 7466,
            fen: '2k2br1/pbq5/1pn1pp1p/3p4/1PpP4/P1P1B1rP/3N1P1N/R2Q1RK1 w - - 0 19',
            moves: 'f2g3 c7g3 g1h1 g3g2',
            gameUrl: 'https://lichess.org/TO3jIToN#37',
            popularity: 96,
            themes: [
              'fork',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ]
          },
          {
            openingVariation: '',
            moves: 'f6f7 d4d1 h1d1 d8d1',
            ratingDeviation: 86,
            randomNumberQuery: 7467,
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn2',
              'sacrifice',
              'short'
            ],
            uid: '2H6ya',
            openingFamily: '\r',
            nbPlays: 87,
            fen: '2kr4/pp3p2/2p1pQ1p/8/3q3P/8/PPP2PP1/1K5R w - - 0 23',
            popularity: 73,
            rating: 969,
            gameUrl: 'https://lichess.org/snk8py2d#45'
          },
          {
            fen: '5Bk1/1p1r3p/8/p4N2/1nP1p3/1P6/3R1nPP/3R3K w - - 1 38',
            openingFamily: '\r',
            ratingDeviation: 143,
            rating: 1012,
            themes: [
              'backRankMate',
              'endgame',
              'hangingPiece',
              'mate',
              'mateIn2',
              'short'
            ],
            popularity: 58,
            moves: 'd2f2 d7d1 f2f1 d1f1',
            gameUrl: 'https://lichess.org/0fIxumeZ#75',
            nbPlays: 14,
            openingVariation: '',
            randomNumberQuery: 7470,
            uid: '02O9Q'
          },
          {
            nbPlays: 3044,
            randomNumberQuery: 7471,
            popularity: 97,
            ratingDeviation: 75,
            moves: 'c3c2 f5f2 e1d1 c8g4 d3e2 g4e2',
            fen: 'r1b1k3/ppp2Npp/5n2/2b1pq2/8/2QB4/PPnP1PPP/RNB1K2R w KQq - 0 12',
            openingFamily: 'Italian_Game',
            uid: 'DhahG',
            openingVariation: 'Italian_Game_Two_Knights_Defense\r',
            gameUrl: 'https://lichess.org/Lxt3JpaE#23',
            themes: [
              'attackingF2F7',
              'long',
              'mate',
              'mateIn3',
              'middlegame'
            ],
            rating: 1334
          },
          {
            openingFamily: 'Italian_Game',
            popularity: 92,
            gameUrl: 'https://lichess.org/yPoHkpNy#29',
            ratingDeviation: 113,
            nbPlays: 121,
            randomNumberQuery: 7473,
            fen: 'r3r1k1/ppp2ppp/8/3P4/3P2bq/1Q4bP/PP1PBRP1/R1BNK3 w Q - 3 15',
            themes: [
              'mate',
              'mateIn1',
              'middlegame',
              'oneMove',
              'pin'
            ],
            moves: 'h3g4 h4h1',
            openingVariation: 'Italian_Game_Schilling-Kostic_Gambit\r',
            uid: '1kyrg',
            rating: 1443
          },
          {
            rating: 1180,
            uid: 'DFSW2',
            gameUrl: 'https://lichess.org/IiVMsXym#151',
            ratingDeviation: 75,
            themes: [
              'endgame',
              'mate',
              'mateIn2',
              'short'
            ],
            nbPlays: 223,
            openingVariation: '',
            moves: 'f5f2 e2h5 h2g1 h5h1',
            openingFamily: '\r',
            randomNumberQuery: 7474,
            popularity: 83,
            fen: '5Q2/8/k1b4p/5Q2/p7/6P1/4q2K/8 w - - 1 76'
          },
          {
            openingFamily: '\r',
            popularity: 88,
            gameUrl: 'https://lichess.org/HpfISZZI#47',
            openingVariation: '',
            themes: [
              'doubleCheck',
              'kingsideAttack',
              'mate',
              'mateIn2',
              'middlegame',
              'short'
            ],
            fen: 'r6r/1pp2pk1/3p2p1/p3p1Pb/Pn2P3/1BNPP1R1/1PP3R1/7K w - - 4 24',
            ratingDeviation: 80,
            rating: 890,
            uid: '1aNL8',
            nbPlays: 798,
            moves: 'g2f2 h5f3 h1g1 h8h1',
            randomNumberQuery: 7477
          },
          {
            rating: 1096,
            themes: [
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            popularity: 100,
            gameUrl: 'https://lichess.org/c8H5spPh#57',
            uid: 'DdoOr',
            ratingDeviation: 177,
            fen: 'k7/7R/3r2p1/p7/B7/P4P2/1PP1b2P/2K5 w - - 1 29',
            randomNumberQuery: 7477,
            openingVariation: '',
            nbPlays: 34,
            moves: 'f3f4 d6d1',
            openingFamily: '\r'
          },
          {
            randomNumberQuery: 7479,
            moves: 'f1g1 e8e1',
            ratingDeviation: 270,
            openingFamily: '\r',
            gameUrl: 'https://lichess.org/Lb7tINuX#57',
            openingVariation: '',
            themes: [
              'backRankMate',
              'endgame',
              'mate',
              'mateIn1',
              'oneMove'
            ],
            popularity: 82,
            nbPlays: 9,
            rating: 1257,
            uid: 'DNmyG',
            fen: '4r3/1pQ2p1p/k2P4/1b6/8/8/5PPP/5K2 w - - 3 29'
          }
        ]
      }
    ],
    createdAt: 1707343600592
  };
  puzzleToPlay: Puzzle;
  timeTraining = 0;
  timerUnsubscribe$ = new Subject<void>();

  timeLeftBlock = 0;
  timerUnsubscribeBlock$ = new Subject<void>();
  countPuzzlesPlayedBlock = 0;
  totalPuzzlesInBlock = 0;

  showEndPlan = true;
  forceStopTimerInPuzzleBoard = false;

  constructor(
    private planService: PlanService,
    private navController: NavController,
    private profileService: ProfileService,
    private modalController: ModalController,
    private appService: AppService,
    private soundsService: SoundsService
  ) {
  }

  ngOnInit() {
    // this.planService.getPlan().then((plan: Plan) => {
    //   console.log('Plan', plan);
    //   if (!plan) {
    //     this.navController.navigateRoot('/puzzles/training-menu');
    //     return;
    //   }
    //   this.plan = plan;
    //   this.playPlan();
    //   this.playNextBlock();
    // });
  }

  playNextBlock() {
    this.currentIndexBlock++;

    // se valida si se ha llegado al final del plan
    console.log('currentIndexBlock ', this.currentIndexBlock, ' plan.blocks.length ', this.plan.blocks.length);


    if (this.currentIndexBlock === this.plan.blocks.length) {
      this.endPlan();
      return;
    }

    this.totalPuzzlesInBlock = this.plan.blocks[this.currentIndexBlock].puzzlesCount;



    this.countPuzzlesPlayedBlock = 0;
    this.showBlockTimer = false;
    this.pausePlanTimer();
    this.showBlockPresentation();
  }

  async showBlockPresentation() {

    this.forceStopTimerInPuzzleBoard = true;
    this.pauseBlockTimer();

    this.totalPuzzlesInBlock = this.plan.blocks[this.currentIndexBlock].puzzlesCount;

    const themeName = this.plan.blocks[this.currentIndexBlock].themes[0];

    const theme = themeName ?
      this.appService.getThemePuzzleByValue(themeName).nameEs :
      this.plan.blocks[this.currentIndexBlock].openingFamily;

    const title = this.plan.blocks[this.currentIndexBlock].title ?
      this.plan.blocks[this.currentIndexBlock].title :
      theme;

    let image = 'assets/images/puzzle-themes/opening.svg';
    if (themeName) {
      // si el tema es mateIn1, mateIn2, mateIn3, mateIn4, mateIn5, mateIn6, mateIn7, mateIn8, etc se debe mostrar el tema mate
      if (themeName.includes('mateIn')) {
        image = 'assets/images/puzzle-themes/mate.svg';
      } else {
        image = `assets/images/puzzle-themes/${themeName}.svg`;
      }
    }

    const modal = await this.modalController.create({
      component: BlockPresentationComponent,
      componentProps: {
        title,
        description: this.plan.blocks[this.currentIndexBlock].description || this.appService.getThemePuzzleByValue(themeName).descriptionEs,
        image,
      }
    });

    await modal.present();

    modal.onDidDismiss().then((data) => {
      this.selectPuzzleToPlay();
      if (this.plan.blocks[this.currentIndexBlock].time !== -1) {
        this.showBlockTimer = true;
        this.initTimeToEndBlock(this.plan.blocks[this.currentIndexBlock].time);
      } else {
        this.showBlockTimer = false;
        this.stopBlockTimer();
      }
      this.forceStopTimerInPuzzleBoard = false;
    });


  }


  selectPuzzleToPlay() {

    // se valida si el bloque es por cantidad de puzzles y si ya se jugaron todos
    if (this.plan.blocks[this.currentIndexBlock].puzzlesCount !== 0 &&
      this.countPuzzlesPlayedBlock === this.plan.blocks[this.currentIndexBlock].puzzlesCount) {
      this.playNextBlock();
      return;
    }

    const puzzle = {
      ...this.plan.blocks[this.currentIndexBlock].puzzles.find(puzzleItem =>
        !this.plan.blocks[this.currentIndexBlock]?.puzzlesPlayed?.find(puzzlePlayed => puzzlePlayed.uidPuzzle === puzzleItem.uid))
    };

    if (this.plan.blocks[this.currentIndexBlock].goshPuzzleTime) {
      puzzle.goshPuzzleTime = this.plan.blocks[this.currentIndexBlock].goshPuzzleTime;
    }
    if (this.plan.blocks[this.currentIndexBlock].puzzleTimes) {
      puzzle.times = this.plan.blocks[this.currentIndexBlock].puzzleTimes;
    }

    this.puzzleToPlay = puzzle;
  }

  // init countDown
  playPlan() {

    const countDown = interval(1000);
    countDown.pipe(
      takeUntil(this.timerUnsubscribe$)
    ).subscribe(() => {
      this.timeTraining++;
    });
  }

  initTimeToEndBlock(timeBlock: number) {
    this.timeLeftBlock = timeBlock;
    this.timerUnsubscribeBlock$ = new Subject<void>();
    const countDown = interval(1000);
    countDown.pipe(
      takeUntil(this.timerUnsubscribeBlock$)
    ).subscribe(() => {
      if (this.timeLeftBlock > 0) {
        this.timeLeftBlock--;
      } else {
        // unsubscribe
        this.stopBlockTimer();
        this.playNextBlock();
      }
    });
  }


  endPlan() {
    console.log('Plan finalizado ', JSON.stringify(this.plan));
    this.showEndPlan = true;
  }

  pauseBlockTimer() {
    this.timerUnsubscribeBlock$.next();
  }

  resumeBlockTimer() {
    this.initTimeToEndBlock(this.timeLeftBlock);
  }

  stopBlockTimer() {
    this.timerUnsubscribeBlock$.next();
    this.timerUnsubscribeBlock$.complete();
  }

  pausePlanTimer() {

    this.timerUnsubscribe$.next();

  }



  stopPlanTimer() {
    this.stopBlockTimer();
    this.showEndPlan = true;
    this.timerUnsubscribe$.next();
    this.timerUnsubscribe$.complete();
  }

  onPuzzleCompleted(puzzleCompleted: Puzzle, puzzleStatus: 'good' | 'bad' | 'timeOut') {

    this.countPuzzlesPlayedBlock++;

    const userPuzzle: UserPuzzle = {
      uid: createUid(),
      uidUser: this.profileService.getProfile?.uid,
      uidPuzzle: puzzleCompleted.uid,
      date: new Date().getTime(),
      resolved: puzzleStatus === 'good',
      resolvedTime: puzzleCompleted.timeUsed,
      currentEloUser: this.profileService.getProfile?.elo || 0,
      eloPuzzle: puzzleCompleted.rating,
      themes: puzzleCompleted.themes,
      openingFamily: puzzleCompleted.openingFamily,
      openingVariation: puzzleCompleted.openingVariation,
      fenPuzzle: puzzleCompleted.fen
    };


    // Crear una copia del bloque actual
    const currentBlock = {
      ...this.plan.blocks[this.currentIndexBlock],
      puzzlesPlayed: [...this.plan.blocks[this.currentIndexBlock].puzzlesPlayed, userPuzzle]
    };

    // Crear una nueva copia de todos los bloques
    const newBlocks = [...this.plan.blocks];
    // Reemplazar el bloque actual con la copia actualizada
    newBlocks[this.currentIndexBlock] = currentBlock;

    // Ahora actualizar el plan con los nuevos bloques
    this.plan = {
      ...this.plan,
      blocks: newBlocks
    };

    switch (puzzleStatus) {
      case 'good':
        this.soundsService.playGood();
        break;
      case 'bad':
        this.soundsService.playError();
        break;
      case 'timeOut':
        this.soundsService.playLowTime();
        break;
    }
    this.selectPuzzleToPlay();

  }

}
