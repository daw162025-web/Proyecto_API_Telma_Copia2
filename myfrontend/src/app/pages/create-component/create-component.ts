import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetitionService } from '../../petition.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-component.html', 
  styleUrl: './create-component.css',
})
export class CreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  public petitionService = inject(PetitionService);
  private router = inject(Router);

  loading = signal(false);
  selectedFiles: File[] = [];

  itemForm = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    destinatary: ['', [Validators.required]],
    category_id: ['', [Validators.required]],
    file: [null]
  });

  ngOnInit(): void {
    this.petitionService.fetchCategories().subscribe();
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit() {
    if (this.itemForm.invalid || this.selectedFiles.length === 0) {
      alert('Por favor, rellena todos los campos obligatorios y sube al menos una imagen.');
      return;
    }

    this.loading.set(true); 
    const formData = new FormData();

    formData.append('title', this.itemForm.get('title')?.value || '');
    formData.append('description', this.itemForm.get('description')?.value || '');
    formData.append('destinatary', this.itemForm.get('destinatary')?.value || '');
    formData.append('category_id', this.itemForm.get('category_id')?.value || '');

    this.selectedFiles.forEach((file) => {
      formData.append('files[]', file);
    });
    this.petitionService.create(formData).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Petición creada con éxito');
        this.router.navigate(['/petitions']);
      },
      error: (err) => {
        this.loading.set(false);
        
        if (err.status === 422) {
          console.error('⚠️ LA VALIDACIÓN DE LARAVEL HA FALLADO ⚠️');
          console.table(err.error.errors); 
          alert('Error: Revisa la consola, hay un problema con los datos (foto muy grande, categoría vacía...)');
        } else {
          console.error('Error desconocido:', err);
          alert('Ocurrió un error al crear la petición.');
        }
      }
    });
  }
}