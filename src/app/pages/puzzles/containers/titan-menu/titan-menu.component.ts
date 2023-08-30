import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-titan-menu',
  templateUrl: './titan-menu.component.html',
  styleUrls: ['./titan-menu.component.scss'],
})
export class TitanMenuComponent implements OnInit {

  constructor(
    private navController: NavController
  ) { }

  ngOnInit() { }

  goTo(path: string) {
    this.navController.navigateForward(path);
  }

}
