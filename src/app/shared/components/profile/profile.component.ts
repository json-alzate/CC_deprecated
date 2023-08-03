import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { AppService } from '@services/app.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  @Output() closeProfile = new EventEmitter();

  piecesStylesInfo = this.appService.piecesStylesInfo;
  currentPiecesStyleSelected = this.appService.currentPiecesStyleSelected;

  boardStylesInfo = this.appService.boardStylesInfo;
  currentBoardStyleSelected = this.appService.currentBoardStyleSelected;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit() { }

  changePiecesStyle(name: string) {
    console.log('changePiecesStyle: ', name);

    this.appService.changeTheme(name);
  }

  changeBoardStyle(name: string) {
    console.log('changeBoardStyle: ', name);
  }

  logout() {
    this.closeProfile.emit();
  }

}
