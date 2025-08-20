import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { PriceListDto } from '../../services/dtos/service-product/price-list.dto';
import { PriceListService } from '../../services/price-list.service';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatFormFieldModule],
  templateUrl: './price-list.component.html',
  styleUrls: ['./price-list.component.css']

})
export class PriceListComponent implements OnInit {

  priceList: PriceListDto[] = [];
  displayedColumns = ['index', 'name', 'price', 'discount', 'total', 'actions', 'invalid'];
  forms: FormGroup[] = [];
  sppId = Number(localStorage.getItem('userId'));


  constructor(private priceListService: PriceListService, private router: Router) {}

  ngOnInit(): void {
    this.loadPriceList();
  }

  loadPriceList(): void {
    this.priceListService.getBySppId(this.sppId).subscribe({
      next: (items) => {
        this.priceList = items;
        items.forEach((item) => {
          this.forms.push(new FormGroup({
          price: new FormControl(item.price, [Validators.required, Validators.min(0)]),
          discount: new FormControl(item.discount, [Validators.required, Validators.min(0)])
          }));
        })
      },
      error: (err) => console.error('Failed to load price list', err)
    });
  }

  save(item: PriceListDto, i: number): void {
    if (this.forms[i].valid) {
      const newPrice = this.forms[i].get('price')?.value;
      const newDiscount = this.forms[i].get('discount')?.value;

      this.priceListService.update(item.id, newPrice, newDiscount).subscribe({
        next: (updated) => {
          console.log('Saved:', updated);
          item.price = updated.price;
          item.discount = updated.discount;
          item.total = updated.total;
        },
        error: (err) => console.error('Failed to save', err)
      });
    }
  }

  downloadPdf() {
    this.priceListService.downloadPdf(this.sppId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pricelist-${this.sppId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to download PDF:', err);
      }
    });
  }

  back() {
    this.router.navigate(['/my-services'])
  }
}
