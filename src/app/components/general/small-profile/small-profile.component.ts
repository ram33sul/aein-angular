import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-small-profile',
  templateUrl: './small-profile.component.html',
  styleUrls: ['./small-profile.component.css']
})
export class SmallProfileComponent {
  @Input() heading = '';
  @Input() subHeading = '';
  @Input() imageSrc = '';
}
