import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookServiceComponent } from './book-service.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from './service/book.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('BookServiceComponent', () => {
  let component: BookServiceComponent;
  let fixture: ComponentFixture<BookServiceComponent>;
  let bookService: BookService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookServiceComponent, CommonModule, TranslatePipe,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
       ],
      providers: [ Router, BookService, provideHttpClient(),
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

    fixture = TestBed.createComponent(BookServiceComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
