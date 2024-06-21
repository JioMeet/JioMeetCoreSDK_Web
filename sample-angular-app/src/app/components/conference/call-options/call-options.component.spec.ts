import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallOptionsComponent } from './call-options.component';

describe('CallOptionsComponent', () => {
  let component: CallOptionsComponent;
  let fixture: ComponentFixture<CallOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
