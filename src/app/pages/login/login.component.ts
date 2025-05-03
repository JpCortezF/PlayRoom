import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  authService = inject(AuthService);
  router = inject(Router);
  email: string = "";
  password: string = "";

  errorMessages = {
    email: '',
    password: '',
    general: ''
  };

  Login(){
    this.authService.login(this.email, this.password).then((data) => {
      if (data.error) {
        this.handleLoginError(data.error);
      }
    }).catch((error) => {
      console.error('Error inesperado:', error);
      this.errorMessages.general = 'Error durante el login. Intente nuevamente.';
    });
    ;
  }

  resetErrors() {
    this.errorMessages = {
      email: '',
      password: '',
      general: ''
    };
  }

  private handleLoginError(error: any) {
    this.resetErrors();
    const errorMessage = error.message.toLowerCase();

    if (/invalid login credentials/i.test(errorMessage)) {
      this.errorMessages.password = 'Email y/o contraseña incorrectos';
    } else {
      this.errorMessages.general = error.message || 'Error durante el login';
    }
  }
}
