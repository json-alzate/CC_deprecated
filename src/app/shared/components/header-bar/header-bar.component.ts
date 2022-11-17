// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';

// rxjs
import { Observable } from 'rxjs';


// states
import { AuthState } from '@redux/states/auth.state';

// actions

// selectors
import { getProfile } from '@redux/selectors/auth.selectors';

// models
import { Profile } from '@models/profile.model';

// services

// components


@Component({
  selector: 'app-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss'],
})
export class HeaderBarComponent implements OnInit {

  @Input() title: string;

  profile$: Observable<Profile>;

  constructor(
    private store: Store<AuthState>,
    private menuController: MenuController,
    private navController: NavController
  ) {
    this.profile$ = this.store.pipe(
      select(getProfile)
    );
  }

  ngOnInit() { }

  openMenuProfile() {
    // TODO: open menu profile
    // this.menuController.open('menu-profile');
  }

  goTo(path: string) {
    this.navController.navigateForward(path);
  }

}
