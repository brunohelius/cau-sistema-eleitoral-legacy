import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, timer, of } from 'rxjs';
import { map, catchError, switchMap, tap, retry, retryWhen, delay, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as CryptoJS from 'crypto-js';

export interface User {
  id: number;
  username: string;
  email: string;
  nomeCompleto: string;
  roles: string[];
  twoFactorEnabled?: boolean;
  socialLogins?: SocialLogin[];
  profilePicture?: string;
  lastLogin?: Date;
  emailVerified?: boolean;
  phoneNumber?: string;
  phoneVerified?: boolean;
}

export interface SocialLogin {
  provider: 'google' | 'facebook' | 'apple';
  providerId: string;
  email: string;
  connectedAt: Date;
}

export interface LoginRequest {
  username?: string;
  email?: string;
  password: string;
  rememberMe?: boolean;
  twoFactorCode?: string;
  captchaToken?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nomeCompleto: string;
  cpf?: string;
  telefone?: string;
  acceptTerms: boolean;
  captchaToken?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  requiresTwoFactor?: boolean;
  twoFactorToken?: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
  captchaToken?: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface SocialAuthConfig {
  google?: {
    clientId: string;
    redirectUri: string;
    scope: string;
  };
  facebook?: {
    appId: string;
    redirectUri: string;
    scope: string;
  };
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface RateLimitInfo {
  endpoint: string;
  attempts: number;
  blockedUntil?: number;
  lastAttempt: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthEnhancedService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  
  private tokenRefreshSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private refreshTokenTimer: any;
  
  private rateLimitMap = new Map<string, RateLimitInfo>();
  private readonly MAX_LOGIN_ATTEMPTS = 5;
  private readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutos
  private readonly BLOCK_DURATION = 30 * 60 * 1000; // 30 minutos
  
  private socialAuthConfig: SocialAuthConfig = {
    google: {
      clientId: environment.googleClientId || '',
      redirectUri: `${window.location.origin}/auth/google/callback`,
      scope: 'openid profile email'
    },
    facebook: {
      appId: environment.facebookAppId || '',
      redirectUri: `${window.location.origin}/auth/facebook/callback`,
      scope: 'email,public_profile'
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = this.getSecureStorage('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
    
    this.initializeTokenRefresh();
    this.setupCSRFToken();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // ============= LOGIN METHODS =============
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (this.isRateLimited('login')) {
      return throwError(() => ({
        error: 'Muitas tentativas de login. Tente novamente mais tarde.',
        blockedUntil: this.getRateLimitInfo('login')?.blockedUntil
      }));
    }

    const sanitizedCredentials = this.sanitizeInput(credentials);
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, sanitizedCredentials, {
      headers: this.getSecurityHeaders()
    }).pipe(
      map(response => {
        if (response.requiresTwoFactor) {
          this.setSecureStorage('twoFactorToken', response.twoFactorToken!);
          return response;
        }
        
        if (response.token) {
          this.handleSuccessfulLogin(response, credentials.rememberMe);
        }
        
        this.resetRateLimit('login');
        return response;
      }),
      catchError(error => {
        this.recordFailedAttempt('login');
        console.error('Erro no login:', error);
        return throwError(() => error);
      })
    );
  }

  loginWithTwoFactor(code: string, twoFactorToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin/2fa`, {
      code,
      twoFactorToken
    }, {
      headers: this.getSecurityHeaders()
    }).pipe(
      map(response => {
        if (response.token) {
          this.handleSuccessfulLogin(response, false);
          this.removeSecureStorage('twoFactorToken');
        }
        return response;
      }),
      catchError(error => {
        console.error('Erro na verificação 2FA:', error);
        return throwError(() => error);
      })
    );
  }

  // ============= SOCIAL LOGIN =============
  
  loginWithGoogle(): Observable<any> {
    const googleAuthUrl = this.buildGoogleAuthUrl();
    window.location.href = googleAuthUrl;
    return of(null);
  }

  loginWithFacebook(): Observable<any> {
    const fbAuthUrl = this.buildFacebookAuthUrl();
    window.location.href = fbAuthUrl;
    return of(null);
  }

  handleSocialCallback(provider: string, code: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/social/${provider}/callback`, {
      code,
      redirectUri: this.socialAuthConfig[provider as keyof SocialAuthConfig]?.redirectUri
    }, {
      headers: this.getSecurityHeaders()
    }).pipe(
      map(response => {
        if (response.token) {
          this.handleSuccessfulLogin(response, true);
        }
        return response;
      }),
      catchError(error => {
        console.error(`Erro no login social ${provider}:`, error);
        return throwError(() => error);
      })
    );
  }

  linkSocialAccount(provider: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const authUrl = provider === 'google' ? this.buildGoogleAuthUrl() : this.buildFacebookAuthUrl();
    window.location.href = `${authUrl}&state=link_${token}`;
    return of(null);
  }

  unlinkSocialAccount(provider: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/social/${provider}/unlink`, {
      headers: this.getAuthHeaders()
    });
  }

  // ============= REGISTRATION =============
  
  register(userData: RegisterRequest): Observable<any> {
    if (userData.password !== userData.confirmPassword) {
      return throwError(() => ({ error: 'As senhas não coincidem' }));
    }

    const passwordStrength = this.validatePasswordStrength(userData.password);
    if (!passwordStrength.isValid) {
      return throwError(() => ({ error: passwordStrength.message }));
    }

    const sanitizedData = this.sanitizeInput(userData);
    
    return this.http.post(`${this.apiUrl}/signup`, sanitizedData, {
      headers: this.getSecurityHeaders()
    }).pipe(
      tap(() => {
        this.sendVerificationEmail(userData.email);
      }),
      catchError(error => {
        console.error('Erro no registro:', error);
        return throwError(() => error);
      })
    );
  }

  sendVerificationEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email/send`, { email }, {
      headers: this.getSecurityHeaders()
    });
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email/confirm`, { token }, {
      headers: this.getSecurityHeaders()
    });
  }

  // ============= PASSWORD RESET =============
  
  requestPasswordReset(request: PasswordResetRequest): Observable<any> {
    if (this.isRateLimited('password-reset')) {
      return throwError(() => ({
        error: 'Muitas tentativas. Tente novamente mais tarde.'
      }));
    }

    return this.http.post(`${this.apiUrl}/password/reset-request`, request, {
      headers: this.getSecurityHeaders()
    }).pipe(
      tap(() => this.resetRateLimit('password-reset')),
      catchError(error => {
        this.recordFailedAttempt('password-reset');
        return throwError(() => error);
      })
    );
  }

  resetPassword(resetData: PasswordResetConfirm): Observable<any> {
    if (resetData.newPassword !== resetData.confirmPassword) {
      return throwError(() => ({ error: 'As senhas não coincidem' }));
    }

    const passwordStrength = this.validatePasswordStrength(resetData.newPassword);
    if (!passwordStrength.isValid) {
      return throwError(() => ({ error: passwordStrength.message }));
    }

    return this.http.post(`${this.apiUrl}/password/reset-confirm`, resetData, {
      headers: this.getSecurityHeaders()
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const passwordStrength = this.validatePasswordStrength(newPassword);
    if (!passwordStrength.isValid) {
      return throwError(() => ({ error: passwordStrength.message }));
    }

    return this.http.post(`${this.apiUrl}/password/change`, {
      currentPassword,
      newPassword
    }, {
      headers: this.getAuthHeaders()
    });
  }

  // ============= TWO-FACTOR AUTHENTICATION =============
  
  setupTwoFactor(): Observable<TwoFactorSetup> {
    return this.http.post<TwoFactorSetup>(`${this.apiUrl}/2fa/setup`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  enableTwoFactor(code: string, secret: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/2fa/enable`, {
      code,
      secret
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        const user = this.currentUserValue;
        if (user) {
          user.twoFactorEnabled = true;
          this.updateCurrentUser(user);
        }
      })
    );
  }

  disableTwoFactor(code: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/2fa/disable`, {
      code,
      password
    }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        const user = this.currentUserValue;
        if (user) {
          user.twoFactorEnabled = false;
          this.updateCurrentUser(user);
        }
      })
    );
  }

  generateBackupCodes(): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/2fa/backup-codes`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  verifyBackupCode(code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/2fa/verify-backup`, { code }, {
      headers: this.getAuthHeaders()
    });
  }

  // ============= LOGOUT =============
  
  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: this.getAuthHeaders()
    }).subscribe({
      complete: () => {
        this.clearAuthData();
      },
      error: () => {
        this.clearAuthData();
      }
    });
  }

  private clearAuthData(): void {
    this.clearAllSecureStorage();
    this.currentUserSubject.next(null);
    this.stopTokenRefresh();
    this.router.navigate(['/login']);
  }

  // ============= TOKEN MANAGEMENT =============
  
  getToken(): string | null {
    return this.getSecureStorage('token');
  }

  getRefreshToken(): string | null {
    return this.getSecureStorage('refreshToken');
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, {
      refreshToken
    }, {
      headers: this.getSecurityHeaders()
    }).pipe(
      map(response => {
        if (response.token) {
          this.setSecureStorage('token', response.token);
          this.setSecureStorage('refreshToken', response.refreshToken);
          this.scheduleTokenRefresh(response.expiresIn);
        }
        return response;
      }),
      catchError(error => {
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private initializeTokenRefresh(): void {
    const token = this.getToken();
    if (token && !this.isTokenExpired()) {
      const expiresIn = this.getTokenExpirationTime() - Date.now();
      this.scheduleTokenRefresh(expiresIn / 1000);
    }
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    this.stopTokenRefresh();
    
    const refreshTime = (expiresIn - 60) * 1000;
    if (refreshTime > 0) {
      this.refreshTokenTimer = setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshTime);
    }
  }

  private stopTokenRefresh(): void {
    if (this.refreshTokenTimer) {
      clearTimeout(this.refreshTokenTimer);
      this.refreshTokenTimer = null;
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp <= currentTime;
    } catch (error) {
      return true;
    }
  }

  private getTokenExpirationTime(): number {
    const token = this.getToken();
    if (!token) return 0;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000;
    } catch (error) {
      return 0;
    }
  }

  // ============= ROLE MANAGEMENT =============
  
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    return roles.some(role => user.roles.includes(role));
  }

  hasAllRoles(roles: string[]): boolean {
    const user = this.currentUserValue;
    if (!user) return false;
    
    return roles.every(role => user.roles.includes(role));
  }

  // ============= SECURITY HELPERS =============
  
  private getSecurityHeaders(): HttpHeaders {
    const csrfToken = this.getCSRFToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    if (csrfToken) {
      headers = headers.set('X-CSRF-Token', csrfToken);
    }

    return headers;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = this.getSecurityHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private setupCSRFToken(): void {
    this.http.get(`${this.apiUrl}/csrf-token`).subscribe({
      next: (response: any) => {
        if (response.token) {
          this.setSecureStorage('csrfToken', response.token);
        }
      }
    });
  }

  private getCSRFToken(): string | null {
    return this.getSecureStorage('csrfToken');
  }

  private sanitizeInput(input: any): any {
    if (typeof input === 'string') {
      return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                  .replace(/javascript:/gi, '')
                  .replace(/on\w+\s*=/gi, '');
    }
    
    if (typeof input === 'object' && input !== null) {
      const sanitized: any = {};
      for (const key in input) {
        if (input.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeInput(input[key]);
        }
      }
      return sanitized;
    }
    
    return input;
  }

  private validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, message: `A senha deve ter pelo menos ${minLength} caracteres` };
    }
    
    if (!hasUpperCase) {
      return { isValid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
    }
    
    if (!hasLowerCase) {
      return { isValid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
    }
    
    if (!hasNumbers) {
      return { isValid: false, message: 'A senha deve conter pelo menos um número' };
    }
    
    if (!hasSpecialChar) {
      return { isValid: false, message: 'A senha deve conter pelo menos um caractere especial' };
    }

    return { isValid: true };
  }

  // ============= RATE LIMITING =============
  
  private isRateLimited(endpoint: string): boolean {
    const info = this.rateLimitMap.get(endpoint);
    if (!info) return false;

    const now = Date.now();
    
    if (info.blockedUntil && now < info.blockedUntil) {
      return true;
    }

    if (now - info.lastAttempt > this.RATE_LIMIT_WINDOW) {
      this.rateLimitMap.delete(endpoint);
      return false;
    }

    return info.attempts >= this.MAX_LOGIN_ATTEMPTS;
  }

  private recordFailedAttempt(endpoint: string): void {
    const now = Date.now();
    const info = this.rateLimitMap.get(endpoint) || {
      endpoint,
      attempts: 0,
      lastAttempt: now
    };

    info.attempts++;
    info.lastAttempt = now;

    if (info.attempts >= this.MAX_LOGIN_ATTEMPTS) {
      info.blockedUntil = now + this.BLOCK_DURATION;
    }

    this.rateLimitMap.set(endpoint, info);
  }

  private resetRateLimit(endpoint: string): void {
    this.rateLimitMap.delete(endpoint);
  }

  private getRateLimitInfo(endpoint: string): RateLimitInfo | undefined {
    return this.rateLimitMap.get(endpoint);
  }

  // ============= STORAGE HELPERS =============
  
  private setSecureStorage(key: string, value: string, rememberMe: boolean = false): void {
    const encrypted = this.encrypt(value);
    
    if (rememberMe || key === 'refreshToken') {
      localStorage.setItem(key, encrypted);
      const expiry = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 dias
      localStorage.setItem(`${key}_expiry`, expiry.toString());
    } else {
      sessionStorage.setItem(key, encrypted);
    }
  }

  private getSecureStorage(key: string): string | null {
    let value = sessionStorage.getItem(key) || localStorage.getItem(key);
    
    if (value && localStorage.getItem(`${key}_expiry`)) {
      const expiry = parseInt(localStorage.getItem(`${key}_expiry`)!);
      if (Date.now() > expiry) {
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_expiry`);
        return null;
      }
    }
    
    return value ? this.decrypt(value) : null;
  }

  private removeSecureStorage(key: string): void {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
  }

  private clearAllSecureStorage(): void {
    const keysToRemove = ['token', 'refreshToken', 'currentUser', 'csrfToken', 'twoFactorToken'];
    keysToRemove.forEach(key => this.removeSecureStorage(key));
  }

  private encrypt(text: string): string {
    const key = environment.encryptionKey || 'default-key-change-in-production';
    return CryptoJS.AES.encrypt(text, key).toString();
  }

  private decrypt(ciphertext: string): string {
    const key = environment.encryptionKey || 'default-key-change-in-production';
    const bytes = CryptoJS.AES.decrypt(ciphertext, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // ============= HELPER METHODS =============
  
  private handleSuccessfulLogin(response: LoginResponse, rememberMe: boolean = false): void {
    const user: User = {
      id: response.id,
      username: response.username,
      email: response.email,
      nomeCompleto: response.username,
      roles: response.roles || [],
      lastLogin: new Date()
    };

    this.setSecureStorage('token', response.token, rememberMe);
    this.setSecureStorage('refreshToken', response.refreshToken, true);
    this.setSecureStorage('currentUser', JSON.stringify(user), rememberMe);
    
    this.currentUserSubject.next(user);
    this.scheduleTokenRefresh(response.expiresIn);
  }

  private updateCurrentUser(user: User): void {
    this.setSecureStorage('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private buildGoogleAuthUrl(): string {
    const config = this.socialAuthConfig.google!;
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope,
      access_type: 'offline',
      prompt: 'consent'
    });
    
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  private buildFacebookAuthUrl(): string {
    const config = this.socialAuthConfig.facebook!;
    const params = new URLSearchParams({
      client_id: config.appId,
      redirect_uri: config.redirectUri,
      response_type: 'code',
      scope: config.scope
    });
    
    return `https://www.facebook.com/v12.0/dialog/oauth?${params.toString()}`;
  }

  // ============= USER PROFILE =============
  
  updateProfile(profileData: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/profile`, profileData, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(updatedUser => {
        this.updateCurrentUser(updatedUser);
      })
    );
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.apiUrl}/profile/picture`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.getToken()}`
      })
    }).pipe(
      tap((response: any) => {
        const user = this.currentUserValue;
        if (user && response.profilePicture) {
          user.profilePicture = response.profilePicture;
          this.updateCurrentUser(user);
        }
      })
    );
  }

  deleteAccount(password: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/account`, {
      headers: this.getAuthHeaders(),
      body: { password }
    }).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }

  // ============= SESSION MANAGEMENT =============
  
  getActiveSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/sessions`, {
      headers: this.getAuthHeaders()
    });
  }

  revokeSession(sessionId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sessions/${sessionId}`, {
      headers: this.getAuthHeaders()
    });
  }

  revokeAllSessions(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/sessions`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(() => {
        this.clearAuthData();
      })
    );
  }
}