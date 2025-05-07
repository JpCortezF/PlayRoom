import { Component, inject, Input } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { SupabaseService } from '../../../services/supabase.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  sb = inject(SupabaseService);
  router = inject(Router);
  dbService = inject(DatabaseService);
  @Input() iconUrl!: string; 

  userloggedIn: {
    username: string,
    avatar_url?: string,
    name: string,
    initials: string
  } = {
    username: '',
    name: '',
    initials: 'US'
  } 
  
  isDropdownOpen = false;

  async ngOnInit(): Promise<void> {
    initFlowbite();
  
    // para que Flowbite funcione tras navegar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        initFlowbite();
      }, 100);
    });
  
    this.authService.currentUser$.subscribe(async (user) => {
      if (!user) {
        return;
      }
  
      try {
        const emailSplit = user.email?.split('@')[0] || '';
        const userFromDb = await this.dbService.getUserByUsername(emailSplit);
        if (userFromDb) {
          this.userloggedIn = {
            username: userFromDb.username || emailSplit,
            name: userFromDb.name || '',
            initials: userFromDb.initials || 'US',
          };
        }
      } catch (error) {
        console.error('Error al obtener el nombre de usuario:', error);
      }
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  public getInitials(name: string | undefined): string {
    if (!name) return 'US';
    // Elimina espacios extras y divide por palabras
    const words = name?.trim().split(/\s+/);
    
    let initials = '';
    if (words.length >= 2) {
      initials = words[0][0] + words[1][0];
    } else if (words.length === 1 && words[0].length >= 2) {
      initials = words[0].substring(0, 2);
    } else if (words[0].length === 1) {
      initials = words[0] + 'U'; // Si solo tiene 1 letra
    }
    
    return initials.toUpperCase();
  }
}


