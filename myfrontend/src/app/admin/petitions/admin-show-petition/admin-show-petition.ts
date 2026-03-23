import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PetitionService } from '../../../petition.service'; 
@Component({
  selector: 'app-admin-show-petition',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-show-petition.html',
  styleUrl: './admin-show-petition.css',
})
export class AdminShowPetition implements OnInit{
private route = inject(ActivatedRoute);
  public petitionService = inject(PetitionService);

  // Señales de estado
  petition = signal<any>(null);
  loading = signal<boolean>(true);

  ngOnInit() {
    // Capturamos el ID de la URL
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPetition(Number(id));
    }
  }

  loadPetition(id: number) {
    this.loading.set(true);
    this.petitionService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        this.petition.set(data); // Guardamos la petición entera en la señal
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar los detalles de la petición', err);
        this.loading.set(false);
      }
    });
  }
}
