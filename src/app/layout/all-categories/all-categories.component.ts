import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ServiceProductCategory } from '../../model/service-product-category';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { ServiceProductService } from '../../services/service-product/service-product.service';

@Component({
  selector: 'app-all-categories',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './all-categories.component.html',
  styleUrl: './all-categories.component.css'
})
export class AllCategoriesComponent {

  constructor(private spCategoryService: ServiceProductCategoryService,
              private spService: ServiceProductService,
              private router: Router,
              public dialog: MatDialog) {}

  disabledCategories: string[] = [];
  
  ngOnInit(): void {
    this.fetchCategories();

    this.spService.getAllSummaries({page: 0, size: 100}).subscribe(response => 
      response.content.forEach(sp => {
        if (sp.category?.name) {
          this.disabledCategories.push(sp.category?.name);
        }
      })
    );
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
  

  onEdit(row: ServiceProductCategory): void { 
    this.router.navigate(['/new-category'], { queryParams: { id: row.id } });
  }

  onDelete(row: ServiceProductCategory): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: row.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // Instantly remove from the UI list
        this.allCategories = this.allCategories.filter(c => c.id !== row.id);
      }
    });
  }
}
