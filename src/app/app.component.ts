// core and third party libraries
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';
import { ModalController, Platform, isPlatform } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Socket } from 'ngx-socket-io';
import { initializeApp } from 'firebase/app';
import { environment } from '@environments/environment';




// rxjs
import { Subject, Observable } from 'rxjs';


// states
import { AuthState } from '@redux/states/auth.state';

// actions

// selectors
import { getProfile } from '@redux/selectors/auth.selectors';

// models
import { User as FirebaseUser } from 'firebase/auth';
import { Profile } from '@models/profile.model';

// services
import { FirestoreService } from '@services/firestore.service';
import { AuthService } from '@services/auth.service';
import { ProfileService } from '@services/profile.service';
import { SocketsService } from '@services/sockets.service';

// components
import { LoginComponent } from '@shared/components/login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  profile$: Observable<Profile>;
  showProfile: boolean;
  version = environment.version;

  constructor(
    private modalController: ModalController,
    private translocoService: TranslocoService,
    private authService: AuthService,
    private profileService: ProfileService,
    private platform: Platform,
    private firestoreService: FirestoreService,
    private socketsService: SocketsService,
    private store: Store<AuthState>
  ) {

    this.initApp();
    this.getLang();
    // Se escuchan los datos del usuario desde el store
    this.profile$ = this.store.pipe(
      select(getProfile)
    );

  }

  initApp() {

    this.initFirebase();
    // se debe inicializar para la web
    if (!isPlatform('capacitor')) {
      GoogleAuth.initialize();
    }
    // this.platform.ready().then(() => {
    //   GoogleAuth.initialize()
    // })
    // se prepara para utilizar los sockets
    this.socketsService.startConnection();

  }

  async initFirebase() {
    initializeApp(environment.firebase);
    await this.authService.init();
    await this.firestoreService.init();
    // se obtiene el estado del usuario -login-
    this.authService.getAuthState().subscribe((dataAuth: FirebaseUser) => {

      // se obtienen los datos del usuario, sino existe se crea el nuevo usuario
      if (dataAuth) {
        this.profileService.checkProfile(dataAuth);
      }
    });
  }

  /**
   * Se obtiene el idioma
   */
  async getLang() {
    // TODO: se debe obtener el idioma desde el perfil en caso de existir
    const lang = await Device.getLanguageCode();
    
    if (lang.value.slice(0, 2) === 'es') {
      this.translocoService.setActiveLang('es');
    }
  }

  async presentModalLogin() {
    const modal = await this.modalController.create({
      component: LoginComponent,
      componentProps: { showAs: 'modal' },
    });
    await modal.present();
  }

}
