import { Component, OnInit } from '@angular/core';

import { Flag } from '@models/tools.models';

import { ToolsService } from '@services/tools.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {

  flags: Flag[] = [];

  constructor(
    private toolsService: ToolsService
  ) {
    this.flags = this.toolsService.flags;
  }

  ngOnInit() { }

  save() {

  }

}
