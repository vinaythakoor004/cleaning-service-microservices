import { Pipe, PipeTransform } from '@angular/core';
import { bookingData } from '../model/bookingData';

@Pipe({
  name: 'sortByDate'
})
export class SortByDatePipe implements PipeTransform {

  transform(bookingData: Array<bookingData>, ...args: unknown[]): unknown {
    return bookingData.sort((a: bookingData, b: bookingData) =>
       new Date(a.bookingDetails.bookingDateTime).getTime() - new Date(b.bookingDetails.bookingDateTime).getTime()
  );
  }

}
