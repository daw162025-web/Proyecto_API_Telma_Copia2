import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class AdminService {
  private http = inject(HttpClient);
  private readonly API_ADMIN_PET_URL = 'http://localhost:8000/api/admin/petitions';
  private readonly API_ADMIN_CAT_URL = 'http://localhost:8000/api/admin/categories';

  // Obtiene todas las peticiones 
  getPetitionsAdmin(): Observable<any[]> {
    return this.http.get<any>(this.API_ADMIN_PET_URL).pipe(
      map(res => res.data || res) 
    );
  }

  deletePetitionAdmin(id: number) {  
      return this.http.delete(`${this.API_ADMIN_PET_URL}/${id}`);
    }

  getCategoriesAdmin():Observable<any[]> {
    return this.http.get<any>(this.API_ADMIN_CAT_URL).pipe(
      map(res => res.data || res) 
    );
  }

  deleteCategoriesAdmin(id: number) {  
      return this.http.delete(`${this.API_ADMIN_CAT_URL}/${id}`);
  }
}