import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  supabase: SupabaseClient<any, "public", any>;

  constructor() {
    this.supabase = createClient('https://lywvfyqtzcmaljbxuttn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5d3ZmeXF0emNtYWxqYnh1dHRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwNjczMTksImV4cCI6MjA2MTY0MzMxOX0.j2BlQGcbWvoWSMPpzhYZtZ1GAj7Tw6_fWe0J31vYCww');
  }
}
