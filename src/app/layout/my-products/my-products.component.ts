import { Component } from '@angular/core';
import { Product } from '../../model/product';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'
})
export class MyProductsComponent {
    myProducts: any[] = [];
    filterCategories: string[] = ['Price', 'Category', 'Available events', 'Availability'];
    productDtos: ProductCardDto[] = [];

    constructor(
      public dialog: MatDialog, 
      private router: Router, 
      private productService: ProductService,
      private snackBar: MatSnackBar,
    ) {}
    ngOnInit(): void {
      this.initProducts();
    }

    initProducts(): void {
      const pageProps = { page: 0, pageSize: 10 };
      this.productService.getAll(pageProps).subscribe(response => {
        this.myProducts = response;
        this.productDtos = this.myProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          image: product.images ? product.images[0] : "",
          imageEncodedName: product.imageEncodedNames ? product.imageEncodedNames[0] : ""
        }));
        this.convertImageUrls(this.productDtos);
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
        }, error => {
          console.error('Error filtering products:', error);
        });
      }
    }, error => {
      console.error('Error closing filter dialog:', error);
      
    });
  }

  openDeleteDialog(id?: number): void {
    this.dialog.open(DeleteDialogComponent, {data: {entityName: 'product'}}).afterClosed().subscribe(result => {
      if (result && id) {
        this.productService.deleteProduct(id).subscribe(() => {
          this.snackBar.open('Product deleted successfully.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success']
          });
          this.initProducts(); // Refresh the product list after deletion
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

  convertImageUrls(array: any[]) {
    array.forEach(element => {
      if (element.image != null)
        element.image = "http://localhost:8080/" + "api/images/" + element.imageEncodedName;
    });
  }
}
interface ProductCardDto {
    id?: number;
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    image?: string;
}