import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, take } from 'rxjs';

import {
  Opening,
  AppPuzzlesThemes,
  AppPuzzleThemesGroup
} from '@models/app.models';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  themesPuzzle: AppPuzzleThemesGroup[] = [];
  themesPuzzlesList: AppPuzzlesThemes[] = [];

  openingsList: Opening[] = [];


  constructor(
    private httpClient: HttpClient,
  ) { }

  get getThemesPuzzle() {
    return this.themesPuzzle;
  }

  get getThemesPuzzlesList() {
    return this.themesPuzzlesList;
  }

  get getOpeningsList() {
    return this.openingsList;
  }

  getThemePuzzleByValue(value: string) {
    const theme = this.themesPuzzlesList.find(themeItem => themeItem.value === value);
    if (!theme) {
      this.logError('No se encontró el tema', value);
    }
    return theme;
  }

  async loadThemesPuzzle() {
    const request$ = this.httpClient.get<AppPuzzleThemesGroup[]>('assets/data/themes-puzzle.json')
      .pipe(take(1));
    this.themesPuzzle = await lastValueFrom<AppPuzzleThemesGroup[]>(request$);

    this.themesPuzzlesList = this.themesPuzzle.reduce((acc, themeGroup) =>
      [...acc, ...themeGroup.themes], []);



  }

  async loadOpenings() {
    const request$ = this.httpClient.get<Opening[]>('assets/data/openings.json')
      .pipe(take(1));
    this.openingsList = await lastValueFrom<Opening[]>(request$);

    let t = [];
    for (const iterator of this.openingsList) {
      t.push(iterator.value);
    }
    console.log('openings ', JSON.stringify(t));
  }

  getOpeningByValue(value: string) {
    const opening = this.openingsList.find(openingItem => openingItem.value === value) || {} as Opening;
    return opening;
  }



  logWaring(message: string, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  logError(message: string, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }
}
