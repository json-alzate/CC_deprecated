import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';


/* @ngrx */
import { StoreModule } from '@ngrx/store';
import { appReducers } from '@redux/reducers/app.reducers';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomRouterStateSerializer } from '@redux/states/router.state';

import * as fromEffects from '@redux/effects';
import * as fromGuards from '@guards/index';

const PROVIDERS = [
  ...fromGuards.guards
];

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    /* NGRX */
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer
    }),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot(fromEffects.EFFECTS),
  ],
  providers: [
    PROVIDERS,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
