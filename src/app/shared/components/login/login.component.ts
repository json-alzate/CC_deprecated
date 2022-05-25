// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Store } from '@ngrx/store';

// rxjs

// states
import { AuthState } from '@redux/states/auth.state';


// actions
import { requestLoginGoogle, requestSingUpEmail } from '@redux/actions/auth.actions';

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

  showEmailPassword = false;
  segmentEmailPassword: 'login' | 'singUp' = 'singUp';


  constructor(
    private formBuilder: FormBuilder,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private authService: AuthService,
    private store: Store<AuthState>
  ) {
    this.buildFormSingUp();
   }

  ngOnInit() { }

  listenAuthState(){
    // se inicia a escuchar el estado del auth para cerrar el componente
    this.authService.getAuthState().subscribe((dataAuth: FirebaseUser) => {
      console.log('dataAuth ', dataAuth);

      // se obtienen los datos del usuario, sino existe se crea el nuevo usuario
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

  get passwordFielSingUpd() {
    return this.formSingUp.get('password');
  }

  get rePasswordFielSingUpd() {
    return this.formSingUp.get('rePassword');
  }



  onSubmitSingUp($event: Event) {
    console.log('dispara');
    
    $event.preventDefault();
    if (this.formSingUp.valid) {
      const credentials = {
        email: this.emailFieldSingUp.value,
        password: this.passwordFielSingUpd.value,
        rePassword: this.rePasswordFielSingUpd.value
      };
      const action = requestSingUpEmail(credentials);
      this.store.dispatch(action);
      this.formSingUp.reset();
      // this.close();
    } else {
      this.emailFieldSingUp.markAsDirty();
      this.passwordFielSingUpd.markAsDirty();
    }
  }


  close() {
    console.log(this.showAs);
    
    if (this.showAs === 'modal') {
      this.modalController.dismiss();
    } else if (this.showAs === 'popover') {
      this.popoverController.dismiss();
    }
  }

}
