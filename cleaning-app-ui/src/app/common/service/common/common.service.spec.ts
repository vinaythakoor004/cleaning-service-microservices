import { TestBed } from '@angular/core/testing';

import { CommonService } from './common.service';
import { provideHttpClient } from '@angular/common/http';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient() ]
    });
    service = TestBed.inject(CommonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
