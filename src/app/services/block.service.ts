/* eslint-disable @typescript-eslint/dot-notation */
import { Injectable } from '@angular/core';

import { Puzzle, PuzzleQueryOptions } from '../models/puzzle.model';
import { Block } from '../models/plan.model';
import { Profile } from '@models/profile.model';

import { PuzzlesService } from '@services/puzzles.service';
import { ProfileService } from '@services/profile.service';
import { AppService } from '@services/app.service';

@Injectable({
  providedIn: 'root'
})
export class BlockService {


  constructor(
    private puzzlesService: PuzzlesService,
    private profileService: ProfileService,
    private appService: AppService
  ) { }

  async generateBlockOfPuzzles(blockSettings: Block): Promise<Puzzle[]> {

    console.log('Block settings', blockSettings);


    const options: PuzzleQueryOptions = {
      rangeStart: blockSettings.eloStart,
      rangeEnd: blockSettings.eloEnd,
      themes: blockSettings.themes,
      openingFamily: blockSettings.openingFamily
    };

    if (blockSettings.color !== 'random') {
      options.color = blockSettings.color === 'white' ? 'w' : 'b';
    }

    const puzzlesToAdd: Puzzle[] = await this.puzzlesService.loadMorePuzzles(-1, options, 'return');

    let puzzles: Puzzle[] = [];

    if (blockSettings.puzzles) {
      puzzles = [...blockSettings.puzzles, ...puzzlesToAdd];
    } else {
      puzzles = puzzlesToAdd;
    }

    return puzzles;

  }

