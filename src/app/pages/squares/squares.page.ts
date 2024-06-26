import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Meta } from '@angular/platform-browser';
import { GoogleTagManagerService } from 'angular-google-tag-manager';

import { IonCard, Platform, AlertController } from '@ionic/angular';

import { interval, Subscription } from 'rxjs';

import { SoundsService } from '@services/sounds.service';
import { SquaresService } from '@services/squares.service';

interface SquareColorMap {
  name: string;
  color: string;
}

@Component({
  selector: 'app-squares',
  templateUrl: './squares.page.html',
  styleUrls: ['./squares.page.scss'],
})
export class SquaresPage implements OnInit, AfterViewInit, OnDestroy {

  public squares: SquareColorMap[] = [];
  squaresColorsMap: SquareColorMap[] = this.getSquaresColorsMap();
  gameStatus: 'waiting' | 'playing' | 'win' | 'lose' = 'waiting';

  timeLeft = 60;
  timerSubscription: Subscription;

  isTimerStarted = false;
  score = 0;

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;

  constructor(
    private platform: Platform,
    private soundsService: SoundsService,
    private squaresService: SquaresService,
    private alertController: AlertController,
    private meta: Meta,
    private router: Router,
    private googleTagManagerService: GoogleTagManagerService
  ) {
    this.generateSquares();
  }

  ngOnInit() {
    this.meta.addTags([
      { name: 'title', content: 'ChessColate' },
      { name: 'description', content: 'Jugar a reconocer los colores de cada casilla de un tablero de ajedrez.' },
      { name: 'keywords', content: 'ajedrez, entrenamiento, casillas, chess, board, squares' },
      { name: 'robots', content: 'index, nofollow' },
      { property: 'og:title', content: 'ChessColate' },
      { property: 'og:description', content: 'Jugar a reconocer los colores de cada casilla de un tablero de ajedrez.' },
      { property: 'og:image', content: 'https://chesscolate.com/assets/tags/chesscolate.jpg' },
      { property: 'og:url', content: 'https://chesscolate.com/squares/training' }
    ]);
    this.router.events.forEach(item => {
      if (item instanceof NavigationEnd) {
        const gtmTag = {
          event: 'page',
          pageName: item.url
        };

        this.googleTagManagerService.pushTag(gtmTag);
      }
    });
  }

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.addSwipeEventListeners(cardArray);
  }

  generateSquares() {
    for (let i = 0; i < 1000; i++) {
      const randomIndex = Math.floor(Math.random() * this.squaresColorsMap.length);
      this.squares.push(this.squaresColorsMap[randomIndex]);
    }
  }

  addSwipeEventListeners(cardArray: ElementRef[]) {
    cardArray.forEach(card => {
      const element = card.nativeElement;

      element.addEventListener('mousedown', (event) => this.onSwipeStart(event, element));
      element.addEventListener('mousemove', (event) => this.onSwipeMove(event, element));
      element.addEventListener('mouseup', (event) => this.onSwipeEnd(event, element));
      element.addEventListener('mouseleave', (event) => this.onSwipeEnd(event, element));
      element.addEventListener('touchstart', (event) => this.onSwipeStart(event, element));
      element.addEventListener('touchmove', (event) => this.onSwipeMove(event, element));
      element.addEventListener('touchend', (event) => this.onSwipeEnd(event, element));
    });
  }

  onSwipeStart(event: MouseEvent | TouchEvent, element: HTMLElement) {
    element.style.transition = 'none';
    const startX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    element.setAttribute('data-startX', startX.toString());
    if (!this.isTimerStarted) {
      this.isTimerStarted = true;
      this.startTimer();
    }
  }

  onSwipeMove(event: MouseEvent | TouchEvent, element: HTMLElement) {
    const startX = parseFloat(element.getAttribute('data-startX'));
    const currentX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const deltaX = currentX - startX;

    element.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;
    this.setCardColor(deltaX, element);
  }

  onSwipeEnd(event: MouseEvent | TouchEvent, element: HTMLElement) {
    const deltaX = parseFloat(element.style.transform.match(/translateX\(([-\d.]+)px\)/)[1]);

    element.style.transition = '.5s ease-out';
    if (deltaX > 250) {
      element.style.transform = `translateX(${this.platform.width() * 2}px) rotate(${deltaX / 2}deg)`;
      this.checkGuess('right', element);
    } else if (deltaX < -250) {
      element.style.transform = `translateX(-${this.platform.width() * 2}px) rotate(${deltaX / 2}deg)`;
      this.checkGuess('left', element);
    } else {
      element.style.transform = '';
    }
    element.style.background = '';
  }

  checkGuess(movement: 'right' | 'left', element: HTMLElement) {
    const index = this.cards.toArray().findIndex(card => card.nativeElement === element);
    if (index < 0 || index >= this.squares.length) {
      console.error('Index out of range or element not found.');
      return;
    }
    const square = this.squares[index];

    if (square.color === 'white' && movement === 'right') {
      this.gameStatus = 'win';
      this.score++;
      this.soundsService.playSelect();
    } else if (square.color === 'black' && movement === 'left') {
      this.gameStatus = 'win';
      this.score++;
      this.soundsService.playSelect();
    } else {
      this.gameStatus = 'lose';
      this.soundsService.playError();
    }
  }

  getSquaresColorsMap(): SquareColorMap[] {
    const squaresColorsMap: SquareColorMap[] = [];
    const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const colors = ['white', 'black'];

    for (let row = 1; row <= 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = letters[col] + row;
        const color = colors[(row + col) % 2];
        squaresColorsMap.push({ name: square, color });
      }
    }

    return squaresColorsMap;
  }

  setCardColor(deltaX: number, element: HTMLElement) {
    let color = '';
    const opacity = Math.min(Math.abs(deltaX) / 1000, 1);

    if (deltaX > 0) {
      color = `rgba(255, 255, 255, ${opacity})`; // white
    } else {
      color = `rgba(160, 109, 42, ${opacity})`; // brown
    }
    element.style.background = color;
  }

  startTimer() {
    const timer$ = interval(1000);
    this.timerSubscription = timer$.subscribe((elapsed) => {
      this.timeLeft = 60 - elapsed;
      if (this.timeLeft <= 0) {
        this.showAlertEndGame();
        this.squaresService.saveScore(this.score);
        this.score = 0;
        this.timeLeft = 60;
        this.isTimerStarted = false;
        this.timerSubscription.unsubscribe();
      }
    });
  }

  async showAlertEndGame() {
    const alert = await this.alertController.create({
      header: `${this.score}`,
      buttons: ['OK']
    });

    await alert.present();
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
