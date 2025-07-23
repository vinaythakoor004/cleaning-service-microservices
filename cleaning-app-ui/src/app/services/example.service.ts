import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {

  constructor(private httpService: HttpService) { }

  getUserData(): Observable<any> {

    return this.httpService.get("./assets/json/users.json");
  }
  
}
