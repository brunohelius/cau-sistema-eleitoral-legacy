import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Sistema Eleitoral CAU - Administração';
  isLoggedIn = false;
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      
      if (!this.isLoggedIn && this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
    });
  }
}