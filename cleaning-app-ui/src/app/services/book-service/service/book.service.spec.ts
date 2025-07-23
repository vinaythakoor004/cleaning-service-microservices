import { TestBed } from '@angular/core/testing';

import { BookService } from './book.service';
import { provideHttpClient } from '@angular/common/http';

describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient() ]
    });
    service = TestBed.inject(BookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
