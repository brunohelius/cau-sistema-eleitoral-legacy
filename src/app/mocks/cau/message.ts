// Mock do módulo @cau/message
import { Injectable, NgModule } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class MessageService {
  constructor() {}
  
  success(message: string): void { console.log('Success:', message); }
  error(message: string): void { console.error('Error:', message); }
  warning(message: string): void { console.warn('Warning:', message); }
  info(message: string): void { console.info('Info:', message); }
  confirm(message: string): Observable<boolean> { return of(true); }
  addConfirmYesNo(message: string, yesCallback: Function, noCallback?: Function): void {
    if (confirm(message)) {
      yesCallback();
    } else if (noCallback) {
      noCallback();
    }
  }
  addMsgDanger(message: string): void { console.error('Danger:', message); }
  addMsgSuccess(message: string): void { console.log('Success:', message); }
  addMsgWarning(message: string): void { console.warn('Warning:', message); }
  addMsgInfo(message: string): void { console.info('Info:', message); }
}

export interface MessageResource {
  [key: string]: string;
}

export const MESSAGE_RESOURCE_CONFIRM: MessageResource = {
  CONFIRM_DELETE: 'Deseja realmente excluir?',
  CONFIRM_SAVE: 'Deseja salvar as alterações?'
};

@Injectable()
export class MessageResourceProvider {
  getResource(): MessageResource {
    return {};
  }
}

@NgModule({
  providers: [
    MessageService,
    MessageResourceProvider
  ]
})
export class MessageModule {
  static forRoot(): any {
    return {
      ngModule: MessageModule,
      providers: [
        MessageService,
        MessageResourceProvider
      ]
    };
  }
}