import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  handleChangeTheme() {
    const theme = getComputedStyle(document.documentElement).getPropertyValue('--background-color') === '0, 0, 0' ? 'dark' : 'light';
    const root = document.documentElement.style;
    const background = theme === 'dark' ? '256, 256, 256' : '0, 0, 0'
    const foreground = theme === 'dark' ? '0, 0, 0' : '256, 256, 256'
    root.setProperty('--background-color', background);
    root.setProperty('--foreground-color', foreground)
  }
}
