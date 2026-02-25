package com.tnc.domain.transaction.controller;

import com.tnc.common.api.ApiResponse;
import com.tnc.domain.transaction.dto.TransactionCreateRequest;
import com.tnc.domain.transaction.dto.TransactionResponse;
import com.tnc.domain.transaction.dto.TransactionUpdateRequest;
import com.tnc.domain.transaction.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Transaction management endpoints")
public class TransactionController {

	private final TransactionService transactionService;

	@PostMapping
	@Operation(summary = "Create new transaction")
	public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
			@RequestBody TransactionCreateRequest request) {
		TransactionResponse response = transactionService.createTransaction(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success(response, "Transaction created successfully"));
	}

	@GetMapping
	@Operation(summary = "Get all transactions")
	public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
		List<TransactionResponse> transactions = transactionService.getAllTransactions();
		return ResponseEntity.ok(ApiResponse.success(transactions, "Transactions retrieved successfully"));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Get transaction by ID")
	public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(@PathVariable Long id) {
		TransactionResponse response = transactionService.getTransaction(id);
		return ResponseEntity.ok(ApiResponse.success(response));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update transaction")
	public ResponseEntity<ApiResponse<TransactionResponse>> updateTransaction(
			@PathVariable Long id,
			@RequestBody TransactionUpdateRequest request) {
		TransactionResponse response = transactionService.updateTransaction(id, request);
		return ResponseEntity.ok(ApiResponse.success(response, "Transaction updated successfully"));
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Delete transaction")
	public ResponseEntity<ApiResponse<Void>> deleteTransaction(@PathVariable Long id) {
		transactionService.deleteTransaction(id);
		return ResponseEntity.ok(ApiResponse.success(null, "Transaction deleted successfully"));
	}

	@GetMapping("/symbol/{symbol}")
	@Operation(summary = "Get transactions by symbol")
	public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsBySymbol(
			@PathVariable String symbol) {
		List<TransactionResponse> transactions = transactionService.getTransactionsBySymbol(symbol);
		return ResponseEntity.ok(ApiResponse.success(transactions));
	}

	@GetMapping("/date-range/search")
	@Operation(summary = "Get transactions by date range")
	public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByDateRange(
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
		List<TransactionResponse> transactions = transactionService.getTransactionsByDateRange(startDate, endDate);
		return ResponseEntity.ok(ApiResponse.success(transactions));
	}

	@GetMapping("/symbols/all")
	@Operation(summary = "Get all unique symbols")
	public ResponseEntity<ApiResponse<List<String>>> getAllSymbols() {
		List<String> symbols = transactionService.getAllSymbols();
		return ResponseEntity.ok(ApiResponse.success(symbols));
	}
}
