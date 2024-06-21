import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { JmsdkService } from './services/jmsdk.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreviewComponent } from './components/preview/preview.component';
import { ConferenceComponent } from './components/conference/conference.component';
import { FormStyle } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CallControlsComponent } from './components/conference/call-controls/call-controls.component';
import { GalleryViewComponent } from './components/conference/gallery-view/gallery-view.component';
import { CallOptionsComponent } from './components/conference/call-options/call-options.component';
import { MoreOptionComponent } from './components/conference/call-options/more-option/more-option.component';
import { InsideCallSettingsComponent } from './components/conference/call-options/more-option/inside-call-settings/inside-call-settings.component';
import { CallAudioSettingsComponent } from './components/conference/call-options/more-option/call-audio-settings/call-audio-settings.component';
import { ParticipantsViewComponent } from './components/conference/gallery-view/participants-view/participants-view.component';

@NgModule({
  declarations: [
    AppComponent,
    PreviewComponent,
    ConferenceComponent,
    CallControlsComponent,
    GalleryViewComponent,
    CallOptionsComponent,
    MoreOptionComponent,
    InsideCallSettingsComponent,
    CallAudioSettingsComponent,
    ParticipantsViewComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [JmsdkService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {}
}
