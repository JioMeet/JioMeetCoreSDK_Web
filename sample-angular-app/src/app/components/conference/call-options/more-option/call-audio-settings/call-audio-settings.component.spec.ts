import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallAudioSettingsComponent } from './call-audio-settings.component';

describe('CallAudioSettingsComponent', () => {
  let component: CallAudioSettingsComponent;
  let fixture: ComponentFixture<CallAudioSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallAudioSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CallAudioSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
