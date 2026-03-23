import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PetitionService } from '../../../petition.service'; // Ajusta la ruta a tu servicio

@Component({
  selector: 'app-admin-edit-peticion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink], // Importante el FormsModule para el formulario
  templateUrl: './admin-edit-petition.html',
  styleUrls: ['./admin-edit-petition.css']
})
export class AdminEditPetitionComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public petitionService = inject(PetitionService);

  selectedFile: File[] = [];
  actualFile = signal<any[]>([]); // Guarda las fotos que ya tiene
  filesToDelete: number[] = [];

  // Señales de estado
  petitionId = signal<number | null>(null);
  loading = signal<boolean>(true);

  categories = signal<any[]>([]);

  // Objeto donde guardaremos los datos del formulario
  formData: any = {
    title: '',
    description: '',
    category_id: ''
  };
  ngOnInit() {
    // 1. Capturamos el ID de la URL (ej: /admin/peticiones/edit/5)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.petitionId.set(Number(id));
      this.loadPetition(this.petitionId()!);
    }
    this.loadCategories();
  }

  loadPetition(id: number) {
    this.loading.set(true);
    this.petitionService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.data || res;
        
        this.formData = {
          title: data.title,
          description: data.description,
          category_id: data.category_id ? data.category_id.toString() : ''
        };
        this.actualFile.set(data.files || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la petición', err);
        alert('No se pudo cargar la petición');
        this.router.navigate(['/admin']);
      }
    });
  }

  loadCategories() {
    // Asegúrate de que este método se llama así en tu servicio (o cámbialo por getCategories() si es distinto)
    this.petitionService.fetchCategories().subscribe({
      next: (res: any) => {
        // Guardamos las categorías dependiendo de cómo las devuelva tu Laravel
        this.categories.set(res.data || res);
      },
      error: (err) => {
        console.error('Error al cargar las categorías', err);
      }
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      // Convertimos el FileList del navegador a un array de Angular
      this.selectedFile = Array.from(event.target.files);
    }
  }

  marcarParaBorrar(fileId: number, event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.filesToDelete.push(fileId); // Añadimos a la lista negra
    } else {
      this.filesToDelete = this.filesToDelete.filter(id => id !== fileId); 
    }
  }

  saveChanges() {
    if (this.petitionId()) {
      const datosParaEnviar = new FormData();
      
      datosParaEnviar.append('title', this.formData.title);
      datosParaEnviar.append('description', this.formData.description);
      datosParaEnviar.append('category_id', this.formData.category_id);
      
      this.selectedFile.forEach(file => {
        datosParaEnviar.append('files[]', file);
      });

      this.filesToDelete.forEach(id => {
        datosParaEnviar.append('delete_images[]', id.toString());
      });

      datosParaEnviar.append('_method', 'PUT'); 

      this.petitionService.update(this.petitionId()!, datosParaEnviar).subscribe({
        next: () => {
          alert('¡Petición actualizada correctamente!');
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error al actualizar', err);
          alert('Hubo un error al guardar los cambios. Revisa la consola o asegúrate de que eres admin.');
        }
      });
    }
  }
}