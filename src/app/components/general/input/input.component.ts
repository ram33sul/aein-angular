import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() value!: string;
  @Input() type: 'text' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() error = '';

  @Output() onChange = new EventEmitter();
}
