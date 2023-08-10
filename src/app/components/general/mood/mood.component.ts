import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Mood } from 'src/interfaces/message';

@Component({
  selector: 'app-mood',
  templateUrl: './mood.component.html',
  styleUrls: ['./mood.component.css']
})
export class MoodComponent implements OnChanges {
  @Input() mood!: Mood;
  @Input() active = false;
  @Output() onClick = new EventEmitter();
  color = '';
  backgroundColor = '';

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['active']){
      if(this.active){
        this.color = 'rgb(var(--background-color))';
        this.backgroundColor = this.mood.color
      } else {
        this.color = this.mood.color
        this.backgroundColor = 'rgb(var(--background-color))'
      }
    }
  }
}
