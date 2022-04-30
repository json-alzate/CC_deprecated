// core and third party libraries
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ModalController, Platform, isPlatform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Socket } from 'ngx-socket-io';




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
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  profile$: Observable<Profile>;

  constructor(
    private modalController: ModalController,
    private translocoService: TranslocoService,
    private platform: Platform,
    private socket: Socket,
    private store: Store<AuthState>
  ) {

    this.profile$ = this.store.pipe(
      select(getProfile)
    );
    this.getLang();
    this.initializeApp();
  }

  initializeApp() {

    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }

    this.socket.connect();
    // this.platform.ready().then(() => {
    //   GoogleAuth.initialize()
    // })
  }

  async getLang() {
    const lang = await Device.getLanguageCode();
    if (lang.value.slice(0, 2) === 'es') {
      this.translocoService.setActiveLang('es');
    }
  }

  async presentModalLogin() {
    const modal = await this.modalController.create({
      component: LoginComponent,
    });
    await modal.present();
  }
}
