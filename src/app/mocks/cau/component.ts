// Mock do módulo @cau/component
import { NgModule, Injectable, InjectionToken } from '@angular/core';

export interface ValidationResource {
  [key: string]: string;
}

@Injectable()
export class ValidationResourceProvider {
  getResource(): ValidationResource {
    return {};
  }
}

export const CALENDAR_PROVIDER = new InjectionToken<any>('CALENDAR_PROVIDER');

@NgModule({
  providers: [ValidationResourceProvider]
})
export class CalendarModule {}

@NgModule({
  providers: [ValidationResourceProvider]
})
export class ValidationModule {}

@NgModule({})
export class LoaderModule {}