import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

const secondsToMinutesSeconds = _.memoize((seconds: number) => {
  // 👇️ get number of full minutes
  const minutes = Math.floor(seconds / 60);

  // 👇️ get remainder of seconds
  seconds = seconds % 60;

  return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
});

const padTo2Digits = (num) => num.toString().padStart(2, '0'); // 👉️ "09:25"

@Pipe({
  name: 'secondsToMinutesSeconds'
})
export class SecondsToMinutesSecondsPipe implements PipeTransform {

  transform(seconds: number): string {
    return secondsToMinutesSeconds(seconds);
  }

}
