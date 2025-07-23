import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansComponent } from './plans.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CommonService } from '../common/service/common/common.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController } from '@angular/common/http/testing';

describe('PlansComponent', () => {
  let component: PlansComponent;
  let fixture: ComponentFixture<PlansComponent>;
  let commonService: CommonService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansComponent, CommonModule ],
      providers: [ Router, CommonService, HttpClient, provideHttpClient() ]
    })
    .compileComponents();

    
    fixture = TestBed.createComponent(PlansComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
