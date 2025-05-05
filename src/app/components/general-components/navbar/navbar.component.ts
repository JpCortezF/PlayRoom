import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  @Input() imageUrl!: string;
  @Input() userImageUrl!: string;

  ngOnInit(): void {
    initFlowbite();
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
