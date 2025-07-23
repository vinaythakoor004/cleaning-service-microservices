import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'demoPipe'
})
export class DemoPipePipe implements PipeTransform {

  transform(value: string): String {
    if (!value) return '';

    return value.toUpperCase();
  }

}
