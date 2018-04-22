import {Inject, Injectable} from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class SettingsService {

  private theme: BehaviorSubject<string>;

  constructor(@Inject('GLOBAL_CONFIG') private config) {
    this.theme = new BehaviorSubject(config.settings.defaultTheme);
  }

  getAvailableThemes(): {name: string, class: string}[] {
    return this.config.settings.themes;
  }

  setActiveTheme(val) {
    this.theme.next(val);
  }

  get activeTheme() {
    return this.theme.asObservable();
  }
}