  async generateBlocksForPlan(option: number): Promise<Block[]> {

    return new Promise((resolve, reject) => {

      const profile: Profile = this.profileService.getProfile;
      const defaultEloStart = 800;
      const defaultElo = 1500;

      // Nota: si el tiempo del puzzle es mayor que el tiempo del bloque, el tiempo restante
      // para el puzzle se convierte en el tiempo restante del bloque
      // TODO: Validar que ningún elo sea menor que 800 o mayor que 3000
      switch (option) {
        case 0: // Calentamiento / un mismo color
          //  2 minutos de mates en 1 (elo - 500) / tiempo por puzzle = 10 segundos
          //  1 minuto de mates en 2 / tiempo por puzzle = 10 segundos
          // 1 ejercicio de mate
          const color0 = Math.random() > 0.5 ? 'white' : 'black';
          const mateIn1Elo0 = profile?.elos?.warmup ? profile?.elos?.warmup['mateIn1'] : undefined;
          const mateIn2Elo0 = profile?.elos?.warmup ? profile?.elos?.warmup['mateIn2'] : undefined;
          const mateElo0 = profile?.elos?.warmup ? profile?.elos?.warmup['mate'] : undefined;

          const blocks0: Block[] = [
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn1'],
              eloStart: defaultEloStart,
              eloEnd: mateIn1Elo0 && (mateIn1Elo0 - 500 > 1500) ? mateIn1Elo0 - 500 : defaultElo,
              color: color0,
              puzzleTimes: {
                warningOn: 6,
                dangerOn: 3,
                total: 10
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn2'],
              eloStart: mateIn2Elo0 ? mateIn2Elo0 - 100 : defaultEloStart,
              eloEnd: (mateIn2Elo0 ?? defaultElo),
              color: color0,
              puzzleTimes: {
                warningOn: 6,
                dangerOn: 3,
                total: 10
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: -1,
              puzzlesCount: 1,
              themes: ['mate'],
              eloStart: mateElo0 ? mateElo0 - 100 : defaultEloStart,
              eloEnd: (mateElo0 ?? defaultElo),
              puzzlesPlayed: [],
              color: color0
            }
          ];
          resolve(blocks0);
          break;
        case 5:
          /* No Muestra soluciones / un mismo color
              - tema random = t 2.5 minutos / 15 segundos por puzzle
              - tema debilidades (elo - 200) = t 2.5 minutos / 30 segundos por puzzle
          */
          const color5 = Math.random() > 0.5 ? 'white' : 'black';
          // obtener el tema random , asignando una posición aleatoria de un array
          const themeRandom5 = this.appService.getThemesPuzzlesList[
            Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
          ].value;
          if (!themeRandom5) {
            reject('No se pudo obtener el tema random themeRandom5');
          }
          // se busca el elo del usuario según el string del temaRandom5
          const themeRandomElo5 = profile?.elos?.plan5 ? profile?.elos?.plan5[themeRandom5] : undefined;
          // se elige el elo mas bajo que el usuario tenga en el plan5, sino se asigna el elo por defecto
          let weakness5 = this.profileService.getWeakness(profile?.elos?.plan5);
          if (!weakness5) {
            weakness5 = this.appService.getThemesPuzzlesList[
              Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
            ].value;
          }
          const block5: Block[] = [
            {
              time: 150,
              puzzlesCount: 0,
              themes: [themeRandom5],
              eloStart: themeRandomElo5 ? themeRandomElo5 - 100 : defaultEloStart,
              eloEnd: themeRandomElo5 ? themeRandomElo5 + 100 : defaultElo + 100,
              color: color5,
              puzzleTimes: {
                warningOn: 12,
                dangerOn: 6,
                total: 15
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: 150,
              puzzlesCount: 0,
              themes: [weakness5],
              eloStart: profile?.elos?.plan5[weakness5] ? profile?.elos?.plan5[weakness5] - 200 : defaultEloStart,
              eloEnd: (profile?.elos?.plan5[weakness5] ?? defaultElo) - 200,
              color: color5,
              puzzleTimes: {
                warningOn: 24,
                dangerOn: 12,
                total: 30
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            }
          ];
          resolve(block5);
          break;
        case 10:

          /** No Muestra soluciones / un mismo color
           * - tema random || debilidades = t 2 minutos / 15 segundos por puzzle (elo - 100)
           * - apertura random || apertura débil = t 2 minutos / 30 segundos por puzzle
           * - misma apertura + mismo tema  = t 3 minutos / 60 segundos por puzzle
           * - mismo tema = t 1 minuto / 20 segundos por puzzle
           * - misma apertura + finales = t 2 minutos / 60 segundos por puzzle
           */
          const color10 = Math.random() > 0.5 ? 'white' : 'black';

          let theme10: string;
          let opening10: string;
          if (Math.random() < 0.5) { // tema random o debilidad
            // tema random
            theme10 = this.getRandomTheme();
            if (!theme10) {
              reject('No se pudo obtener el tema random theme10');
            }

          } else {
            // tema debilidad
            theme10 = this.getWeaknessInPlan(profile?.elos?.plan10);
          }
          // se busca el elo del usuario según el string del theme10
          const eloTheme10 = profile?.elos?.plan10 ? profile.elos.plan10[theme10] : undefined;
          if (Math.random() < 0.5) { // apertura random o debilidad
            // apertura random
            opening10 = this.getRandomOpening();
            if (!opening10) {
              reject('No se pudo obtener la apertura random opening10');
            }

          } else {
            // se elige la apertura con el elo mas bajo que el usuario tenga en el plan10,
            opening10 = this.getWeaknessInPlanOpenings(profile?.elos?.plan10Openings);
          }
          // se busca el elo del usuario según el string de la opening10
          const eloOpening10 = profile?.elos?.plan10Openings ? profile?.elos?.plan10Openings[opening10] : undefined;

          const block10: Block[] = [
            {
              time: 120,
              puzzlesCount: 0,
              themes: [theme10],
              eloStart: eloTheme10 ? eloTheme10 - 100 : defaultEloStart,
              eloEnd: eloTheme10 ? eloTheme10 + 100 : defaultElo + 100,
              color: color10,
              puzzleTimes: {
                warningOn: 12,
                dangerOn: 6,
                total: 15
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: [],
              openingFamily: opening10,
              eloStart: eloOpening10 ? eloOpening10 : defaultEloStart,
              eloEnd: eloOpening10 ? eloOpening10 : defaultElo,
              color: color10,
              puzzleTimes: {
                warningOn: 15,
                dangerOn: 8,
                total: 30
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: 180,
              puzzlesCount: 0,
              themes: [theme10],
              openingFamily: opening10,
              eloStart: eloTheme10 ? eloTheme10 : defaultEloStart,
              eloEnd: eloTheme10 ? eloTheme10 : defaultElo,
              color: color10,
              puzzleTimes: {
                warningOn: 30,
                dangerOn: 15,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: 60,
              puzzlesCount: 0,
              themes: [theme10],
              eloStart: eloTheme10 ? eloTheme10 : defaultEloStart,
              eloEnd: eloTheme10 ? eloTheme10 : defaultElo,
              color: color10,
              puzzleTimes: {
                warningOn: 12,
                dangerOn: 6,
                total: 20
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['endgame'],
              openingFamily: opening10,
              eloStart: eloTheme10 ? eloTheme10 : defaultEloStart,
              eloEnd: eloTheme10 ? eloTheme10 : defaultElo,
              color: color10,
              puzzleTimes: {
                warningOn: 30,
                dangerOn: 15,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            }
          ];

          resolve(block10);
          break;
        case 20:
          /** Muestra soluciones / cambio de color
           * -  debilidades = t 3 minutos / 40 segundos por puzzle (elo - 500)
           * -  tema random = t 5 minutos / 3 minutos por puzzle
           * -  mate en 1 = t 2 minutos / 10 segundos por puzzle
           * -  mismo tema random = t 2 minutos / 50 segundos por puzzle (elo - 300)
           * -  mismo tema random = t 2 minuto / 50 segundos por puzzle (elo + 200)
           * - mismo tema random = t 1 minuto / 15 segundos por puzzle (elo - 800)
           *    ||  mismo tema random a ciegas 10 segundos = t 1 minuto / 60 segundos por puzzle
           * - finales = t 3 minutos / 60 segundos por puzzle
           * - mate 3 = t 2 minutos / 60 segundos por puzzle
           * */

          const theme20Random = this.getRandomTheme();
          const themeWeakness20 = this.getWeaknessInPlan(profile?.elos?.plan20);
          const eloThemeWeakness20 = profile?.elos?.plan20 ? profile?.elos?.plan20[themeWeakness20] : undefined;
          const eloTheme20Random = profile?.elos?.plan20 ? profile?.elos?.plan20[theme20Random] : undefined;
          const eloMateIn120 = profile?.elos?.plan20 ? profile?.elos?.plan20['mateIn1'] : undefined;
          const eloEndgame20 = profile?.elos?.plan20 ? profile?.elos?.plan20['endgame'] : undefined;
          const eloMateIn320 = profile?.elos?.plan20 ? profile?.elos?.plan20['mateIn3'] : undefined;

          let randomBlockOrBlind: Block;

          if (Math.random() < 0.5 ? true : false) {
            // tema a ciegas
            randomBlockOrBlind = {
              time: 60,
              puzzlesCount: 0,
              themes: [theme20Random],
              eloStart: eloTheme20Random ? eloTheme20Random - 800 : defaultElo - 800,
              eloEnd: eloTheme20Random ? eloTheme20Random - 700 : defaultElo - 700,
              color: 'random',
              puzzleTimes: {
                warningOn: 8,
                dangerOn: 5,
                total: 15
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true
            };

          } else {
            randomBlockOrBlind = {
              time: 60,
              puzzlesCount: 0,
              themes: [theme20Random],
              eloStart: eloTheme20Random ? eloTheme20Random - 800 : defaultElo - 800,
              eloEnd: eloTheme20Random ? eloTheme20Random - 700 : defaultElo - 700,
              color: 'random',
              puzzleTimes: {
                warningOn: 24,
                dangerOn: 12,
                total: 60
              },
              goshPuzzle: true,
              goshPuzzleTime: 10,
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            };
          }


          const block20: Block[] = [
            {
              time: 180,
              puzzlesCount: 0,
              themes: [themeWeakness20],
              eloStart: eloThemeWeakness20 ? eloThemeWeakness20 - 600 : defaultEloStart,
              eloEnd: eloThemeWeakness20 ? eloThemeWeakness20 - 500 : defaultElo + 100,
              color: 'random',
              puzzleTimes: {
                warningOn: 24,
                dangerOn: 12,
                total: 40
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 300,
              puzzlesCount: 0,
              themes: [theme20Random],
              eloStart: eloTheme20Random ? eloTheme20Random : defaultElo,
              eloEnd: eloTheme20Random ? eloTheme20Random + 100 : defaultElo + 100,
              color: 'random',
              puzzleTimes: {
                warningOn: 50,
                dangerOn: 20,
                total: 240
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn1'],
              eloStart: eloMateIn120 ? eloMateIn120 : defaultElo,
              eloEnd: eloMateIn120 ? eloMateIn120 + 100 : defaultElo + 100,
              color: 'random',
              puzzleTimes: {
                warningOn: 6,
                dangerOn: 3,
                total: 10
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: [theme20Random],
              eloStart: eloTheme20Random ? eloTheme20Random - 400 : defaultEloStart,
              eloEnd: eloTheme20Random ? eloTheme20Random - 300 : defaultElo,
              color: 'random',
              puzzleTimes: {
                warningOn: 24,
                dangerOn: 12,
                total: 50
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            randomBlockOrBlind,
            {
              time: 180,
              puzzlesCount: 0,
              themes: ['endgame'],
              eloStart: eloEndgame20 ? eloEndgame20 : defaultElo,
              eloEnd: eloEndgame20 ? eloEndgame20 + 100 : defaultElo + 100,
              color: 'random',
              puzzleTimes: {
                warningOn: 24,
                dangerOn: 12,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn3'],
              eloStart: eloMateIn320 ? eloMateIn320 : defaultElo,
              eloEnd: eloMateIn320 ? eloMateIn320 : defaultElo + 100,
              color: 'random',
              puzzleTimes: {
                warningOn: 24,
                dangerOn: 12,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
          ];

          resolve(block20);


          break;
        case 30:
          /** Muestra soluciones / un mismo color
           * -  debilidades = t 5 minutos / 60 segundos por puzzle (elo - 200)
           * -   apertura random = t 2 minutos / 30 segundos por puzzle
           * -  tema random = t 5 minutos / 3 minutos por puzzle
           * -  mismo tema random  a ciegas 15 segundos = t 5 minutos / 50 segundos por puzzle (elo - 300)
           * -  finales = t 5 minutos / 60 segundos por puzzle
           * - finales de peones = t 5 minutos / 3 minutos por puzzle
           * - mate 4 o mas = t 2 minutos / 60 segundos por puzzle
           * */

          const color30 = Math.random() > 0.5 ? 'white' : 'black';
          const themeWeakness30 = this.getWeaknessInPlan(profile?.elos?.plan30);
          console.log('themeWeakness30', themeWeakness30);
          console.log('profile?.elos?.plan30', profile?.elos?.plan30);


          const eloThemeWeakness30 = profile?.elos?.plan30 ? profile?.elos?.plan30[themeWeakness30] : undefined;
          const theme30Random = this.getRandomTheme();
          const eloTheme30Random = profile?.elos?.plan30 ? profile?.elos?.plan30[theme30Random] : undefined;
          const opening30Random = this.getRandomOpening();
          const eloOpening30Random = profile?.elos?.plan30Openings ? profile?.elos?.plan30Openings[opening30Random] : undefined;
          const eloEndgame30 = profile?.elos?.plan30 ? profile?.elos?.plan30['endgame'] : undefined;
          const eloPawnEndgame30 = profile?.elos?.plan30 ? profile?.elos?.plan30['pawnEndgame'] : undefined;
          const eloMateIn430 = profile?.elos?.plan30 ? profile?.elos?.plan30['mateIn4'] : undefined;

          const block30: Block[] = [
            {
              time: 300,
              puzzlesCount: 0,
              themes: [themeWeakness30],
              eloStart: eloThemeWeakness30 ? eloThemeWeakness30 - 300 : defaultElo - 300,
              eloEnd: eloThemeWeakness30 ? eloThemeWeakness30 - 200 : defaultElo - 200,
              color: color30,
              puzzleTimes: {
                warningOn: 40,
                dangerOn: 20,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: [],
              openingFamily: opening30Random,
              eloStart: eloOpening30Random ? eloOpening30Random : defaultElo,
              eloEnd: eloOpening30Random ? eloOpening30Random + 100 : defaultElo + 100,
              color: color30,
              puzzleTimes: {
                warningOn: 15,
                dangerOn: 8,
                total: 30
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 300,
              puzzlesCount: 0,
              themes: [theme30Random],
              eloStart: eloTheme30Random ? eloTheme30Random : defaultElo,
              eloEnd: eloTheme30Random ? eloTheme30Random + 100 : defaultElo + 100,
              color: color30,
              puzzleTimes: {
                warningOn: 50,
                dangerOn: 20,
                total: 180
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 300,
              puzzlesCount: 0,
              themes: [theme30Random],
              eloStart: eloTheme30Random ? eloTheme30Random - 300 : defaultElo - 300,
              eloEnd: eloTheme30Random ? eloTheme30Random - 200 : defaultElo - 200,
              color: color30,
              puzzleTimes: {
                warningOn: 20,
                dangerOn: 10,
                total: 50
              },
              goshPuzzle: true,
              goshPuzzleTime: 15,
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 300,
              puzzlesCount: 0,
              themes: ['endgame'],
              eloStart: eloEndgame30 ? eloEndgame30 : defaultElo,
              eloEnd: eloEndgame30 ? eloEndgame30 + 100 : defaultElo + 100,
              color: color30,
              puzzleTimes: {
                warningOn: 20,
                dangerOn: 10,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 300,
              puzzlesCount: 0,
              themes: ['pawnEndgame'],
              eloStart: eloPawnEndgame30 ? eloPawnEndgame30 : defaultElo,
              eloEnd: eloPawnEndgame30 ? eloPawnEndgame30 + 100 : defaultElo + 100,
              color: color30,
              puzzleTimes: {
                warningOn: 20,
                dangerOn: 10,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn4'],
              eloStart: eloMateIn430 ? eloMateIn430 : defaultElo,
              eloEnd: eloMateIn430 ? eloMateIn430 + 100 : defaultElo + 100,
              color: color30,
              puzzleTimes: {
                warningOn: 20,
                dangerOn: 10,
                total: 60
              },
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },

          ];

          resolve(block30);


          break;
        case -1:
          /**
           * Muestra soluciones / un mismo color
           * Vuelta a la calma
           * - 3 ejercicios de mates (elo : de 800 a 1000)
           * - 3 ejercicios de mates en 2 (elo : de 800 a 1000)
           * - 3 ejercicios de mates en 1 (elo : de 800 a 1000)
           */

          const colorBackToCalm = Math.random() > 0.5 ? 'white' : 'black';

          const blockBackToCalm: Block[] = [
            {
              time: -1,
              puzzlesCount: 3,
              themes: ['mate'],
              eloStart: 800,
              eloEnd: 1000,
              color: colorBackToCalm,
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: -1,
              puzzlesCount: 3,
              themes: ['mateIn2'],
              eloStart: 800,
              eloEnd: 1000,
              color: colorBackToCalm,
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            },
            {
              time: -1,
              puzzlesCount: 3,
              themes: ['mateIn1'],
              eloStart: 800,
              eloEnd: 1000,
              color: colorBackToCalm,
              puzzlesPlayed: [],
              nextPuzzleImmediately: true,
              showPuzzleSolution: true
            }
          ];

          resolve(blockBackToCalm);

          break;
      }

    });
  }

  /**
   * Obtiene un tema random de la lista de temas
   * */
  getRandomTheme(): string {
    return this.appService.getThemesPuzzlesList[
      Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
    ].value;
  }

  /**
   * Obtiene una apertura random de la lista de aperturas
   * */
  getRandomOpening(): string {
    return this.appService.getOpeningsList[
      Math.floor(Math.random() * this.appService.getOpeningsList.length)
    ].name;
  }

  /**
   * Obtiene el tema debil del usuario
   * según el plan que se le pase
   *
   * */
  getWeaknessInPlan(plan: {
    [key: string]: number;
  }): string {
    // se elige el tema con el elo mas bajo que el usuario tenga en el plan,
    // sino elige un tema random de la lista de temas
    let theme = this.profileService.getWeakness(plan);
    if (!theme) {
      theme = this.appService.getThemesPuzzlesList[
        Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
      ].value;
    }

    return theme;
  }

  /**
   * Obtiene la apertura débil del usuario
   * según el plan que se le pase
   * */
  getWeaknessInPlanOpenings(plan: {
    [key: string]: number;
  }): string {
    // se elige la apertura con el elo mas bajo que el usuario tenga en el plan,
    // sino elige una apertura random de la lista de aperturas
    let opening = this.profileService.getWeakness(plan);
    if (!opening) {
      opening = this.appService.getOpeningsList[
        Math.floor(Math.random() * this.appService.getOpeningsList.length)
      ].name;
    }

    return opening;
  }





}
