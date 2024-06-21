import { Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { JmsdkService } from 'src/app/services/jmsdk.service';

@Component({
  selector: 'app-call-controls',
  templateUrl: './call-controls.component.html',
  styleUrls: ['./call-controls.component.scss']
})
export class CallControlsComponent implements OnInit {
  @ViewChild('network') networkIndicator: ElementRef;
  @Output() changeControl = new EventEmitter();
  isLocalVideoOn = false;
  isScreenShare = false;
  micMuted = true;
  videoMuted = true;
  signalQuality='NONE'
  color: "grey-100" | "grey-80" | "grey-60" | "primary" | "primary-60" | "secondary" | "sparkle" | "error" | "success" | "warning" = 'primary';
  constructor(private jmsdkService: JmsdkService,
              private rederer:Renderer2      
    ) {
    this.color = 'primary';

  }
  ngOnInit(): void {
    window.onbeforeunload = async () => {
      await this.leave();
  };
    this.jmsdkService.getLocalParticipant().subscribe((data) => {
      switch (data.action) {
        case 'videoOn':
          this.videoMuted = false;
          break
        case 'videoOff':
          this.videoMuted = true;
          break
        case 'startShare':
          this.isScreenShare = true;
          break
        case 'stopShare':
          this.isScreenShare = false;
          break
        case 'audioOff':
          this.micMuted=true;
          break
        case 'audioOn':
          this.micMuted=false;
          break
        case 'networkQuality':
          this.signalQuality=data?.data;
          this.updateNetworkQuality();
          break
        default:
          break
      }
    })
  }

  updateNetworkQuality(){
    switch(this.signalQuality){
      case "GOOD":
        this.rederer.setStyle(this.networkIndicator.nativeElement,'backgroundColor', '#0E8147');
        break
      case "BAD":
        this.rederer.setStyle(this.networkIndicator.nativeElement,'backgroundColor', '#FA7D19');
        break;
      case "VERYBAD":
        this.rederer.setStyle(this.networkIndicator.nativeElement,'backgroundColor', '#F50031');
        break;
    }
  }

  async toggleVideo() {
    await this.jmsdkService.toggleVideoStatus();
  }

  async toggleAudio() {
    await this.jmsdkService.toggleMicStatus();
  }

  async toggleScreenShare() {
    if (this.isScreenShare) {
      await this.stopScreenShare();
    } else {
      await this.startScreenShare();
    }

  }
  toggleMore() {
    this.changeControl.emit();
  }
  async stopScreenShare() {
    await this.jmsdkService.stopScreenShare();

  }

  async leave() {
    await this.jmsdkService.leaveMeeting();
  }

  async startScreenShare() {
    await this.jmsdkService.startScreenShare();
  }

}
