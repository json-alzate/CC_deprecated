import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineService {

  private lozza: Worker;

  constructor() {
    this.lozza = new Worker('assets/engine/lozza.js');
  }

  getBestMove(fen: string): Promise<string> {
    console.log('EngineService.getBestMove: ', fen);

    return new Promise((resolve, reject) => {
      // Configurar el manejador de mensajes para recibir la respuesta de Lozza
      this.lozza.onmessage = (event: any) => {
        console.log('EngineService.getBestMove: ', event.data);

        const message = event.data;
        if (message.startsWith('bestmove')) {
          const bestMove = message.split(' ')[1];
          resolve(bestMove);
        }
      };

      // Enviar el comando FEN a Lozza
      this.lozza.postMessage(`position fen ${fen}`);
      this.lozza.postMessage('go');
    });
  }

}
