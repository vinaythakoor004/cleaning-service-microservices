import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { serviceDetails } from './model/serviceDetails';
import { BookService } from './service/book.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-book-service',
  imports: [ CommonModule, TranslatePipe ],
  templateUrl: './book-service.component.html',
  styleUrl: './book-service.component.css',
})
export class BookServiceComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private bookService: BookService = inject(BookService);

  selectesService: serviceDetails = {
    id: 0,
    name: 'default',
    description: 'default',
    price: "0",
    time: 'default',
    servicedescription: 'default',
    contactDetails: 'default',
    image: 'default'
  };

  constructor() {
  }

  ngOnInit(): void {
    if (this.bookService.serviceDetails.length) {
      this.getServiceDetails();
    } else {
      this.router.navigate(['services']);
    }
  }

  getServiceDetails(): void {
    this?.activatedRoute?.queryParams?.subscribe((params) => {
      const serviceName = params['name'];
      this.selectesService = this.bookService.getServiceDetailsByName(serviceName);
    });
  }

  checkService(): void {
    this.router.navigate(['appointment'], { relativeTo: this.activatedRoute, queryParams: { name: this.selectesService.name } });
  }
}
