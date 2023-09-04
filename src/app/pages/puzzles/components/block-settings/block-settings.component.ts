import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Block } from '@models/plan.model';

@Component({
  selector: 'app-block-settings',
  templateUrl: './block-settings.component.html',
  styleUrls: ['./block-settings.component.scss'],
})
export class BlockSettingsComponent implements OnInit {

  form: FormGroup;



  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      time: [60, Validators.required],
      puzzlesCount: [0, Validators.required],
      eloStart: [800, Validators.required],
      eloEnd: [3000, Validators.required],
      themes: [],
      openingFamily: '',
      nextPuzzleImmediately: true,
      showPuzzleSolution: true,
      goshPuzzle: false,
      goshPuzzleTime: 0
    }, {
      validators: this.rangeDifferenceValidator
    });
  }

  rangeDifferenceValidator(group: FormGroup): { [key: string]: boolean } | null {
    const eloStart = group.get('eloStart').value;
    const eloEnd = group.get('eloEnd').value;
    console.log('result11:', eloEnd - eloStart);
    if (eloEnd - eloStart < 100) {
      console.log('La diferencia es menor a 100, ajustando valores.');

      return { rangeTooSmall: true };
    }
    return null;
  }


}
