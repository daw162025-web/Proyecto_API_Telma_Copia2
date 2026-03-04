import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PetitionService } from '../../petition.service';
@Component({
  selector: 'app-edit-petition',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-component.html',
  styleUrl: './edit-component.css'
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private petitionService = inject(PetitionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form: FormGroup;
  petitionId: number = 0;
  categories = this.petitionService.allCategories;
  loading = signal(false);

  existingImages = signal<any[]>([]);
  imagesToDelete: number[] = []; 
  selectedFiles: File[] = [];

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', Validators.required],
      destinatary: ['', Validators.required],
      category_id: ['', Validators.required],
      file: [null]
    });
  }

  ngOnInit(): void {
    this.petitionService.fetchCategories().subscribe();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.petitionId = Number(idParam);
      this.loadPetitionData(this.petitionId);
    }
  }

  loadPetitionData(id: number) {
    this.loading.set(true);
    this.petitionService.getById(id).subscribe({
      next: (petition: any) => {
        this.form.patchValue({
          title: petition.title,
          description: petition.description,
          destinatary: petition.destinatary,
          category_id: petition.category_id
        });

        if (petition.files && petition.files.length > 0) {
          this.existingImages.set(petition.files);
        } else if (petition.image) {
          this.existingImages.set([{ id: null, file_path: petition.image }]);
        } else {
          this.existingImages.set([]);
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        alert('Error al cargar la petición');
        this.router.navigate(['/petitions']);
      }
    });
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  // Método para marcar una imagen para borrar
  removeExistingImage(imageId: number | null, index: number) {
    if (imageId) {
      this.imagesToDelete.push(imageId);
    }

    const currentImages = this.existingImages();
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    this.existingImages.set(updatedImages);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('title', this.form.get('title')?.value);
    formData.append('description', this.form.get('description')?.value);
    formData.append('destinatary', this.form.get('destinatary')?.value);
    formData.append('category_id', this.form.get('category_id')?.value);

    this.selectedFiles.forEach((file) => {
      formData.append('files[]', file);
    });

    this.imagesToDelete.forEach(id => {
      formData.append('delete_images[]', id.toString());
    });

    formData.append('_method', 'PUT');

    this.petitionService.update(this.petitionId, formData).subscribe({
      next: () => {
        alert('Petición actualizada correctamente');
        this.router.navigate(['/petitions', this.petitionId]); // Volver al detalle
      },
      error: (err) => {
        console.error(err);
        alert('Error al actualizar');
      }
    });
  }
}