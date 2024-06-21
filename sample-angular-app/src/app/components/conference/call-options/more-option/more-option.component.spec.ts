import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreOptionComponent } from './more-option.component';

describe('MoreOptionComponent', () => {
  let component: MoreOptionComponent;
  let fixture: ComponentFixture<MoreOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoreOptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoreOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
