// Mock do módulo @cau/security
import { Injectable, NgModule } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

@Injectable()
export class SecurityService {
  credential: any = {
    user: {
      avatar: '',
      name: 'User',
      title: 'Title',
      nuNotification: 0,
      profile: 'admin'
    }
  };
  onForbidden = new Subject();
  onUnauthorized = new Subject();
  
  constructor() {}
  
  getToken(): string { return ''; }
  isAuthenticated(): boolean { return true; }
  logout(): void {}
  login(credentials: any): Observable<any> { return of({}); }
  invalidate(): void {}
}

export interface IConfig {
  apiUrl?: string;
  authUrl?: string;
  urlLogout?: string;
  rootRoute?: string;
}

export const config: IConfig = {
  apiUrl: '',
  authUrl: '',
  urlLogout: '/logout',
  rootRoute: '/'
};

@Injectable()
export class MenuService {
  constructor() {}
  getMenus(): Observable<any[]> { return of([]); }
}

@Injectable()
export class NotificationService {
  constructor() {}
  getNotifications(): Observable<any[]> { return of([]); }
}

@Injectable()
export class LoginResolve {
  resolve(): Observable<any> { return of({}); }
}

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}

@NgModule({
  providers: [
    SecurityService,
    MenuService,
    NotificationService,
    LoginResolve,
    SecurityInterceptor
  ]
})
export class SecurityModule {
  static forRoot(config?: any): any {
    return {
      ngModule: SecurityModule,
      providers: [
        SecurityService,
        MenuService,
        NotificationService,
        LoginResolve,
        SecurityInterceptor
      ]
    };
  }
}