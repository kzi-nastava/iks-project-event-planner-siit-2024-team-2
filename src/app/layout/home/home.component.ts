import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { EP_Event } from '../../model/ep_event';
import { Service } from '../../model/service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule, MatCardModule, MatButtonModule, CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  topEvents: EP_Event[] = [];
  otherEvents: EP_Event[] = [];
  topServiceProducts: Service[] = [];
  otherServiceProducts: Service[] = [];
  ngOnInit(): void {
    this.initEvents();
    this.initServices();
  }
  initEvents(): void {
    for (let i = 0; i < 5; i++) {
      this.topEvents.push(new EP_Event(i, "Birthday", "Perin rođendan", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"));
    }
    for (let i = 0; i < 10; i++) {
      this.otherEvents.push(new EP_Event(i+5, "Birthday", "Perin rođendan", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"));
    }
  }
  initServices(): void {
    for (let i = 0; i < 5; i++) {
      this.topServiceProducts.push(new Service(i, "Catering", "Peric catering", "We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum.",
        "no specifies", 7, 1, ["catering.jpeg"], ["Wedding", "Birthday"], 1, 7, 3));
    }
    for (let i = 0; i < 10; i++) {
      this.otherServiceProducts.push(new Service(i+5, "Catering", "Peric catering", "We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum.",
        "no specifies", 7, 1, ["catering.jpeg"], ["Wedding", "Birthday"], 1, 7, 3));
    }
  }
}
