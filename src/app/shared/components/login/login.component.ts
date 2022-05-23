// core and third party libraries
import { Component, OnInit, Input } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
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

  @Input() showAs: 'modal' | 'popover';

  showEmailPassword = false;


  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    private store: Store<AuthState>
  ) { }

  ngOnInit() { }

  loginGoogle() {
    const action = requestLoginGoogle();
    this.store.dispatch(action);
    this.close();
  }

  close() {
    if (this.showAs === 'modal') {
      this.modalController.dismiss();
    } else if (this.showAs === 'popover') {
      this.popoverController.dismiss();
    }
  }

}
