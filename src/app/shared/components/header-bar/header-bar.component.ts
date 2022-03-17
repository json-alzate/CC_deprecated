import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {

  @Input() title: string;


  constructor(
    private menuController: MenuController
  ) { }

  ngOnInit() { }

  openMenuProfile() {
    this.menuController.open('menu-profile');
  }
}
