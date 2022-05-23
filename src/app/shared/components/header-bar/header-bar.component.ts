// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { Store, select } from '@ngrx/store';

// rxjs
import { Subject, Observable } from 'rxjs';


// states
import { AuthState } from '@redux/states/auth.state';

// actions

// selectors
import { getProfile } from '@redux/selectors/auth.selectors';

// models
import { Profile } from '@models/profile.model';

// services

// components
import { LoginComponent } from '@shared/components/login/login.component';


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
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {
    this.profile$ = this.store.pipe(
      select(getProfile)
    );
  }

  ngOnInit() { }

  async presentModalLogin() {
    const modal = await this.modalController.create({
      component: LoginComponent,
    });
    await modal.present();
  }

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: LoginComponent,
      componentProps: { showAs: 'popover' },
      event: ev,
      translucent: true
    });
    await popover.present();
  }

  openMenuProfile() {
    this.menuController.open('menu-profile');
  }
}
