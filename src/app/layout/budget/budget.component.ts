import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { MatOption } from "@angular/material/core";
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BudgetService } from '../../services/budget.service';
import { CreateBudgetDto } from '../../services/dtos/event/create-budget.dto';
import { Budget } from '../../model/budget';


@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatOption, FormsModule,
    MatInputModule, MatSelectModule
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {

  constructor(private router: Router, private route: ActivatedRoute,
              private eventService: EventService, private spCategoryService: ServiceProductCategoryService,
              private budgetService: BudgetService) {}

  eventId: number = -1;
  budgets: any[] = [];
  displayedColumns = ['index', 'name', 'category', 'currentSpent', 'plannedSpending', 'bookings', 'purchases', 'actions', 'invalid'];
  categories: string[] = [];

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
        this.budgets.forEach((budget) => {
          this.spendingForm.addControl(budget.name, new FormControl(budget.plannedSpending));
        })
      });
    })

    this.spCategoryService.getAll().subscribe(categories => {
      this.categories = categories.map(c => c.name);
    })
  }

  back() {
    this.router.navigate(['/my-events'])
  }

  onEdit(item: any, i: number) {

  }

  onDelete(item: any) {

  }

  onSubmit() {
    if (this.newBudgetForm.valid) {
      this.spCategoryService.getByName(String(this.newBudgetForm.get('category')?.value)).subscribe(catId => {
        const budget: CreateBudgetDto = {
          name: String(this.newBudgetForm.get('name')?.value),
          plannedSpending: Number(this.newBudgetForm.get('plannedSpending')?.value),
          serviceProductCategoryId: Number(catId.id)
        };

        console.log(budget)

        this.budgetService.add(budget).subscribe({
          next: (created: Budget) => {
            this.budgets.push(created);
            this.eventService.addBudgetToEvent(this.eventId, created).subscribe(() => {});

          },
            error: (err) => {
              console.error('Error creating category:', err);
            }
        })
      })
    }
  }
}
