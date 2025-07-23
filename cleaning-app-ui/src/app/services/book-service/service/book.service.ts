import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { serviceDetails } from '../model/serviceDetails';
import { HttpService } from '../../http.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  serviceDetail: Array<serviceDetails> = [];
  get serviceDetails(): serviceDetails[] {
    return this.serviceDetail;
  }

  set serviceDetails(value: serviceDetails[]) {
    this.serviceDetail = value;
  }

  constructor( private httpService: HttpService ) { }

    getServiceDetails(): Observable<any[]> {
      return this.httpService.get<any[]>("./assets/json/service.json").pipe(map((data: any) => {
        this.serviceDetail = data;
        return data;
      }));
    }

    getServiceDetailsByName(name: string): serviceDetails { 
      const service = this.serviceDetail.find((service) => service.name === name);
      return service ? service : {
        id: 0,
        name: 'default',
        description: 'default',
        price: "0",
        time: 'default',
        servicedescription: 'default',
        contactDetails: 'default',
        image: 'default'
      };
    }
}
