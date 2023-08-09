import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  @Input() title!: string;
  @Input() active = false;

  @HostBinding('class') activeClass = this.active ? 'active' : '';
  
}
