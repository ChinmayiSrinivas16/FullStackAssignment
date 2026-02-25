import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../../core/services/transactions.service';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  imports: [CommonModule, FormsModule]
})
export class TransactionsPage implements OnInit {

  transactions: Transaction[] = [];
  loading = false;

  constructor(private service: TransactionsService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data: Transaction[]) => {
        this.transactions = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteTransaction(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.loadTransactions();
    });
  }
}