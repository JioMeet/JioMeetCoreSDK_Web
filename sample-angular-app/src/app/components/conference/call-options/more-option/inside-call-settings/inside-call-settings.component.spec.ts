import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsideCallSettingsComponent } from './inside-call-settings.component';

describe('InsideCallSettingsComponent', () => {
  let component: InsideCallSettingsComponent;
  let fixture: ComponentFixture<InsideCallSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsideCallSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsideCallSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
