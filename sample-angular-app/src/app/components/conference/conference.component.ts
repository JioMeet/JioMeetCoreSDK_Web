import { Component } from '@angular/core';
import { JmsdkService } from 'src/app/services/jmsdk.service';

@Component({
  selector: 'app-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent {
  name="";
  num=0;
  participantsInCall:any[]=[];
  localpeer:any;
  optionsController={
    more:false
  }
  constructor(
    private jmsdkService:JmsdkService
  ){}

  ngOnInit(): void {
    
    
  }
  changeController(){
    this.optionsController.more=!this.optionsController.more;
  }
  async subscribeToVideo(peer:any){
    const videoTrack = await this.jmsdkService.jmClient.subscribeMedia(peer,"video");
    videoTrack.play(peer.peerId);
  }

}
