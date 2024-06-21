import { Component, OnInit } from '@angular/core';
import { JmsdkService } from 'src/app/services/jmsdk.service';
import { JMDeviceManager } from '@jiomeet/core-sdk-web';

@Component({
  selector: 'app-call-audio-settings',
  templateUrl: './call-audio-settings.component.html',
  styleUrls: ['./call-audio-settings.component.scss'],
})
export class CallAudioSettingsComponent implements OnInit {
  selectedMic: any;
  showMicDropDown = false;
  showSpeakerDropDown = false;
  showCameraDropDown = false;
  availableAudio: any;
  selectedCamera: any;
  selectedSpeaker: any;

  constructor(private jmsdkService: JmsdkService) {}

  ngOnInit(): void {
    this.availableAudio = JMDeviceManager.getDevices();
    this.selectedMic = JMDeviceManager.audioInput[0];
    this.selectedSpeaker = JMDeviceManager.audioOutput[0];
    this.selectedCamera = JMDeviceManager.videoInput[0];
  }

  toggleMicDropDown() {
    this.showMicDropDown = !this.showMicDropDown;
  }

  toggleSpeakerDropDown() {
    this.showSpeakerDropDown = !this.showSpeakerDropDown;
  }
  toggleCameraDropDown() {
    this.showCameraDropDown = !this.showCameraDropDown;
  }
  selectMicrophone(mic: any) {
    this.selectedMic = mic;
    this.jmsdkService.jmClient.setAudioInputDevice(mic.deviceId);
  }
  selectCamera(cam: any) {
    this.selectedCamera = cam;
    this.jmsdkService.jmClient.setVideoDevice(cam?.deviceId);
  }
  selectSpeaker(speaker: any) {
    this.selectedSpeaker = speaker;
    this.jmsdkService.jmClient.setAudioOutputDevice(speaker.deviceId);
  }
}
