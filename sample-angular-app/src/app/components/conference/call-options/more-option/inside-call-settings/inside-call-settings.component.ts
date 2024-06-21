import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-inside-call-settings',
  templateUrl: './inside-call-settings.component.html',
  styleUrls: ['./inside-call-settings.component.scss']
})
export class InsideCallSettingsComponent {
  @Output() close = new EventEmitter();
  
  goBack(){
    this.close.emit();

  }

  closeView(){

  }
}
