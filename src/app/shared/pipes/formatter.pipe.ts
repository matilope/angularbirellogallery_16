import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatter',
  standalone: true
})
export class FormatterPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace(/\n/g, '<br />');
  }

}
