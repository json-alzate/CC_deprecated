import { Component, OnInit } from '@angular/core';

import { BotmeService } from '@services/botme.service';

@Component({
  selector: 'app-botme',
  templateUrl: './botme.component.html',
  styleUrls: ['./botme.component.scss'],
})
export class BotmeComponent implements OnInit {

  constructor(
    private botmeService: BotmeService,
  ) {
  }

  ngOnInit() { }

  init() {

    this.botmeService.processPgnFile();
  }

}
