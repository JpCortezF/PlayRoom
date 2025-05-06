import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
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
    try {
      const userEmail = await this.getUserEmail();
      
      if (userEmail) {
        const emailSplit = userEmail?.split('@')[0] || '';
        const user = await this.dbService.getUserByUsername(emailSplit);
        if (user) {
          this.userloggedIn = {
            username: user.username || emailSplit,
            avatar_url: user.avatar_url,
            name: user.name || '',
            initials: this.getInitials(user.name)
          };
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  private async getUserEmail(): Promise<string | null> {
    const { data: { session } } = await this.sb.supabase.auth.getSession();
    return session?.user.email || null;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  getInitials(name: string | undefined): string {
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


