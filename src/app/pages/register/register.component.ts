import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DatabaseService } from '../../services/database.service';

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
  dbService = inject(DatabaseService);

  userData = {
    email: '',
    password: '',
    username: '',
    name: '',
    last_name: '',
    age: null as number | null,
    auth_id: ''
  }

  errorMessages = {
    email: '',
    password: '',
    name: '',
    last_name: '',
    age: '',
    general: ''
  };
  isLoading = false;

  Register() {
    this.validateForm();
    if (this.hasErrors()) return;

    this.isLoading = true;
    this.errorMessages.general = '';
    this.userData.username = this.userData.email.split('@')[0];

    this.authService.register(this.userData.email, this.userData.password).then((response) => {
      if(response.error){
        throw response.error;
      }
      return this.dbService.createUser({
        auth_id: response.data.user?.id,
        username: this.userData.username,
        name: this.userData.name,
        last_name: this.userData.last_name,
        age: this.userData.age || 0,
        initials: this.getInitials(this.userData.name),
      });
    })
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch((error) => {
      this.errorMessages.general = this.getAuthErrorMessage(error);
      console.error('Registration error:', error);
    })
    .finally(() => {
      this.isLoading = false;
    });
  }
  

  validateForm() {
    this.errorMessages = {
      email: !this.userData.email ? 'El email es requerido' : 
             !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userData.email) ? 'Email inválido' : '',
      password: !this.userData.password ? 'La contraseña es requerida' : 
                this.userData.password.length < 6 ? 'Mínimo 6 caracteres' : '',
      name: !this.userData.name ? 'El nombre es requerido' : 
            !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(this.userData.name) ? 'Solo letras permitidas' : '',
      last_name: !this.userData.last_name ? 'El apellido es requerido' : 
                 !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(this.userData.last_name) ? 'Solo letras permitidas' : '',
      age: !this.userData.age ? 'La edad es requerida' : 
           this.userData.age < 13 ? 'Debes tener al menos 13 años' : 
           this.userData.age > 120 ? 'Edad inválida' : '',
      general: ''
    };
  }

  hasErrors(): boolean {
    return Object.values(this.errorMessages).some(msg => msg !== '');
  }

  private getAuthErrorMessage(error: any): string {
    if (error.message.includes('User already registered')) {
      return 'El email ya está registrado';
    }
    if (error.message.includes('Password should be at least')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return 'Error en el registro. Intenta nuevamente.';
  }

  private getInitials(name: string): string {
    if (!name) return 'US';
    const parts = name.split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : `${name.substring(0, 2)}`.toUpperCase();
  }
}
