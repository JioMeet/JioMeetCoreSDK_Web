import { Component } from '@angular/core';

@Component({
  selector: 'app-more-option',
  templateUrl: './more-option.component.html',
  styleUrls: ['./more-option.component.scss']
})
export class MoreOptionComponent {
  settingSelected=false;



  selectSettings(bool: boolean) {
    this.settingSelected=bool;
    }


closeView() {
   
}

toggleFullScreenMode(event: MouseEvent) {
   
}



}
