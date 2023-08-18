import { createReducer, on } from '@ngrx/store';
import { toggleDarkMode, toggleLightMode } from './theme.action';
import { initialThemeState, ThemeState } from './theme.state';

export const themeReducer = createReducer(
  initialThemeState,
  on(toggleDarkMode, (state) => ({ ...state, darkMode: true })),
  on(toggleLightMode, (state) => ({ ...state, darkMode: false }))
);