import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServiceProductCategory } from '../../model/service-product-category';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-categories.component',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent {

  constructor(private spCategoryService: ServiceProductCategoryService,
              private router: Router) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  displayedColumns = ['index', 'name', 'description', 'actions'];
  allCategories: ServiceProductCategory[] = [];
  
  fetchCategories(): void {
    this.spCategoryService.getAll().subscribe({
      next: (response: ServiceProductCategory[]) => {
        this.allCategories = response;
      },
      error: (err: any) => {
        console.error('Failed to load categories:', err);
      }
    });
  }
  

  onEdit(row: ServiceProductCategory) { 
    this.router.navigate(['/new-category'], { queryParams: { id: row.id } });
  }
  onDelete(row: ServiceProductCategory) { /* confirm & delete */ }
}
