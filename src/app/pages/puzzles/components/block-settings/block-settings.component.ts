import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AppPuzzlesThemes } from '@models/app.models';
import { Block } from '@models/plan.model';


// services
import { AppService } from '@services/app.service';

@Component({
  selector: 'app-block-settings',
  templateUrl: './block-settings.component.html',
  styleUrls: ['./block-settings.component.scss'],
})
export class BlockSettingsComponent implements OnInit {


  puzzlesThemes: AppPuzzlesThemes[] = [];

  form: FormGroup;

  @Output() newBlock = new EventEmitter<Block>();

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService
  ) {
    this.puzzlesThemes = this.appService.getThemesPuzzle;
  }

  ngOnInit() {
    this.buildForm();
  }


  buildForm() {
    this.form = this.formBuilder.group({

      time: [null, Validators.min(3)],
      durationTime: false,
      puzzlesCount: [null, Validators.min(1)],
      durationCount: false,
      eloStart: [800, Validators.required],
      eloEnd: [3000, Validators.required],
      theme: '',
      openingFamily: '',
      puzzleTime: [60, Validators.required],
      nextPuzzleImmediately: true,
      showPuzzleSolution: true,
      goshPuzzle: false,
      goshPuzzleTime: [{ value: 30, disabled: true }]
    }, {
      validators: this.rangeDifferenceValidator
    });

    this.form.get('goshPuzzle').valueChanges.subscribe(() => {
      this.toggleFieldBasedOnBoolean('goshPuzzle', 'goshPuzzleTime');
    });
    this.form.get('durationTime').valueChanges.subscribe(() => {
      this.toggleFieldBasedOnBoolean('durationTime', 'time');
    });
    this.form.get('durationCount').valueChanges.subscribe(() => {
      this.toggleFieldBasedOnBoolean('durationCount', 'puzzlesCount');
    });
  }

  rangeDifferenceValidator(group: FormGroup): { [key: string]: boolean } | null {
    const eloStart = group.get('eloStart').value;
    const eloEnd = group.get('eloEnd').value;
    if (eloEnd - eloStart < 100) {
      return { rangeTooSmall: true };
    }
    return null;
  }

  toggleFieldBasedOnBoolean(booleanControlName: string, targetControlName: string) {
    const booleanControl = this.form.get(booleanControlName);
    const targetControl = this.form.get(targetControlName);

    if (booleanControl.value) {
      targetControl.enable();
      targetControl.setValidators(Validators.required);
    } else {
      targetControl.disable();
      targetControl.clearValidators();
    }
    targetControl.updateValueAndValidity();
  }

  onSubmit(event) {

    // prevent default submit action
    event.preventDefault();
    // validate form
    if (this.form.invalid) {
      return;
    }

    console.log(this.form.value);


  }


}
