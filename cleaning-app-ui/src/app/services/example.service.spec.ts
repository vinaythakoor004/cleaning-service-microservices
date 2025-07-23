import { TestBed } from '@angular/core/testing';

import { ExampleService } from './example.service';
import { provideHttpClient } from '@angular/common/http';

describe('ExampleService', () => {
  let service: ExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient() ]
    });
    service = TestBed.inject(ExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
