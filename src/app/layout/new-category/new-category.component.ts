import { Component, inject, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceProductCategoryService } from '../../services/service-product/service-product-category.service';
import { ServiceProductCategoryDto } from '../../dto/service-product/service-product-category.dto';
import { ServiceProductCategory } from '../../model/service-product/service-product-category';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-category, app-material-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.css'
})
export class NewCategoryComponent implements OnInit {
  // Injected
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly spCategoryService = inject(ServiceProductCategoryService);
  readonly snackBar = inject(MatSnackBar);

  inputForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  catId = -1;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.catId = params['id'];

      if (this.catId == 5) {  // editing catefory request from a notification
        this.inputForm.patchValue({
          name: params['name'],
          description: params['description']
        })
      }

      else if (this.catId !== undefined) {  // editing an existing category (from all-categories)
        this.spCategoryService.getById(this.catId).subscribe(cat => {
          this.inputForm.patchValue({
            name: cat.name,
            description: cat.description
          })
        });
      }

      else this.inputForm.reset();  // creating new category (from nav-bar)
    })
  }

  onSubmit() {
    if (this.inputForm.valid) {
      console.log('Form Submitted:', this.inputForm.value);
  
      const category: ServiceProductCategoryDto = {
        name: this.inputForm.value.name,
        description: this.inputForm.value.description, 
      };

      if (this.catId == 5) {  // send changed data back to notifications
        this.router.navigate(['/notifications'], { queryParams: { 
          callAccept: true,
          name: category.name, 
          description: category.description 
        } });
      }
      else if (this.catId == undefined)
        this.createCategory(category);
      else
        this.updateCategory(category);
    }
  }

  createCategory(category: ServiceProductCategoryDto) {
    this.spCategoryService.add(category).subscribe({
      next: (category: ServiceProductCategory) => {
        console.log('Category created:', category);

        this.snackBar.open('Category created successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });

        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error creating category:', err);
        this.snackBar.open('Failed to create category. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }

  updateCategory(category: ServiceProductCategoryDto) {
    this.spCategoryService.update(this.catId, category).subscribe({
      next: (category: ServiceProductCategory) => {
        console.log('Category updated:', category);

        this.snackBar.open('Category updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });

        this.router.navigate(['/all-categories']); 
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating category:', err);
        this.snackBar.open('Failed to update category. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snack-error']
        });
      }
    });
  }
  
  onCancel(): void {
    if (this.catId == 5)
      this.router.navigate(['/notifications']); 
    else
      this.router.navigate(['/all-categories'], { relativeTo: this.route });
  }
}
