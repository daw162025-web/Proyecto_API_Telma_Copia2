import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Petition } from '../../models/petition';
import { PetitionService } from '../../petition.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-my-signatures',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-signatures.html',
  styleUrl: './my-signatures.css'
})
export class MySignaturesComponent implements OnInit {
  private petitionService = inject(PetitionService);
  public authService = inject(AuthService);

  public signedPetitions = signal<Petition[]>([]);
  public isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadMySignatures();
  }

  loadMySignatures() {
    this.isLoading.set(true);

    this.petitionService.getMySignatures().subscribe({
      next: (data: Petition[]) => {
        console.log('DATOS RECIBIDOS DEL BACKEND:', data);
        this.signedPetitions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('ERROR NUEVO EN FIRMAS:', err);
        this.isLoading.set(false);
      }
    });
  }
  getPetitionImage(pet: any): string {
    if (pet.files && pet.files.length > 0) {
      const lastFile = pet.files[pet.files.length - 1];
      return `http://localhost:8000/storage/${lastFile.file_path}`;
    }
    if (pet.image) {
      return `http://localhost:8000/storage/${pet.image}`;
    }
    return 'assets/imagenes/placeholder.jpg';
  }
}