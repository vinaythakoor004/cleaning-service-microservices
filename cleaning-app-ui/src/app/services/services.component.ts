import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from './book-service/service/book.service';
import { serviceDetails } from './book-service/model/serviceDetails';
import { TranslatePipe } from '@ngx-translate/core';
import { HomeService } from '../home/service/home.service';

@Component({
  selector: 'app-services',
  imports: [CommonModule, RouterLink, TranslatePipe ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  services: Array<serviceDetails> = []

  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router, private homeService: HomeService) {}
  ngOnInit(): void {
    this.homeService.isEdit = false;
    this.homeService.editItem = {};
    this.bookService.getServiceDetails().subscribe({
      next: (data) => {
        this.services = data;
      },
      error: (error) => {
        console.error('Error fetching service details:', error);
        this.services = []; // Handle error case by setting services to an empty array
      }
    }
    );
  }

  checkService(service: serviceDetails): void {
    const url = this.router.url + '/book-service';
    const params = {
        queryParams: {
            name: service.name
        }
    };
    this.router.navigate([url], params);
  }

  navigatePage(): void {
    console.log('Navigating to booking page...');
  }
}
