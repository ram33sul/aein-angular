import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.css']
})
export class IconComponent {
  @Input() icon!: "like" | "dislike" | "comment" | "reply" | "share";
  @Input() active = false;
}
