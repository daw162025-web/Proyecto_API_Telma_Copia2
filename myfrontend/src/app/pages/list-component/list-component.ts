import { Component,signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Petition } from '../../models/petition';
import { PetitionService } from '../../petition.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-list-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-component.html',
  styleUrl: './list-component.css',
})
export class ListComponent implements OnInit {
  public petitionService = inject(PetitionService);
  public authService = inject(AuthService); 
  private route = inject(ActivatedRoute);

  selectedCategory = signal<string>('all');
  selectedStatus = signal<string>('all');

  public petitions: Petition[] = [];
  public allPetitions: Petition[] = [];

// Se recalcula solo cuando cambias un filtro
  filteredPetitions = computed(() => {
    let result = this.petitionService.allPetitions() as any[];
    const cat = this.selectedCategory();
    const stat = this.selectedStatus();
    const userId = this.authService.currentUser()?.id;

    // Categoría
    if (cat !== 'all') {
      result = result.filter(p => p.category_id == cat); 
    }

    //Firmadas / No firmadas
    if (stat !== 'all' && userId) {
      result = result.filter(p => {
        const hasSigned = p.users?.some((u: any) => u.id === userId);
        return stat === 'signed' ? hasSigned : !hasSigned;
      });
    }
    return result; 
  });

  ngOnInit(): void {
    this.petitionService.fetchCategories().subscribe();
    this.petitionService.fetchPetitions().subscribe();
    // Si entramos a la página con una categoría en la URL, la aplicamos al Signal
    // this.route.queryParams.subscribe((params) => {
    //   if (params['category_id']) {
    //     this.selectedCategory.set(params['category_id']);
    //   }
    // });
  }
  
  getCategoryName(id: number): string {
    const categories = this.petitionService.allCategories();
    const found = categories.find(c => c.id === id);
    return found ? found.name : 'Sin categoría';
  }

  loadPetitions(categoryId?: string) {
    this.authService.loading.set(true); 

    this.petitionService.fetchPetitions().subscribe({
      next: (data: Petition[]) => {
        this.allPetitions = data;
        this.petitions = categoryId 
          ? this.allPetitions.filter(p => p.category_id == Number(categoryId)) 
          : data;
        
        this.authService.loading.set(false); 
      },
      error: (err) => {
        console.error('Error:', err);
        this.authService.loading.set(false); 
      }
    });
  }

  sign(petition: Petition) {
    if (!petition.id) return;

    this.petitionService.sign(petition.id).subscribe({
      next: () => {
        petition.signeds = (petition.signeds || 0) + 1;
        alert('¡Gracias por firmar la petición!');
      },
      error: (err) =>
        alert('Error al firmar: ' + (err.error?.message || 'Error desconocido')),
    });
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this petition?')) {
      this.petitionService.delete(id).subscribe({
        next: () => {
          // Actualizamos los arrays locales eliminando la ID
          this.petitions = this.petitions.filter((p) => p.id !== id);
          this.allPetitions = this.allPetitions.filter((p) => p.id !== id);
        },
        error: (err) => alert('Could not delete petition'),
      });
    }
  }

  getImage(petition: any): string {
    if (petition.files && petition.files.length > 0) {
      return 'http://localhost:8000/storage/' + petition.files[0].file_path;
    }
    
    if (petition.image) {
      return 'http://localhost:8000/storage/' + petition.image;
    }
    
    return 'assets/imagenes/placeholder.jpg';
  }

  getNow() {
    return Date.now();
  }
}