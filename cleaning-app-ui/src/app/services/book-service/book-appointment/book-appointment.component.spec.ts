import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAppointmentComponent } from './book-appointment.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AlertService } from '../../../common/service/alert/alert.service';
import { BookService } from '../service/book.service';
import { HomeService } from '../../../home/service/home.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('BookAppointmentComponent', () => {
  let component: BookAppointmentComponent;
  let fixture: ComponentFixture<BookAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAppointmentComponent, MatDatepickerModule, CommonModule, MatTabsModule, ReactiveFormsModule, TranslatePipe,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
       ],
      providers: [ FormBuilder, AlertService, BookService, HomeService, provideHttpClient(),
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

    fixture = TestBed.createComponent(BookAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
