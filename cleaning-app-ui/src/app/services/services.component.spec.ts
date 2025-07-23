import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesComponent } from './services.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from './book-service/service/book.service';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;
  let bookService: BookService;
  

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesComponent, CommonModule, RouterLink, TranslatePipe,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [ BookService, Router, provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            // Mock the params, queryParams, etc.
            params: of({ name: 'Kitchen Cleaning' }),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: () => '123'
              }
            }
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesComponent);
    bookService = TestBed.inject(BookService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
