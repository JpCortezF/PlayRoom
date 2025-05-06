import { Component, Output } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/general-components/navbar/navbar.component";
import { FooterComponent } from './components/general-components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gameroom';
  @Output() iconUrl: string = 'https://lywvfyqtzcmaljbxuttn.supabase.co/storage/v1/object/public/playroom-storage//playroom_icon.png';
  @Output() userImageUrl: string = 'https://lywvfyqtzcmaljbxuttn.supabase.co/storage/v1/object/public/playroom-storage//user_icon.png';
}
