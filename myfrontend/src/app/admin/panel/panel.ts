import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../admin'; 
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel.html',
  styleUrls: ['./panel.css']
})
export class PanelComponent implements OnInit {
  adminService = inject(AdminService);

  // Señales de estado
  petitions = signal<any[]>([]);
  loading = signal<boolean>(true);
  activeSection = signal<'petitions'|'categories' |'users'>('petitions'); // Para el menú lateral

  categories = signal<any[]>([]);

  ngOnInit() {
    this.loadingPetitions();
  }

  changeSections(seccion: 'petitions'|'categories' |'users') {
    this.activeSection.set(seccion);
  }

  loadingPetitions() {
    this.loading.set(true);
    this.adminService.getPetitionsAdmin().subscribe({
      next: (res: any) => {
        let array = [];
        
        if (res && res.data && Array.isArray(res.data)) {
          array = res.data;
        } else if (Array.isArray(res)) {
          array = res;
        } else {
          console.warn('El servidor no devolvió un array reconocible:', res);
        }

        this.petitions.set(array);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando el panel', err);
        this.loading.set(false);
      }
    });
  }

  loadingCategories(){
    this.loading.set(true);
    this.adminService.getCategoriesAdmin().subscribe({
     next: (res: any) => {
        let array = [];
        
        if (res && res.data && Array.isArray(res.data)) {
          array = res.data;
        } else if (Array.isArray(res)) {
          array = res;
        } else {
          console.warn('El servidor no devolvió un array reconocible:', res);
        }

        this.categories.set(array);
        this.loading.set(false);
        console.log(array);
      },
      error: (err) => {
        console.error('Error cargando el panel de categorias', err);
        this.loading.set(false);
      }
    });
  }

  deletePetition(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta petición? Esta acción NO se puede deshacer.')) {
      this.adminService.deletePetitionAdmin(id).subscribe({
        next: () => {
          // Actualizamos la vista quitando la borrada al instante
          this.petitions.update(news => news.filter(p => p.id !== id));
          alert('Petición eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al eliminar la petición');
        }
      });
    }
  }

  deleteCategory(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta cateogoria? Esta acción NO se puede deshacer.')) {
      this.adminService.deleteCategoriesAdmin(id).subscribe({
        next: () => {
          // Actualizamos la vista quitando la borrada al instante
          this.categories.update(news => news.filter(p => p.id !== id));
          alert('Categoria eliminada correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar', err);
          alert('Hubo un error al eliminar la categoria');
        }
      });
    }
  }
}