import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// models
import { PiecesStyle, BoardStyle } from '@models/ui.model';

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
  currentBoardStyleSelected: BoardStyle = this.appService.currentBoardStyleSelected.name || 'default';

  constructor(
    private appService: AppService
  ) {
    this.appService.listenPiecesStyle().subscribe((piecesStyle: PiecesStyle) => {
      this.currentPiecesStyleSelected = piecesStyle;
    });
    this.appService.listenBoardStyle().subscribe((boardStyle: BoardStyle) => {
      this.currentBoardStyleSelected = boardStyle;
    });
  }

  ngOnInit() { }

  changePiecesStyle(name: PiecesStyle) {
    this.appService.changePiecesStyle(name);
  }

  changeBoardStyle(name: BoardStyle) {
    this.appService.changeBoardStyle(name);
  }

  logout() {
    this.closeProfile.emit();
  }

}
