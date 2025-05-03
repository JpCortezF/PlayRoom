import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);
  newUserMail: string = "";
  newUserPass: string = "";
  errorMessages = {
    email: '',
    password: '',
    general: ''
  };

  Register() {
    if (!this.validateForm()) return;
  
    this.authService.register(this.newUserMail, this.newUserPass)
      .then((response) => {
        if (response.error) {
          this.handleRegistrationError(response.error);
        } else {
          this.router.navigate(['/']);
        }
      })
      .catch((error) => {
        console.error('Error inesperado:', error);
        this.errorMessages.general = 'Error durante el registro. Intente nuevamente.';
      });
  }
  

  validateForm(): boolean {
    this.resetErrors();
    
    if (!this.newUserMail) {
      this.errorMessages.email = 'Email requerido';
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newUserMail)) {
      this.errorMessages.email = 'Ingrese un mail válido';
      return false;
    }

    if (!this.newUserPass) {
      this.errorMessages.password = 'Contraseña requerida';
      return false;
    } else if (this.newUserPass.length < 6) {
      this.errorMessages.password = 'Mínimo 6 caracteres';
      return false;
    }

    return true;
  }

  resetErrors() {
    this.errorMessages = {
      email: '',
      password: '',
      general: ''
    };
  }

  private handleRegistrationError(error: any) {
    
    this.resetErrors();
  
    if (error.message.includes('User already registered') || 
        error.message.includes('Email already in use')) {
      this.errorMessages.email = 'El email ya está registrado';
    } else if (error.message.includes('Password should be at least')) {
      this.errorMessages.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (error.message.includes('Invalid email')) {
      this.errorMessages.email = 'Formato de email inválido';
    } else {
      this.errorMessages.general = error.message || 'Error durante el registro';
    }
  }
}
