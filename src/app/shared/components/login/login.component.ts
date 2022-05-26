// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

// rxjs

// states
import { AuthState } from '@redux/states/auth.state';


// actions
import { requestLoginGoogle, requestSingUpEmail, requestLoginEmail } from '@redux/actions/auth.actions';

// selectors

// models
import { User as FirebaseUser } from 'firebase/auth';


// services
import { AuthService } from '@services/auth.service';

// components


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Input() showAs: 'modal' | 'popover';

  formSingUp: FormGroup;
  formLogin: FormGroup;

  showEmailPassword = false;
  segmentEmailPassword: 'login' | 'singUp' = 'login';

  // TODO: Mostrar error al iniciar/registrarse
  // TODO: Ajustar ui = no cambiar tamaño al cambiar segment
  constructor(
    private formBuilder: FormBuilder,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private authService: AuthService,
    private store: Store<AuthState>
  ) {
    this.buildFormSingUp();
    this.buildFormLogin();
    this.listenAuthState();
  }

  ngOnInit() { }


  listenAuthState() {
    // se inicia a escuchar el estado del auth para cerrar el componente
    this.authService.getAuthState().subscribe((dataAuth: FirebaseUser) => {
      if (dataAuth) {        
        this.close();
      }
    });

  }


  /**
   * Ingresa con Google
   */
  loginGoogle() {
    const action = requestLoginGoogle();
    this.store.dispatch(action);
    this.close();
  }


  segmentChanged(ev: any) {
    this.segmentEmailPassword = ev?.detail?.value;
  }

  // Ingresar
  buildFormLogin() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required]]
    });
  }

  get emailFieldLogin() {
    return this.formLogin.get('email');
  }

  get passwordFielLogin() {
    return this.formLogin.get('password');
  }

  onSubmitLogin($event: Event) {
    $event.preventDefault();
    if (this.formLogin.valid) {
      const credentials = {
        email: this.emailFieldLogin.value,
        password: this.passwordFielLogin.value
      };
      const action = requestLoginEmail(credentials);
      this.store.dispatch(action);
    } else {
      this.emailFieldLogin.markAsDirty();
      this.passwordFielLogin.markAsDirty();
    }
  }



  // ----------------------------------------------------------------------------

  // Registrarse
  buildFormSingUp() {
    this.formSingUp = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required]],
      rePassword: ['', [Validators.required]]
    });
  }

  get emailFieldSingUp() {
    return this.formSingUp.get('email');
  }

  get passwordFielSingUp() {
    return this.formSingUp.get('password');
  }

  get rePasswordFielSingUp() {
    return this.formSingUp.get('rePassword');
  }


  onSubmitSingUp($event: Event) {

    $event.preventDefault();
    if (this.formSingUp.valid) {
      const credentials = {
        email: this.emailFieldSingUp.value,
        password: this.passwordFielSingUp.value,
        rePassword: this.rePasswordFielSingUp.value
      };
      const action = requestSingUpEmail(credentials);
      this.store.dispatch(action);
      this.formSingUp.reset();
    } else {
      this.emailFieldSingUp.markAsDirty();
      this.passwordFielSingUp.markAsDirty();
    }
  }

  // ----------------------------------------------------------------------------

  // Recuperar password
  resetPassword() {
    // TODO: 
  }

  close() {
    if (this.showAs === 'modal') {
      this.modalController.dismiss();
    } else if (this.showAs === 'popover') {
      this.popoverController.dismiss();
    }
  }

}
