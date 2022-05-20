// core and third party libraries
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';

// rxjs

// states
import { AuthState } from '@redux/states/auth.state';


// actions
import { requestLoginGoogle } from '@redux/actions/auth.actions';

// selectors

// models

// services

// components


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  showEmailPassword = false;

  constructor(
    private modalController: ModalController,
    private store: Store<AuthState>
  ) { }

  ngOnInit() { }

  loginGoogle() {
    const action = requestLoginGoogle();
    this.store.dispatch(action);
  }

  close() {
    this.modalController.dismiss();
  }

}
