import { Component, EventEmitter, HostBinding, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-small-profile',
  templateUrl: './small-profile.component.html',
  styleUrls: ['./small-profile.component.css']
})
export class SmallProfileComponent implements OnChanges {
  @Input() heading = '';
  @Input() subHeading = '';
  @Input() imageSrc = '';
  @Input() subHeadingActive = false;
  @Input() notificationCount = 0;
  @Input() active = false;
  @Output() onClick = new EventEmitter();

  @HostBinding('class.active') activeClass = false;

  @HostListener('click')
  clickHandler() {
    this.onClick.emit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['active']){
      this.activeClass = this.active
    }
  }

}
