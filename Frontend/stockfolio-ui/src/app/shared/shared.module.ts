import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ChartCardComponent } from './components/chart-card/chart-card.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { SidebarItemComponent } from './components/sidebar-item/sidebar-item.component';

@NgModule({
  declarations: [
    StatCardComponent,
    ChartCardComponent,
    EmptyStateComponent,
    SidebarItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StatCardComponent,
    ChartCardComponent,
    EmptyStateComponent,
    SidebarItemComponent
  ]
})
export class SharedModule { }