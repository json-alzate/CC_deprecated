import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AppService {


  piecesStyles: string[] = ['default', 'fantasy', 'staunty'];
  piecesStyleSelected: string;


  private baseUrl = '/assets/images/pieces/';

  constructor() {
    this.changeTheme('fantasy');
  }

  get piecesPath() {
    return `${this.baseUrl}${this.piecesStyleSelected}/`;
  }

  get pieces() {
    return `${this.piecesPath}${this.piecesStyleSelected}.svg`;
  }

  changeTheme(name: string) {
    const theme = this.piecesStyles.find(t => t === name);
    if (theme) {
      this.piecesStyleSelected = theme;
    }
  }


  logWaring(message: string, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  logError(message: string, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }
}
