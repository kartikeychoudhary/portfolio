import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'kartikey-portfolio';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Initialize auth state from localStorage
    this.authService.initializeAuth();
  }
}
