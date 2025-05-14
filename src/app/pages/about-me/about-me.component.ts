import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {
  userData: any;
  isLoading = true;
  error = false;
  iconUrl: string = 'https://lywvfyqtzcmaljbxuttn.supabase.co/storage/v1/object/public/playroom-storage//J-BUNKER.png';
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://api.github.com/users/JpCortezF').subscribe({
      next: (data) => {
        this.userData = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = true;
        this.isLoading = false;
      }
    });
  }
}
