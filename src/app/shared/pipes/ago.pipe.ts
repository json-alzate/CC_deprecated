import { Pipe, PipeTransform } from '@angular/core';

import { formatDistanceToNow } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

@Pipe({
  name: 'ago'
})
export class AgoPipe implements PipeTransform {

  transform(date: number | Date, locale: string = 'es'): string {
    return formatDistanceToNow(
      date,
      { includeSeconds: true, addSuffix: true, locale: locale === 'es' ? es : enUS }
    );
  }

}
