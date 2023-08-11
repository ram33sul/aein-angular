import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter()
  @Input() type: 'submit' | 'reject' | 'accept' | 'option' | 'cancel' = 'submit';
  @Input() loading = false;

  @HostBinding('class')
  get hostClass() {
    return this.type;
  }

  @HostListener('click')
  clickHandler() {
    if(!this.loading){
      this.onClick.emit();
    }
  }
}
