import { TestBed } from '@angular/core/testing';

import { RouteGuardService } from './route-guard.service';
import { provideHttpClient } from '@angular/common/http';

describe('RouteGuardService', () => {
  let service: RouteGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideHttpClient() ]
    });
    service = TestBed.inject(RouteGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
