import { Component } from '@angular/core';
import { Service } from '../../model/service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { Router } from '@angular/router';   


@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './my-services.component.html',
  styleUrl: './my-services.component.css'
})
export class MyServicesComponent {
    myServices: Service[] = [];

    ngOnInit(): void {
      this.initServices();
    }

    initServices(): void {
      for (let i = 0; i < 10; i++) {
        this.myServices.push(new Service(i, "Catering", "Peric catering", "We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum.",
          "no specifies", 7, 1, ["catering.jpeg"], ["Wedding", "Birthday"], 1, 7, 3));
      }
    }

    constructor(public dialog: MatDialog, private router: Router) {}

    openDialog(): void {
      this.dialog.open(DialogComponent);
    }


    navigateToEditService(serviceId: number): void {
      this.router.navigate(['/new-service'], { queryParams: { id: serviceId } });
    }
    
}
