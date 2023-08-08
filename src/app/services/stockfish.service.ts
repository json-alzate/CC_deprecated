import { Injectable } from '@angular/core';

import { Stockfish, StockfishPlugin } from 'capacitor-stockfish';



@Injectable({
  providedIn: 'root'
})
export class StockfishService {


  private stockfish: any;

  constructor() {
    this.stockfish = new Worker('/assets/engine/stockfish-nnue-16.js');
  }

  send(message: string) {
    this.stockfish.postMessage(message);
  }

  onMessage(callback: (event: any) => void) {
    this.stockfish.onmessage = callback;
  }



  // Mobile implementation
  // private readonly stockfishMobile: StockfishPlugin = Stockfish;


  // constructor() {
  //   this.stockfishMobile.start();
  //   setTimeout(() => {
  //     console.log('vamos a prender esta vuelta!!!');

  //     this.init();
  //   }, 2000);
  // }

  // onStockfishEvent = (event: any) => {
  //   // Procesa la salida del evento aquí
  //   // const output = event.output;
  //   console.log('esto disparo el motor ', event);


  //   // Extracción y procesamiento de las mejores jugadas
  //   // Actualiza la propiedad bestMove como se requiera
  //   // (esto depende del formato de la salida del motor de Stockfish)
  // };

  // init() {
  //   window.addEventListener('stockfish', this.onStockfishEvent);
  //   this.stockfishMobile.cmd({ cmd: 'isready' });
  // }


  // start() {
  // }

  // stop() {
  //   this.stockfishMobile.exit();
  // }



}
