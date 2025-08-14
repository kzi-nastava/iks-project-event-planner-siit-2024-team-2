import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { ServiceProductCategoryDto } from '../../services/dtos/service-product/service-product-category.dto';

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
export class NewCategoryComponent {
constructor(
    private route: ActivatedRoute,
    private router: Router,
    private spCategoryService: ServiceProductCategoryService,
    private snackBar: MatSnackBar,
  ) {

  }
  inputForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });
  
  ngOnInit() {}

  onSubmit() {
    if (this.inputForm.valid) {
      console.log('Form Submitted:', this.inputForm.value);
  
      const category: ServiceProductCategoryDto = {
        name: this.inputForm.value.name,
        description: this.inputForm.value.description, 
      };
  
      this.spCategoryService.add(category).subscribe({
        next: (category: any) => {
          console.log('Category created:', category);
  
          this.snackBar.open('Category created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });
  
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.snackBar.open('Failed to create category. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
  
  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
