import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockfishService {
  private stockfish!: Worker;

  constructor() {
    // Cargar el motor Stockfish
    this.stockfish = new Worker('/assets/engine/stockfish-16.1-lite-single.js');
  }

  onMessage(callback: (message: string) => void): void {
    this.stockfish.onmessage = (event: MessageEvent) => {
      callback(event.data);
    };
  }

  postMessage(command: string): void {
    console.log(command, this.stockfish);

    this.stockfish.postMessage(command);
  }

  terminate(): void {
    this.stockfish.terminate();
  }
}
