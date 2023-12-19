import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';

import { AppPuzzlesThemes, AppPuzzleThemesGroup } from '@models/app.models';
import { Block } from '@models/plan.model';

// services
import { AppService } from '@services/app.service';
import { UiService } from '@services/ui.service';

@Component({
  selector: 'app-block-settings',
  templateUrl: './block-settings.component.html',
  styleUrls: ['./block-settings.component.scss'],
})
export class BlockSettingsComponent implements OnInit {


  @Output() newBlock = new EventEmitter<Block>();
  color = 'random';

  puzzlesGroupsThemes: AppPuzzleThemesGroup[] = [];
  form: FormGroup;

  private dashObligatoryDuration: boolean;


  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    public uiService: UiService
  ) {
    this.puzzlesGroupsThemes = this.appService.getThemesPuzzle;

  }

  get timeField() {
    return this.form.get('time');
  }

  get puzzlesCountField() {
    return this.form.get('puzzlesCount');
  }

  get themesField() {
    return this.form.get('themes');
  }

  get eloStartField() {
    return this.form.get('eloStart');
  }

  get eloEndField() {
    return this.form.get('eloEnd');
  }


  get obligatoryDuration(): boolean {
    return this.dashObligatoryDuration;
  }


  @Input()
  set obligatoryDuration(value: boolean) {
    this.dashObligatoryDuration = value;
    this.updateFormValidators();
  }



  ngOnInit() {
    this.buildForm();
    this.updateFormValidators();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      time: [{ value: null, disabled: true }, Validators.min(3)],
      durationTime: false,
      puzzlesCount: [{ value: null, disabled: true }, Validators.min(1)],
      durationCount: false,
      // adicionar validacion minimo 800 y maximo 3000
      eloStart: [800, Validators.compose([Validators.required, Validators.min(800), Validators.max(2900)])],
      eloEnd: [3000, Validators.compose([Validators.required, Validators.min(900), Validators.max(3000)])],
      themes: 'all',
      openingFamily: '',
      puzzleTime: [60, Validators.required],
      nextPuzzleImmediately: true,
      showPuzzleSolution: true,
      goshPuzzle: false,
      goshPuzzleTime: [{ value: 30, disabled: true }]
    }, {
      validators: [this.rangeDifferenceValidator, this.durationValidator()]
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

  durationValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      if (this.obligatoryDuration) {
        const timeValue = group.get('time').value;
        const puzzlesCountValue = group.get('puzzlesCount').value;

        if (!timeValue && !puzzlesCountValue) {
          return { durationRequired: true };
        }
      }
      return null;
    };
  }

  toggleFieldBasedOnBoolean(booleanControlName: string, targetControlName: string) {
    const booleanControl = this.form.get(booleanControlName);
    const targetControl = this.form.get(targetControlName);

    if (booleanControl.value) {
      targetControl.enable();
      targetControl.setValidators(Validators.required);
    } else {
      targetControl.setValue(null);
      targetControl.disable();
      targetControl.clearValidators();
    }
    targetControl.updateValueAndValidity();
  }

  updateFormValidators() {
    if (!this.form) {
      return; // Si el formulario aún no está inicializado, simplemente regresa
    }

    if (this.obligatoryDuration) {
      this.form.setValidators([this.rangeDifferenceValidator, this.durationValidator()]);
    } else {
      this.form.setValidators([this.rangeDifferenceValidator]);
    }
    this.form.updateValueAndValidity();
  }

  onSubmit(event) {
    // prevent default submit action
    event.preventDefault();
    // validate form
    if (this.form.invalid) {
      return;
    }

    const themesValue = this.form.value.themes;
    // emit new block

    this.newBlock.emit({ ...this.form.value, color: this.color, themes: themesValue !== 'all' ? [themesValue] : [] });


  }
}
