import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AppService {



  private boardStyles = [
    {
      name: 'default',
      colorsSquares: {
        light: '#ecdab9',
        dark: '#c5a076'
      }
    },
    {
      name: 'default-contrast',
      colorsSquares: {
        light: '#ecdab9',
        dark: '#c5a076'
      }
    },
    {
      name: 'blue',
      colorsSquares: {
        light: '#d8ecfb',
        dark: '#86afcf'
      }
    },
    {
      name: 'green',
      colorsSquares: {
        light: '#E0DDCC',
        dark: '#4c946a'
      }
    },
    {
      name: 'chess-club',
      colorsSquares: {
        light: '#E6D3B1',
        dark: '#AF6B3F'
      }
    },
    {
      name: 'chessboard-js',
      colorsSquares: {
        light: '#f0d9b5',
        dark: '#b58863'
      }
    },
    {
      name: 'black-and-white',
      colorsSquares: {
        light: '#ffffff',
        dark: '#9c9c9c'
      }
    }
  ];

  private boardStyleSelected = this.boardStyles[5];


  private piecesStyles: string[] = ['cburnett', 'fantasy', 'staunty'];
  private piecesStyleSelected: string;
  private baseUrl = '/assets/images/pieces/';

  constructor() {
    this.changeTheme('fantasy');
  }

  get currentPiecesStyleSelected() {
    return this.piecesStyleSelected;
  }

  get piecesPath() {
    return `${this.baseUrl}${this.piecesStyleSelected}/`;
  }

  get pieces() {
    return `${this.piecesPath}${this.piecesStyleSelected}.svg`;
  }

  get piecesStylesInfo() {
    const localPiecesStyles = [];
    for (const iteratorPiece of this.piecesStyles) {
      const objectToAdd = {
        name: iteratorPiece,
        piecesPath: `${this.baseUrl}${iteratorPiece}/`,
      };
      localPiecesStyles.push(objectToAdd);
    }
    return localPiecesStyles;
  }

  get boardStylesInfo() {
    return this.boardStyles;
  }

  get currentBoardStyleSelected() {
    return this.boardStyleSelected;
  }

  changeTheme(name: string) {
    const theme = this.piecesStyles.find(t => t === name);
    if (theme) {
      this.piecesStyleSelected = theme;
    }

    console.log('Theme changed to: ', this.piecesStyleSelected);

  }



  logWaring(message: string, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  logError(message: string, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }
}
