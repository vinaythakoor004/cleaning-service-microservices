import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';
import { bookingData } from '../model/bookingData';
import { HttpService } from '../../services/http.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private httpService: HttpService) {}
  allBookingDataCopy: Array<bookingData> = [];
  allBookingData: Array<bookingData> = [];
  bookingFormSubmitSubject = new BehaviorSubject<Array<bookingData>>([])
  isEdit: boolean = false;
  editItem: any = {};
  fetchUsers(): Observable<any[]> {
    return this.httpService.get<any[]>('./assets/json/booking_data.json').pipe(
      map((data: any) => {
        if (data) {
          this.allBookingDataCopy = data;
          return data;
        }
      })
    );
  }

  getBlogs(): Observable<any[]> {
    return this.httpService.get<any[]>('/api/blogs').pipe(
      map((data: any) => {
        if (data) {
          this.allBookingDataCopy = data;
          return data;
        }
      })
    );
  }

  getServiceData(pageNo: number, pageSize: number, search: string | ""): Observable<any[]> {
      let params = new HttpParams()
        .set('page', pageNo.toString())
        .set('pageSize', pageSize.toString())

      if (search && search.trim() !== '') {
        params = params.set('search', search.trim());
      }
    return this.httpService.get<any[]>('/api/bookings', params)
  }

  postBooking(data: bookingData): Observable<bookingData | null> {
    if (!data) {
      console.warn('No booking data provided');
      return of(null);
    }

    return this.httpService.post("/api/bookings", data).pipe(
      catchError(err => {
        console.error('Booking POST failed:', err);
        return throwError(() => err);
      })
    );
  }

  updateBooking(data: bookingData, id: string): Observable<bookingData | null> {
   if (!data) {
      console.warn('No booking data provided');
      return of(null);
    }

    return this.httpService.put("/api/bookings/" + id, data).pipe(
      catchError(err => {
        console.error('Booking POST failed:', err);
        return throwError(() => err);
      })
    );
  }

  deleteBooking(id: String | undefined): Observable<any> {
    if (!id) {
      console.warn('No booking data provided');
      return of(null);
    }

    return this.httpService.delete("/api/bookings/" + id).pipe(
      catchError(err => {
        console.error('Delete booking failed:', err);
        return throwError(() => err);
      })
    );
  }



      /*getServiceData(): Observable<any[]> {


    return forkJoin({
      user: this.httpService.get("/user"),
      empData: this.httpService.get("/emp")
    }).pipe(switchMap((res) => {
      return this.httpService.get(`/emp/${res.user.id}`)
    }));

    return combineLatest([
      this.httpService.get("/user")
    ])



    if (this.allBookingDataCopy.length) {
      return of(this.allBookingDataCopy);
    } else {
      return this.httpService.get<any[]>('./assets/json/booking_data.json').pipe(
        map((data: any) => {
          if (data){
            data.sort(
              (a: bookingData, b: bookingData) =>
                new Date(b.bookingDetails.bookingDateTime).getTime() -
              new Date(a.bookingDetails.bookingDateTime).getTime()
            );
            this.allBookingDataCopy = data;
            this.allBookingData = data;
            return data;
          }
        })
      );
    }
  }*/
}
