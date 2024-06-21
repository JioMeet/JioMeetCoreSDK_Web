import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { JmsdkService } from 'src/app/services/jmsdk.service';

@Component({
  selector: 'app-participants-view',
  templateUrl: './participants-view.component.html',
  styleUrls: ['./participants-view.component.scss']
})
export class ParticipantsViewComponent implements OnChanges, OnInit,OnDestroy,AfterViewInit {


  @Input() remotePeer;
  @Input() isSpeaking;
  @Input() hasVideo;
  initialColor=''
  subs = [];
  colors = {
    a: '#F38282',
    b: '#DEB018',
    c: '#79CB09',
    d: '#41C6AF',
    e: '#FA47AD',
    f: '#8395FC',
    g: '#039BE5',
    h: '#F38282',
    i: '#DEB018',
    j: '#79CB09',
    k: '#41C6AF',
    l: '#FA47AD',
    m: '#8395FC',
    n: '#039BE5',
    o: '#F38282',
    p: '#DEB018',
    q: '#79CB09',
    r: '#41C6AF',
    s: '#FA47AD',
    t: '#8395FC',
    u: '#039BE5',
    v: '#F38282',
    w: '#DEB018',
    x: '#79CB09',
    y: '#41C6AF',
    z: '#FA47AD'
};

  constructor(private jmsdkService: JmsdkService) {

  }

  ngOnInit(): void {
    this.setInitialColor()
  }
  
  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['hasVideo']?.currentValue && !this.remotePeer?.isLocal){
      this.subscribeToVideo();
    }
  }
  setInitialColor(){
    let first_letter=this.remotePeer?.name?.toLowerCase().substring(0, 1);
    this.initialColor=this.colors[first_letter];
  }


  async subscribeToVideo() {
    const videoTrack = await this.jmsdkService.jmClient.subscribeMedia(this.remotePeer, "video");
    videoTrack.play(this.remotePeer.peerId);
  }

  ngOnDestroy(): void {
    this.subs.forEach((s)=> s.unsubscribe())
  }
}
