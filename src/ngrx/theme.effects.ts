import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { toggleDarkMode, toggleLightMode } from './theme.action';

@Injectable()
export class ThemeEffects {
  
}