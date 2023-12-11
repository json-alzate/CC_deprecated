import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-training-menu',
  templateUrl: './training-menu.component.html',
  styleUrls: ['./training-menu.component.scss'],
})
export class TrainingMenuComponent implements OnInit {

  constructor(
    private navController: NavController
  ) { }

  ngOnInit() { }

  goTo(path: string) {
    this.navController.navigateForward(path);
  }

}
