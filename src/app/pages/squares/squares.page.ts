import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { IonCard, Platform, Gesture, GestureController } from '@ionic/angular';

@Component({
  selector: 'app-squares',
  templateUrl: './squares.page.html',
  styleUrls: ['./squares.page.scss'],
})
export class SquaresPage implements OnInit, AfterViewInit {

  // Tus casillas
  public squares = ['a1', 'b2', 'c3', 'd4', 'e5', 'f6', 'g7', 'h8'];

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;

  constructor(
    private platform: Platform,
    private gestureCtrl: GestureController
  ) { }

  ngOnInit() {
    // tu código de inicialización aquí
  }

  ngAfterViewInit() {
    const cardArray = this.cards.toArray();
    this.useSwiperGesture(cardArray);
  }

  useSwiperGesture(cardArray: ElementRef[]) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];

      const gesture: Gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        threshold: 15,
        gestureName: 'swipe',
        onMove: ev => {
          card.nativeElement.style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
        },
        onEnd: ev => {
          card.nativeElement.style.transition = '.5s ease-out';

          if (ev.deltaX > 150) {
            card.nativeElement.style.transform = `translateX(${this.platform.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
            // Aquí puedes agregar la lógica para cuando el usuario adivina que la casilla es blanca
          } else if (ev.deltaX < -150) {
            card.nativeElement.style.transform = `translateX(-${this.platform.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
            // Aquí puedes agregar la lógica para cuando el usuario adivina que la casilla es negra
          } else {
            card.nativeElement.style.transform = '';
          }
        }
      });

      gesture.enable(true);
    }
  }
}
