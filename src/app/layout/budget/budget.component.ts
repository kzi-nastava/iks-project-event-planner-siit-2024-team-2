import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {

  constructor(private router: Router, private route: ActivatedRoute,
              private eventService: EventService) {}

  budgets: any[] = [];
  displayedColumns = ['index', 'name', 'category', 'currentSpent', 'plannedSpending', 'bookings', 'purchases', 'actions', 'invalid'];
  forms: FormControl[] = [];

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.eventService.getEvent(params['id']).subscribe(event => {
        this.budgets = event.budgets;
        console.log(event)
        this.forms.push(new FormControl(0))
      });
    })
  }

  back() {
    this.router.navigate(['/my-events'])
  }

  onEdit(item: any, i: number) {

  }

  onDelete(item: any) {

  }
}
