import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exPipe'
})
export class ExPipePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    return value.toUpperCase();
  }

}
