import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnChanges {

  @Input() title!: string;
  @Input() active = false;

  @HostBinding('class.active') activeClass = false;

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['active']){
      this.activeClass = this.active
    }
  }
  
}
