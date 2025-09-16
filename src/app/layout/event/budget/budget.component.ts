import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../../services/event/event.service';
import { ServiceProductCategoryService } from '../../../services/service-product/service-product-category.service';
import { MatOption } from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BudgetService } from '../../../services/order/budget.service';
import { CreateBudgetDto } from '../../../dto/budget/create-budget.dto';
import { Budget } from '../../../model/budget/budget';
import { DeleteDialogComponent } from '../../../dialog/delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ServiceProductService } from '../../../services/service-product/service-product.service';
import { ToastService } from '../../../services/utils/toast-service';
import { validationSuffix } from '../../../utils/error-utils';


@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatOption, FormsModule,
    MatInputModule, MatSelectModule
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent implements OnInit {
  readonly route = inject(ActivatedRoute);
  readonly location = inject(Location);
  readonly eventService = inject(EventService);
  readonly spCategoryService = inject(ServiceProductCategoryService);
  readonly budgetService = inject(BudgetService);
  readonly dialog = inject(MatDialog);
  readonly serviceProductService = inject(ServiceProductService);
  readonly toastService = inject(ToastService);

  eventId = -1;
  budgets: Budget[] = [];
  displayedColumns = ['index', 'name', 'category', 'currentSpent', 'plannedSpending', 'bookings', 'purchases', 'actions', 'invalid'];
  categories: string[] = [];
  uniqueCategories = new Set();
  recommendedNumber = 0;
  hasSomethingReserved: boolean[] = []; // if deletion is acceptable for each budget item
  totalSpent = 0;
  totalProvided = 0;

  spendingForm = new FormGroup({});

  newBudgetForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    plannedSpending: new FormControl(0, [Validators.required, Validators.min(0)]),
    category: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventId = params['id'];
      this.eventService.getEvent(this.eventId).subscribe(event => {
        this.budgets = event.budgets;
        this.budgets.forEach((budget, i) => {
          this.spendingForm.addControl(budget.name, new FormControl(budget.plannedSpending,
                                      [Validators.required, Validators.min(budget.currentSpent)]));
          this.hasSomethingReserved[i] = budget.bookings.length > 0 || budget.purchases.length > 0;
          this.totalSpent += budget.currentSpent;
          this.totalProvided += budget.plannedSpending;
        })
      });
      // get categories
      this.spCategoryService.getAll().subscribe(categories => {
        this.categories = categories.map(c => String(c.name));
        this.findRecommendedCategories(params['eventTypeId']);
      })
    })
  }

  findRecommendedCategories(eventTypeId: number) {
    this.serviceProductService.getCategoriesByEventType(eventTypeId).subscribe(recommended => {
      const recommendedSet = new Set<string>(recommended.filter(p => this.categories.includes(p)));
      this.recommendedNumber = recommendedSet.size;
      const remainingList = this.categories.filter(c => !recommended.includes(c));

      this.categories = [...recommendedSet, ...remainingList];
      this.uniqueCategories = new Set<string>(this.categories);
    })
  }

  back() {
    this.location.back();
  }

  onEdit(item: Budget) {
    const usersForm = this.spendingForm.get(item.name);
    if (usersForm?.valid) {
      this.totalProvided += usersForm.value - item.plannedSpending;
      this.budgetService.setNewAmount(item.id, usersForm.value).subscribe();
      this.toastService.show('Budget updated successfully', 2000);
    }
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
          data: { id: id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.budgets = this.budgets.filter(b => b.id !== id);
      }
    });
  }

  onSubmit() {
    if (this.newBudgetForm.valid) {
      this.spCategoryService.getByName(String(this.newBudgetForm.get('category')?.value)).subscribe(catId => {
        const budget: CreateBudgetDto = {
          name: String(this.newBudgetForm.get('name')?.value?.trim()),
          plannedSpending: Number(this.newBudgetForm.get('plannedSpending')?.value),
          serviceProductCategoryId: Number(catId.id)
        };

        this.budgetService.add(budget).subscribe({
          next: (created: Budget) => {
            this.budgets = [...this.budgets, created];
            this.spendingForm.addControl(budget.name, new FormControl(budget.plannedSpending,
                                        [Validators.required, Validators.min(0)]));
            this.eventService.addBudgetToEvent(this.eventId, created.id).subscribe();
            this.newBudgetForm.reset({name: ' ', plannedSpending: 0, category: ' '});
          }, error: (err) => {
            this.toastService.show('Failed to create budget' + validationSuffix(err), 6000);
          }
        })
      })
    }
  }
}
