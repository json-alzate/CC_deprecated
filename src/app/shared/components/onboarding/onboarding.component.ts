//core and third party libraries
import { Component, OnInit } from '@angular/core';

// rxjs

// states
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


// actions

// selectors

// models
import { Flag } from '@models/tools.models';

// services
import { ToolsService } from '@services/tools.service';
import { ProfileService } from '@services/profile.service';

// components

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {

  formOnboarding: FormGroup;

  flags: Flag[] = [];
  flagsBackUp: Flag[] = [];

  constructor(
    private toolsService: ToolsService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService
  ) {
    this.flags = this.toolsService.flags;
    this.flagsBackUp = [...this.flags];
    this.buildFormOnboarding();
  }

  ngOnInit() { }

  buildFormOnboarding() {
    this.formOnboarding = this.formBuilder.group({
      nikName: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      country: ['', [Validators.required]]
    });
  }

  onSearchFlagChange(event: any) {
    const query = event?.detail?.value;
    if (query) {
      this.flags = this.flagsBackUp.filter(flag => flag.Country.toLowerCase().includes(query.toLowerCase()));
    } else {
      this.flags = [...this.flagsBackUp];
    }
  }

  onCancelFlagSearch(event: any) {
    this.flags = [...this.flagsBackUp];
  }

  save() {
    console.log(this.formOnboarding.value);
  }

  checkNickname(event: any) {
    const nickName = event?.detail?.value;
    if (!nickName) {
      return;
    }

    this.profileService.checkNickNameExist(nickName).then((result) => {
      console.log('result nickName ', result);
    });
  }

}
