import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionsService } from '../../core/services/transactions.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Transaction, TransactionRequest } from '../../core/models/transaction.model';
import { PortfolioSummary } from '../../core/models/portfolio.model';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  imports: [CommonModule, FormsModule]
})
export class TransactionsPage implements OnInit {

  transactions: Transaction[] = [];
  portfolios: PortfolioSummary[] = [];
  selectedPortfolioId: number | null = null;
  loading = false;
  showAddModal = false;
  
  newTransaction: TransactionRequest = {
    symbol: '',
    transactionType: 'BUY',
    quantity: 0,
    price: 0,
    transactionDate: new Date().toISOString().split('T')[0]
  };

  constructor(
    private transactionsService: TransactionsService,
    private portfolioService: PortfolioService
  ) {}

  ngOnInit(): void {
    this.loadPortfolios();
  }

  private loadPortfolios(): void {
    this.portfolioService.getSummaries().subscribe({
      next: (data) => {
        this.portfolios = data;
        if (this.portfolios.length > 0) {
          this.selectedPortfolioId = this.portfolios[0].id;
          this.loadTransactions();
        }
      }
    });
  }

  onPortfolioChange(): void {
    if (this.selectedPortfolioId) {
      this.loadTransactions();
    }
  }

  loadTransactions(): void {
    if (!this.selectedPortfolioId) return;
    
    this.loading = true;
    this.transactionsService.getByPortfolio(this.selectedPortfolioId).subscribe({
      next: (data: Transaction[]) => {
        this.transactions = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  openAddModal(): void {
    this.showAddModal = true;
    this.newTransaction = {
      symbol: '',
      transactionType: 'BUY',
      quantity: 0,
      price: 0,
      transactionDate: new Date().toISOString().split('T')[0]
    };
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  addTransaction(): void {
    if (!this.selectedPortfolioId) return;
    
    this.transactionsService.create(this.selectedPortfolioId, this.newTransaction).subscribe({
      next: () => {
        this.loadTransactions();
        this.closeAddModal();
      }
    });
  }

  deleteTransaction(id: number): void {
    if (!this.selectedPortfolioId) return;
    
    this.transactionsService.delete(this.selectedPortfolioId, id).subscribe({
      next: () => this.loadTransactions()
    });
  }
}
