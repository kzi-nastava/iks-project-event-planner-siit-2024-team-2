import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../model/service-product/product';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ProductService } from '../../services/service-product/product.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.css'
})
export class MyProductsComponent implements OnInit {
    myProducts: Product[] = [];
    filterCategories: string[] = ['Price', 'Category', 'Available events', 'Availability'];
    productDtos: ProductCardDto[] = [];

    // Injected
    readonly dialog = inject(MatDialog);
    readonly productService = inject(ProductService);
    readonly router = inject(Router);

    ngOnInit(): void {
      this.initProducts();
    }

    initProducts(): void {
      const pageProps = { page: 0, size: 10 };
      this.productService.getAll(pageProps).subscribe(response => {
        this.myProducts = response;
        this.productDtos = this.myProducts.map(product => ({
          id: product.id || 0,
          name: product.name || "",
          description: product.description || "",
          price: product.price || 0,
          discount: product.discount || 0,
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
          this.productDtos = this.myProducts.map(product => ({
          id: product.id || 0,
          name: product.name || "",
          description: product.description || "",
          price: product.price || 0,
          discount: product.discount || 0,
          image: product.images ? product.images[0] : "",
          imageEncodedName: product.imageEncodedNames ? product.imageEncodedNames[0] : ""
        }));
        this.convertImageUrls(this.productDtos);
        }, error => {
          console.error('Error filtering products:', error);
        });
      }
    }, error => {
      console.error('Error closing filter dialog:', error);
      
    });
  }

  openDialog(productId?: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: productId }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
    if (result === true) {
      this.myProducts = this.myProducts.filter(s => s.id !== productId);
       this.productDtos = this.myProducts.map(product => ({
          id: product.id || 0,
          name: product.name || "",
          description: product.description || "",
          price: product.price || 0,
          discount: product.discount || 0,
          image: product.images ? product.images[0] : "",
          imageEncodedName: product.imageEncodedNames ? product.imageEncodedNames[0] : ""
        }));
        this.convertImageUrls(this.productDtos);
    }
    });
  }

  navigateToEditProduct(productId?: number): void {
    this.router.navigate(['/new-product'], { queryParams: { id: productId } });
  }

  convertImageUrls(array: ProductCardDto[]) {
    array.forEach(element => {
      if (element.image != null)
        element.image = environment.apiHost + "api/images/" + element.imageEncodedName;
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
    imageEncodedName?: string;
}