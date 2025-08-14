import { Component } from '@angular/core';
import { Product } from '../../model/service-product/product';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'
})
export class MyProductsComponent {
    myProducts: Product[] = [];
    filterCategories: string[] = ['Price', 'Category', 'Available events', 'Availability'];
    
    constructor(
      public dialog: MatDialog, 
      private router: Router, 
      private productService: ProductService,
      private snackBar: MatSnackBar,
    ) {}
    ngOnInit(): void {
      this.initServices();
    }

    initServices(): void {
      const pageProps = { page: 0, pageSize: 10 };
      this.productService.getAll(pageProps).subscribe(response => {
        this.myProducts = response;
      }, error => {
        console.error('Error fetching products:', error);
      });
    }


    openFilterDialog(): void {
    const dialogRef = this.dialog.open(ServiceFilterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { categories, eventTypes, minPrice, maxPrice, available } = result;
        this.productService.filter(categories, eventTypes, minPrice, maxPrice, available).subscribe(filteredProducts => {
          this.myProducts = filteredProducts;
          console.log('Filtered products:', this.myProducts);
        }, error => {
          console.error('Error filtering products:', error);
        });
      } else {
        console.log('Filter dialog was closed without applying filters.');
      }
    }, error => {
      console.error('Error closing filter dialog:', error);
      
    });
  }

  openDeleteDialog(id?: number): void {
    this.dialog.open(DeleteDialogComponent, {data: {entityName: 'product'}}).afterClosed().subscribe(result => {
      if (result && id) {
        console.log('Delete confirmed for product ID:', id);
        this.productService.deleteProduct(id).subscribe(() => {
          this.snackBar.open('Product deleted successfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.initServices(); // Refresh the product list after deletion
        }, error => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Failed to delete product.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        });
      } else {
            this.snackBar.open('Delete cancelled.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
      }
    });
  }

  navigateToEditService(productId?: number): void {
    this.router.navigate(['/new-product'], { queryParams: { id: productId } });
  }
}
