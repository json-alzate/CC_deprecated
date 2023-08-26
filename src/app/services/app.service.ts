// TODO: Mover los estilos de piezas y tablero a un servicio UI

import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { UIState } from '@redux/states/ui.state';

// models
import { PiecesStyle, BoardStyle } from '@models/ui.model';

interface BoardStylesArray {
  name: BoardStyle;
  colorsSquares: {
    light: string;
    dark: string;
  };
}

// actions
import { setPiecesStyle, setBoardStyle } from '@redux/actions/ui.actions';

// selectors
import { getPiecesStyle, getBoardStyle } from '@redux/selectors/ui.selectors';


@Injectable({
  providedIn: 'root'
})
export class AppService {



  private boardStyles: BoardStylesArray[] = [
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

  private boardStyleSelected: BoardStylesArray = this.boardStyles[0];


  private piecesStyles: PiecesStyle[] = ['cburnett', 'fantasy', 'staunty'];
  private piecesStyleSelected: 'fantasy' | 'cburnett' | 'staunty';
  private baseUrl = '/assets/images/pieces/';

  constructor(
    private store: Store<UIState>
  ) {
    this.changePiecesStyle('fantasy');
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

  changePiecesStyle(name: PiecesStyle) {
    const theme = this.piecesStyles.find(t => t === name);
    if (theme) {
      this.piecesStyleSelected = theme;
    }
    this.store.dispatch(setPiecesStyle({ piecesStyle: this.piecesStyleSelected }));
  }

  changeBoardStyle(name: BoardStyle) {

    const theme = this.boardStyles.find(t => t.name === name);
    if (theme) {
      this.boardStyleSelected = theme;
    }

    this.store.dispatch(setBoardStyle({ boardStyle: this.boardStyleSelected.name }));

  }

  // listeners
  listenPiecesStyle() {
    return this.store.pipe(select(getPiecesStyle));
  }

  listenBoardStyle() {
    return this.store.pipe(select(getBoardStyle));
  }



  logWaring(message: string, ...optionalParams: any[]) {
    console.warn(message, optionalParams);
  }

  logError(message: string, ...optionalParams: any[]) {
    console.error(message, optionalParams);
  }
}
