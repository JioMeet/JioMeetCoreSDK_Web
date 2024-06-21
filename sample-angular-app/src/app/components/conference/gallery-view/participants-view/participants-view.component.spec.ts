import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsViewComponent } from './participants-view.component';

describe('ParticipantsViewComponent', () => {
  let component: ParticipantsViewComponent;
  let fixture: ComponentFixture<ParticipantsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipantsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipantsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
