import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { lastValueFrom, take } from 'rxjs';

import { AppPuzzlesThemes, AppPuzzleThemesGroup } from '@models/app.models';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  themesPuzzle: AppPuzzleThemesGroup[] = [];


  constructor(
    private httpClient: HttpClient,
  ) { }

  get getThemesPuzzle() {
    return this.themesPuzzle;
  }

  async loadThemesPuzzle() {
    const request$ = this.httpClient.get<AppPuzzleThemesGroup[]>('assets/data/themes-puzzle.json')
      .pipe(take(1));
    this.themesPuzzle = await lastValueFrom<AppPuzzleThemesGroup[]>(request$);

  }



  logWaring(message: string, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  logError(message: string, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }
}
