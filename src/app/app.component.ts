// core and third party libraries
import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { TranslocoService } from '@ngneat/transloco';

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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  profile$: Observable<Profile>;

  constructor(
    private translocoService: TranslocoService,
    private store: Store<AuthState>
  ) {
    this.profile$ = this.store.pipe(
      select(getProfile)
    );
  }
}
