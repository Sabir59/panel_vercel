import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth.service';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule, HttpClientModule,ToastModule,ButtonModule,RippleModule],
  templateUrl: './login.component.html',
  styleUrl: '../styles.components.scss',
  providers: [HttpClient, AuthService,MessageService],
})
export class LoginComponent {
  username = '';
  password = '';


  authService = inject(AuthService);
  router = inject(Router);

  constructor(private messageService: MessageService) { }

  login(event: Event) {
    event.preventDefault();
    this.authService
      .login({
        user_login: this.username,
        user_nicename: this.password,
      })
      .subscribe(
        () => {
          this.router.navigateByUrl('/dashboard/welcome');
        },
        (error) => {
          this.loginSuccessToast()
          this.showErrorToast('Login failed. Please check your credentials.');
          return false; // Return false on error
        }
      );
  }
  
  showErrorToast(message: string) {
    // Show error toast message
  }
  

  loginSuccessToast() {
    this.messageService.add({ severity: 'error', summary: 'error', detail: 'Invalid Credentials'});
}
}
