import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Animation, AnimationController, createAnimation, Gesture, GestureController } from '@ionic/angular';


@Component({
  selector: 'app-squares',
  templateUrl: './squares.page.html',
  styleUrls: ['./squares.page.scss'],
})
export class SquaresPage implements OnInit {

  @ViewChild('card', { read: ElementRef }) card: ElementRef;
  @ViewChild('container', { read: ElementRef }) container: ElementRef;

  private cardAnimation: Animation;
  private swipeGesture: Gesture;

  constructor(
    private animationCtrl: AnimationController,
    private gestureCtrl: GestureController) { }


  ngOnInit() {
  }

  ionViewDidEnter() {
    this.createSwipeGesture();

  }

  createSwipeGesture() {

    this.cardAnimation = createAnimation()
      .addElement(this.card.nativeElement)
      .duration(500)
      .onFinish((currentStep) => {
        // Aquí es donde validaríamos y mostraríamos un mensaje.
        // Por ahora, simplemente lo registramos en la consola.
        console.log('Animation finished at step', currentStep);
        // Reiniciamos la tarjeta a su posición original
        this.cardAnimation.direction('reverse').play();
        this.cardAnimation.onFinish(() => {
          this.cardAnimation.direction('normal');
        }, { oneTimeCallback: true });
      });

    this.swipeGesture = this.gestureCtrl.create({
      el: this.card.nativeElement,
      gestureName: 'swipe-card',
      onStart: () => this.cardAnimation.stop(),
      onMove: (detail) => {
        const amount = detail.deltaX;
        this.cardAnimation
          .to('transform', `translateX(${amount}px) rotate(${amount / 10}deg)`)
          .play();
      },
      onEnd: (detail) => {
        const amount = detail.deltaX;
        const containerWidth = this.container.nativeElement.offsetWidth;
        if (Math.abs(amount) < containerWidth / 2) {
          // Si la tarjeta no se deslizó más de la mitad del contenedor, vuelve a su posición original.
          this.cardAnimation.play();
        } else {
          // Si la tarjeta se deslizó más de la mitad del contenedor, termina la animación.
          this.cardAnimation
            .afterStyles({ visibility: 'hidden' })
            .play();
        }
      }
    });
    this.swipeGesture.enable();


  }

}
