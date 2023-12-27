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

      switch (option) {
        case 0: // Calentamiento / un mismo color
          //  2 minutos de mates en 1 (elo - 500) / tiempo por puzzle = 10 segundos
          //  1 minuto de mates en 2 / tiempo por puzzle = 10 segundos
          // 1 ejercicio de mate
          const color0 = Math.random() > 0.5 ? 'white' : 'black';
          const mateIn1Elo0 = profile?.elos?.warmup['mateIn1'];
          const mateIn2Elo0 = profile?.elos?.warmup['mateIn2'];
          const mateElo0 = profile?.elos?.warmup['mate'];

          const blocks0: Block[] = [
            {
              time: 120,
              puzzlesCount: 0,
              themes: ['mateIn1'],
              eloStart: mateIn1Elo0 ? mateIn1Elo0 - 600 : defaultEloStart - 600,
              eloEnd: mateIn1Elo0 ? mateIn1Elo0 - 500 : defaultElo - 500,
              color: color0,
              puzzleTimes: {
                warningOn: 6,
                dangerOn: 3,
                total: 10
              },
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
              nextPuzzleImmediately: true
            },
            {
              time: -1,
              puzzlesCount: 1,
              themes: ['mate'],
              eloStart: mateElo0 ? mateElo0 : defaultEloStart,
              eloEnd: (mateElo0 ?? defaultElo),
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
          ];
          if (!themeRandom5) {
            reject('No se pudo obtener el tema random themeRandom5');
          }
          // se busca el elo del usuario según el string del temaRandom5
          const themeRandomElo5 = profile?.elos?.plan5[themeRandom5];
          // se elige el elo mas bajo que el usuario tenga en el plan5, sino se asigna el elo por defecto
          let weakness5 = this.profileService.getWeaknessTheme(profile?.elos?.plan5);
          if (!weakness5) {
            weakness5 = this.appService.getThemesPuzzlesList[
              Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
            ];
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
              nextPuzzleImmediately: true
            }
          ];
          break;
        case 10:

          /** No Muestra soluciones / un mismo color
           * - tema random || debilidades = t 2 minutos / 15 segundos por puzzle (elo - 100)
           * - apertura random || apertura débil = t 2 minutos / 30 segundos por puzzle
           * - misma apertura + mismo tema random = t 3 minutos / 60 segundos por puzzle
           * - mismo tema random = t 1 minuto / 20 segundos por puzzle
           * - misma apertura + finales = t 2 minutos / 60 segundos por puzzle
           */
          const color10 = Math.random() > 0.5 ? 'white' : 'black';
          // obtener el tema random , asignando una posición aleatoria de un array
          const themeRandom10 = this.appService.getThemesPuzzlesList[
            Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
          ];
          if (!themeRandom10) {
            reject('No se pudo obtener el tema random themeRandom10');
          }
          // se busca el elo del usuario según el string del themeRandom10
          const themeRandomElo10 = profile?.elos?.plan5[themeRandom10];
          // se elige el elo mas bajo que el usuario tenga en el plan10, sino se asigna el elo por defecto
          let weakness10 = this.profileService.getWeaknessTheme(profile?.elos?.plan10);
          if (!weakness10) {
            weakness10 = this.appService.getThemesPuzzlesList[
              Math.floor(Math.random() * this.appService.getThemesPuzzlesList.length)
            ];
          }
          break;
        case 20:
          /** Muestra soluciones / cambio de color
           * - debilidades = t 3 minutos / 40 segundos por puzzle (elo - 500)
           * - tema random = t 5 minutos / 3 minutos por puzzle
           * - mate en 1 = t 2 minutos / 30 segundos por puzzle
           * - mismo tema random = t 2 minutos / 50 segundos por puzzle (elo - 300)
           * - mismo tema random = t 2 minuto / 50 segundos por puzzle (elo + 200)
           * - mismo tema random = t 1 minuto / 15 segundos por puzzle (elo - 800)
           *    ||  mismo tema random a ciegas 10 segundos = t 1 minuto / 60 segundos por puzzle
           * - finales = t 3 minutos / 60 segundos por puzzle
           * - mate 3 = t 2 minutos / 60 segundos por puzzle
           * */

          break;
        case 30:
          /** Muestra soluciones / un mismo color
           * - debilidades = t 5 minutos / 60 segundos por puzzle (elo - 200)
           * - apertura random = t 2 minutos / 30 segundos por puzzle
           * - tema random = t 5 minutos / 3 minutos por puzzle
           * - mismo tema random  a ciegas 15 segundos = t 5 minutos / 50 segundos por puzzle (elo - 300)
           * - finales = t 5 minutos / 60 segundos por puzzle
           * - finales de peones = t 5 minutos / 3 minutos por puzzle
           * - mate 4 o mas = t 2 minutos / 60 segundos por puzzle
           * */

          break;
        case -1:
          /**
           * Muestra soluciones / un mismo color
           * Vuelta a la calma
           * - 3 ejercicios de mates (elo : de 800 a 1000)
           * - 3 ejercicios de mates en 2 (elo : de 800 a 1000)
           * - 3 ejercicios de mates en 1 (elo : de 800 a 1000)
           */
          break;
        default:
          break;
      }

    });
  }



}
