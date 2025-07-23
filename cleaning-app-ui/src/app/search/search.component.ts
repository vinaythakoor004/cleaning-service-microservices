import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { bookingData } from '../home/model/bookingData';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  // @Input() allBookingData: Array<bookingData> = [];
  @Input() bookingData: Array<bookingData> = [];
  @Output() searchEvent = new EventEmitter<any>();
  private searchSubject = new Subject<string>();
  allbookingDataCopy: Array<bookingData> = [];
  _allBookingData: Array<bookingData> = [];

  @Input()
  set allBookingData(set: Array<bookingData>) {
    this._allBookingData = set;
    if (!this.allbookingDataCopy.length) {
      this.allbookingDataCopy = structuredClone(set);
    }
  }

  get allBookingData(): any {
    console.log(this._allBookingData);
    return this._allBookingData;
  }

  ngOnInit() {
    this.searchSubject.pipe(
    debounceTime(600),
    distinctUntilChanged(),
    filter(value => !value || value.length >= 3) // allow empty or 3+ chars
  ).subscribe(search => {
    this.searchEvent.emit({ search }); // emit only after debounce + filter
  });
    // this.allbookingDataCopy = structuredClone(this.allBookingData);
  }

  onInput(e: any): void {
    const val = e?.target?.value || e?.value || "";
    this.searchSubject.next(val.trim());
  }

  searchClicked(e: any): void {
    const element = document?.getElementById('searchBox');
    this.onInput(element);
  }
}
