// Mock do módulo @cau/layout
import { Component, Injectable, NgModule } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'layouts-component',
  template: '<router-outlet></router-outlet>'
})
export class LayoutsComponent {}

@Component({
  selector: 'gerar-cookie',
  template: ''
})
export class GerarCookieComponent {}

@Injectable()
export class LayoutsService {
  onLoadUser = new Subject();
  onLogout = new Subject();
  onLoadMenu = new Subject();
  onLoadNotification = new Subject();
  showNavLeft = true;
  showNavTop = true;
  isContentFullPage = false;
  
  constructor() {}
}

export interface Menu {
  id: string;
  title: string;
  icon?: string;
  children?: Menu[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  nuNotification?: number;
  profile?: string;
}

export const MESSAGE_RESOURCE_LAYOUT = {
  REQUIRED: 'Campo obrigatório',
  INVALID: 'Campo inválido'
};

@NgModule({
  declarations: [
    LayoutsComponent,
    GerarCookieComponent
  ],
  exports: [
    LayoutsComponent,
    GerarCookieComponent
  ],
  providers: [LayoutsService]
})
export class LayoutsModule {
  static forRoot(): any {
    return {
      ngModule: LayoutsModule,
      providers: [LayoutsService]
    };
  }
}

@NgModule({
  declarations: [],
  exports: []
})
export class GerarCookieModule {
  static forRoot(config?: any): any {
    return {
      ngModule: GerarCookieModule,
      providers: []
    };
  }
}