import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleComponent } from './example.component';
import { CommonModule } from '@angular/common';
import { ExDirDirective } from './dir/ex-dir.directive';
import { ExPipePipe } from './pipe/ex-pipe.pipe';
import { provideHttpClient } from '@angular/common/http';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent, CommonModule, ExDirDirective, ExPipePipe ],
      providers: [ provideHttpClient() ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
