import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { JmsdkService } from 'src/app/services/jmsdk.service';
import { JMDeviceManager } from '@jiomeet/core-sdk-web';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  localpeer: any;
  isLocalMicOn = false;
  isLocalVideoOn = false;
  vb = 0;
  subs: any[] = [];
  constructor(private fb: FormBuilder, private jmSdkService: JmsdkService) {
    this.form = this.fb.group({
      meetingId: [],
      name: [[]],
      pin: [null, []],
    });
  }
  ngOnInit(): void {
    this.registerDevices();

    this.jmSdkService.createPreview();
    this.subs.push(
      this.jmSdkService.getLocalParticipant().subscribe(async (data) => {
        if (data.action == 'videoOn') {
          const videoTrack = data.localpeer;
          videoTrack.play('localpeer');
        }
      })
    );
  }
  async toggleVb() {
    this.vb += 1;
    if (this.vb == 1) {
      await this.jmSdkService.preview.setBackgroundBlurring('5');
    } else if (this.vb == 2) {
      await this.jmSdkService.preview.setBackgroundImage(
        'assets/images/bg.png'
      );
      this.vb = -1;
    } else if (this.vb == 0) {
      await this.jmSdkService.preview.removeVirtualBackground();
    }
  }
  async registerDevices() {
    await JMDeviceManager.getMediaPermissions(true, true);

    JMDeviceManager.getDevices();
  }
  onPaste(event: ClipboardEvent) {
    setTimeout(() => {
      const value = (event.target as HTMLInputElement).value;
      if (value.includes('-')) {
        (event.target as HTMLInputElement).value = value.replace(/-/g, ' ');
      } else if (!/\s/.test(value)) {
        if (!/^[1-9]\d*$/.test(value)) {
          const meetingId = this.getParameterByName('meetingId', value);
          const pin = this.getParameterByName('pwd', value);
          if (meetingId) {
            this.form.patchValue({ meetingId });
          }
          if (pin) {
            this.form.patchValue({ pin });
          }
          (event.target as HTMLInputElement).value = `${meetingId?.substring(
            0,
            3
          )} ${meetingId?.substring(3, 6)} ${meetingId?.substring(6)}`;
          return;
        }
        (event.target as HTMLInputElement).value = `${value.substring(
          0,
          3
        )} ${value.substring(3, 6)} ${value.substring(6)}`;
      }
    }, 0);
  }

  getParameterByName(name: string, url?: string) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  async toggleVideo() {
    await this.jmSdkService
      .toggleLocalVideoStatus()
      .then(() => {
        this.isLocalVideoOn = !this.isLocalVideoOn;
      })
      .catch(() => {});
  }

  async toggleAudio() {
    await this.jmSdkService
      .toggleLocalMicStatus()
      .then(() => {
        this.isLocalMicOn = !this.isLocalMicOn;
      })
      .catch(() => {});
  }
  join() {
    this.jmSdkService.joinCall(
      this.form.value.meetingId,
      this.form.value.pin,
      this.form.value.name,
      {
        isMicMuted: !this.isLocalMicOn,
        VideoMuted: !this.isLocalVideoOn,
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => {
      s.unsubscribe();
    });
  }
}
