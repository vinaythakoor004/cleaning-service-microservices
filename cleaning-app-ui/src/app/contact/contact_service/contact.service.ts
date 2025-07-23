import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) { }

  saveContactFormData(data: any): Observable<any> {
    let urlPart = '/contact';
    return this.http.post(urlPart, data)
      .pipe(() => {
        return of(data);
      });
  }
}
