import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar/nav-bar.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    NavBarComponent
  ],
  exports: [NavBarComponent]
})
export class LayoutModule { }
