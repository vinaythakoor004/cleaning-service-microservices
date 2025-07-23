import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CommonModule } from '@angular/common';
import { SearchComponent } from '../search/search.component';
import { MatButtonModule } from '@angular/material/button';
import { HomeService } from './service/home.service';
import { PopupService } from '../common/service/popup/popup.service';
import { AlertService } from '../common/service/alert/alert.service';
import { CommonService } from '../common/service/common/common.service';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { bookingData } from './model/bookingData';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  // Mocks
  const mockHomeService = {
    getServiceData: jasmine.createSpy('getServiceData').and.returnValue(of([])),
    isEdit: false,
    editItem: {}
  };

  const mockPopupService = {
    openDialog: jasmine.createSpy('openDialog').and.callFake((data, width, cssClass, callback) => {
      if (callback) callback();
    })
  };

  const mockAlertService = {
    openSnackBar: jasmine.createSpy('openSnackBar')
  };

  const mockCommonService = {
    loggedInUser: { name: 'Test User' }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, CommonModule, SearchComponent, MatButtonModule ],
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: PopupService, useValue: mockPopupService },
        { provide: AlertService, useValue: mockAlertService },
        { provide: CommonService, useValue: mockCommonService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient() ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should call getPage', ()=> {

  })  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getServiceData on ngOnInit', () => {
    expect(mockHomeService.getServiceData).toHaveBeenCalled();
    expect(component.loggedInUser.name).toEqual('Test User');
  });

    it('should calculate page size correctly', () => {
    component.allBookingData = new Array(23).fill({}); // simulate 23 records
    const result = component.getPageSize();
    expect(result.length).toBe(3); // ceil(23 / 10) = 3
  });

  it('should correctly paginate bookingData', () => {
    const fakeData = Array.from({ length: 15 }, (_, i) => ({ id: i + 1 }));
    component.allBookingData = fakeData as bookingData[];
    component.getPageData(2);
    expect(component.bookingData.length).toBe(5);
    expect(component.bookingData[0].id).toBe(11);
  });

  it('should delete a row and show snackbar', () => {
    const item = { id: 1, bookingDetails: { serviceName: 'test' } } as bookingData;
    component.allBookingData = [item];
    component.bookingData = [item];
    component.currentPage = 1;
    component.deleteRow(item);
    expect(mockAlertService.openSnackBar).toHaveBeenCalledWith('Row: 1 deleted successfully');
    expect(component.allBookingData.length).toBe(0);
  });

  it('should navigate on editRow', () => {
    const item = { id: 1, bookingDetails: { serviceName: 'Cleaning' } } as bookingData;
    component.editRow(item);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/services/book-service/appointment'],
      { queryParams: { name: 'Cleaning' } }
    );
  });

  it('should handle service error in getServiceData', () => {
    mockHomeService.getServiceData.and.returnValue(throwError(() => new Error('Error')));
    component.getServiceData();
    expect(component.allBookingData).toEqual([]);
  });

  it('getPageClass should return "active" for page 1', () => {
    expect(component.getPageClass(1)).toBe('active');
    expect(component.getPageClass(2)).toBe('');
  });

  it('identify should return item id', () => {
    expect(component.identify(0, { id: 5 })).toBe(5);
  });
});
