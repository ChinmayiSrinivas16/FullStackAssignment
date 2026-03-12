package com.tnc.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.CMYKColor;
import com.tnc.domain.holdings.entity.Holding;
import com.tnc.domain.transaction.entity.Transaction;
import com.tnc.domain.user.entity.User;
import com.tnc.repository.HoldingRepository;
import com.tnc.repository.TransactionRepository;
import com.tnc.repository.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportsService {

    @Value("${app.reports.directory:./reports}")
    private String reportsDirectory;

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private HoldingsService holdingsService;

    @Autowired
    private TransactionsService transactionsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HoldingRepository holdingRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    private static final com.itextpdf.text.Font TITLE_FONT = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 18, com.itextpdf.text.Font.BOLD, new com.itextpdf.text.BaseColor(0, 0, 0));
    private static final com.itextpdf.text.Font HEADER_FONT = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 14, com.itextpdf.text.Font.BOLD, new com.itextpdf.text.BaseColor(0, 0, 0));
    private static final com.itextpdf.text.Font SUBHEADER_FONT = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 12, com.itextpdf.text.Font.BOLD, new com.itextpdf.text.BaseColor(0, 0, 0));
    private static final com.itextpdf.text.Font NORMAL_FONT = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 10, com.itextpdf.text.Font.NORMAL, new com.itextpdf.text.BaseColor(0, 0, 0));
    private static final com.itextpdf.text.Font SMALL_FONT = new com.itextpdf.text.Font(com.itextpdf.text.Font.FontFamily.HELVETICA, 8, com.itextpdf.text.Font.NORMAL, new com.itextpdf.text.BaseColor(0, 0, 0));

    /**
     * Generate a report and return the file path
     */
    public String generateReport(String username, String reportType, String period, String format) throws Exception {
        // Create reports directory if it doesn't exist
        File reportsDir = new File(reportsDirectory);
        if (!reportsDir.exists()) {
            reportsDir.mkdirs();
        }

        String reportId = UUID.randomUUID().toString().replace("-", "").substring(0, 8);
        String extension = "xlsx".equalsIgnoreCase(format) || "excel".equalsIgnoreCase(format) ? "xlsx" : "pdf";
        String fileName = reportId + "_" + reportType + "_" + period + "." + extension;
        String filePath = reportsDirectory + File.separator + fileName;

        // Get user data
        User user = userRepository.findByUsername(username).orElse(null);
        List<Holding> holdings = holdingsService.getAllHoldings(username);
        List<Transaction> transactions = transactionsService.getAllTransactions(username, null, null, null);

        // Get portfolio summary data
        Map<String, Object> summaryData = portfolioService.getSummary(username);
        double totalInvestment = 0.0;
        double currentValue = 0.0;
        if (summaryData != null && summaryData.get("data") != null) {
            Map<String, Object> data = (Map<String, Object>) summaryData.get("data");
            totalInvestment = data.get("totalInvestment") != null ? ((Number) data.get("totalInvestment")).doubleValue() : 0.0;
            currentValue = data.get("currentValue") != null ? ((Number) data.get("currentValue")).doubleValue() : 0.0;
        }

        // Generate report based on format
        if ("xlsx".equalsIgnoreCase(format) || "excel".equalsIgnoreCase(format)) {
            generateExcelReport(username, reportType, period, filePath, user, holdings, transactions, totalInvestment, currentValue);
        } else {
            generatePDFReport(username, reportType, period, filePath, user, holdings, transactions, totalInvestment, currentValue);
        }

        return filePath;
    }

    private void generatePDFReport(String username, String reportType, String period, String filePath,
                                   User user, List<Holding> holdings, List<Transaction> transactions,
                                   double totalInvestment, double currentValue) throws Exception {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        // Add title
        Paragraph title = new Paragraph("Portfolio Management Report", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(" "));
        addMetadataTable(document, user, reportType, period);

        // Portfolio Summary Section
        addPortfolioSummarySection(document, holdings, totalInvestment, currentValue);

        // Investment Distribution Section
        addInvestmentDistributionSection(document, holdings);

        // Sector-wise Allocation Section
        addSectorAllocationSection(document, holdings);

        // Holdings Details Section
        addHoldingsSection(document, holdings);

        // Transaction History Section
        addTransactionsSection(document, transactions);

        // Tax Report Section
        addTaxSection(document, holdings, totalInvestment, currentValue);

        // Footer
        addFooter(document);

        document.close();
    }

    private void addMetadataTable(Document document, User user, String reportType, String period) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1f, 1f});

        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy, hh:mm a");

        addTableRow(table, "Report Type", capitalizeFirst(reportType) + " Report");
        addTableRow(table, "Period", capitalizeFirst(period));
        addTableRow(table, "Generated On", sdf.format(new Date()));
        addTableRow(table, "User", user != null ? user.getUsername() : "N/A");

        document.add(table);
        document.add(new Paragraph(" "));
    }

    private void addPortfolioSummarySection(Document document, List<Holding> holdings, double totalInvestment, double currentValue) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("1. Portfolio Summary", HEADER_FONT);
        sectionTitle.setSpacingBefore(20);
        document.add(sectionTitle);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 1f});

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        double gainLoss = currentValue - totalInvestment;
        double gainLossPercentage = totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0;

        addTableRow(table, "Total Investment", currencyFormat.format(totalInvestment));
        addTableRow(table, "Current Portfolio Value", currencyFormat.format(currentValue));
        addTableRow(table, "Total Gain/Loss", currencyFormat.format(gainLoss) + " (" + String.format("%.2f", gainLossPercentage) + "%)");
        addTableRow(table, "Number of Holdings", String.valueOf(holdings != null ? holdings.size() : 0));

        document.add(table);
    }

    private void addInvestmentDistributionSection(Document document, List<Holding> holdings) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("2. Investment Distribution", HEADER_FONT);
        sectionTitle.setSpacingBefore(20);
        document.add(sectionTitle);

        double totalValue = calculateCurrentValue(holdings);

        if (holdings == null || holdings.isEmpty()) {
            document.add(new Paragraph("No holdings found.", NORMAL_FONT));
            return;
        }

        // Group by symbol to show distribution
        Map<String, Double> distribution = holdings.stream()
                .collect(Collectors.groupingBy(Holding::getSymbol, 
                    Collectors.summingDouble(h -> h.getQuantity() * h.getCurrentPrice())));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 1.2f, 1.2f, 1f});

        // Header
        PdfPCell headerCell = new PdfPCell(new Phrase("Symbol", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        headerCell = new PdfPCell(new Phrase("Value", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        headerCell = new PdfPCell(new Phrase("Percentage", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        headerCell = new PdfPCell(new Phrase("Type", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        for (Map.Entry<String, Double> entry : distribution.entrySet()) {
            double percentage = totalValue > 0 ? (entry.getValue() / totalValue) * 100 : 0;
            table.addCell(new Phrase(entry.getKey(), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(entry.getValue()), NORMAL_FONT));
            table.addCell(new Phrase(String.format("%.2f%%", percentage), NORMAL_FONT));
            table.addCell(new Phrase("Stock", NORMAL_FONT));
        }

        document.add(table);
    }

    private void addSectorAllocationSection(Document document, List<Holding> holdings) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("3. Sector-wise Allocation", HEADER_FONT);
        sectionTitle.setSpacingBefore(20);
        document.add(sectionTitle);

        double totalValue = calculateCurrentValue(holdings);

        if (holdings == null || holdings.isEmpty()) {
            document.add(new Paragraph("No holdings found.", NORMAL_FONT));
            return;
        }

        // Simulate sector allocation based on symbol (in real app, you'd have sector data)
        Map<String, Double> sectorValues = new HashMap<>();
        Map<String, String> symbolToSector = getSymbolToSectorMapping();

        for (Holding holding : holdings) {
            String sector = symbolToSector.getOrDefault(holding.getSymbol(), "Other");
            double value = holding.getQuantity() * holding.getCurrentPrice();
            sectorValues.put(sector, sectorValues.getOrDefault(sector, 0.0) + value);
        }

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 1.2f, 1f});

        // Header
        PdfPCell headerCell = new PdfPCell(new Phrase("Sector", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        headerCell = new PdfPCell(new Phrase("Value", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        headerCell = new PdfPCell(new Phrase("Allocation", SUBHEADER_FONT));
        headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
        table.addCell(headerCell);

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        for (Map.Entry<String, Double> entry : sectorValues.entrySet()) {
            double percentage = totalValue > 0 ? (entry.getValue() / totalValue) * 100 : 0;
            table.addCell(new Phrase(entry.getKey(), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(entry.getValue()), NORMAL_FONT));
            table.addCell(new Phrase(String.format("%.2f%%", percentage), NORMAL_FONT));
        }

        document.add(table);
    }

    private Map<String, String> getSymbolToSectorMapping() {
        Map<String, String> mapping = new HashMap<>();
        // Technology
        mapping.put("AAPL", "Technology");
        mapping.put("MSFT", "Technology");
        mapping.put("GOOGL", "Technology");
        mapping.put("INFY", "Technology");
        mapping.put("TCS", "Technology");
        mapping.put("WIPRO", "Technology");
        // Finance
        mapping.put("JPM", "Finance");
        mapping.put("BAC", "Finance");
        mapping.put("HDFCBANK", "Finance");
        mapping.put("ICICIBANK", "Finance");
        // Healthcare
        mapping.put("JNJ", "Healthcare");
        mapping.put("PFE", "Healthcare");
        mapping.put("SUNPHARMA", "Healthcare");
        // Energy
        mapping.put("XOM", "Energy");
        mapping.put("RELIANCE", "Energy");
        // Consumer
        mapping.put("AMZN", "Consumer");
        mapping.put("NFLX", "Consumer");
        mapping.put("HUL", "Consumer");
        return mapping;
    }

    private void addHoldingsSection(Document document, List<Holding> holdings) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("4. Holdings Details", HEADER_FONT);
        sectionTitle.setSpacingBefore(20);
        document.add(sectionTitle);

        if (holdings == null || holdings.isEmpty()) {
            document.add(new Paragraph("No holdings found.", NORMAL_FONT));
            return;
        }

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1f, 0.8f, 1f, 1f, 1f, 1f});

        // Header row
        String[] headers = {"Symbol", "Qty", "Avg Cost", "Current", "Value", "P&L"};
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, SUBHEADER_FONT));
            headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
            table.addCell(headerCell);
        }

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        for (Holding holding : holdings) {
            double value = holding.getQuantity() * holding.getCurrentPrice();
            double cost = holding.getQuantity() * holding.getAverageCost();
            double pnl = value - cost;

            table.addCell(new Phrase(holding.getSymbol(), NORMAL_FONT));
            table.addCell(new Phrase(String.valueOf(holding.getQuantity()), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(holding.getAverageCost()), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(holding.getCurrentPrice()), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(value), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(pnl), NORMAL_FONT));
        }

        document.add(table);
    }

    private void addTransactionsSection(Document document, List<Transaction> transactions) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("5. Transaction History", HEADER_FONT);
        sectionTitle.setSpacingBefore(20);
        document.add(sectionTitle);

        if (transactions == null || transactions.isEmpty()) {
            document.add(new Paragraph("No transactions found.", NORMAL_FONT));
            return;
        }

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.2f, 0.8f, 1f, 0.8f, 1f});

        // Header
        String[] headers = {"Date", "Type", "Symbol", "Qty", "Total"};
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell(new Phrase(header, SUBHEADER_FONT));
            headerCell.setBackgroundColor(new CMYKColor(200, 100, 0, 0));
            table.addCell(headerCell);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy");
        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        for (Transaction transaction : transactions) {
            table.addCell(new Phrase(sdf.format(transaction.getTransactionDate()), NORMAL_FONT));
            table.addCell(new Phrase(transaction.getType(), NORMAL_FONT));
            table.addCell(new Phrase(transaction.getSymbol(), NORMAL_FONT));
            table.addCell(new Phrase(String.valueOf(transaction.getQuantity()), NORMAL_FONT));
            table.addCell(new Phrase(currencyFormat.format(transaction.getQuantity() * transaction.getPrice()), NORMAL_FONT));
        }

        document.add(table);
    }

    private void addTaxSection(Document document, List<Holding> holdings, double totalInvestment, double currentValue) throws DocumentException {
        Paragraph sectionTitle = new Paragraph("6. Tax Report", HEADER_FONT);
        sectionTitle.setSpacingBefore(20);
        document.add(sectionTitle);

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));

        double totalGainLoss = currentValue - totalInvestment;
        double estimatedTax = Math.max(0, totalGainLoss * 0.15);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{1.5f, 1f});

        addTableRow(table, "Total Investment", currencyFormat.format(totalInvestment));
        addTableRow(table, "Current Portfolio Value", currencyFormat.format(currentValue));
        addTableRow(table, "Unrealized Gain/Loss", currencyFormat.format(totalGainLoss));
        addTableRow(table, "Estimated Tax Liability (15%)", currencyFormat.format(estimatedTax));
        addTableRow(table, "Note", "Consult a tax professional for accurate tax advice.");

        document.add(table);
    }

    private void addFooter(Document document) throws DocumentException {
        document.add(new Paragraph(" "));
        Paragraph footer = new Paragraph("Generated by Portfolio Management System", SMALL_FONT);
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);
    }

    private void addTableRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, NORMAL_FONT));
        labelCell.setBorder(Rectangle.NO_BORDER);
        labelCell.setPadding(5);
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell(new Phrase(value != null ? value : "N/A", NORMAL_FONT));
        valueCell.setBorder(Rectangle.NO_BORDER);
        valueCell.setPadding(5);
        table.addCell(valueCell);
    }

    private double calculateCurrentValue(List<Holding> holdings) {
        if (holdings == null) return 0.0;
        return holdings.stream()
                .mapToDouble(h -> h.getQuantity() * h.getCurrentPrice())
                .sum();
    }

    private String capitalizeFirst(String str) {
        if (str == null || str.isEmpty()) return str;
        return str.substring(0, 1).toUpperCase() + str.substring(1);
    }

    /**
     * Generate Excel Report
     */
    private void generateExcelReport(String username, String reportType, String period, String filePath,
                                    User user, List<Holding> holdings, List<Transaction> transactions,
                                    double totalInvestment, double currentValue) throws Exception {
        Workbook workbook = new XSSFWorkbook();
        
        // Create sheets
        Sheet summarySheet = workbook.createSheet("Portfolio Summary");
        Sheet allocationSheet = workbook.createSheet("Investment Distribution");
        Sheet sectorSheet = workbook.createSheet("Sector Allocation");
        Sheet holdingsSheet = workbook.createSheet("Holdings");
        Sheet transactionsSheet = workbook.createSheet("Transactions");
        Sheet taxSheet = workbook.createSheet("Tax Report");

        NumberFormat currencyFormat = NumberFormat.getCurrencyInstance(new Locale("en", "IN"));
        
        // 1. Portfolio Summary Sheet
        createSummarySheet(summarySheet, holdings, totalInvestment, currentValue, currencyFormat);
        
        // 2. Investment Distribution Sheet
        createAllocationSheet(allocationSheet, holdings, currencyFormat);
        
        // 3. Sector Allocation Sheet
        createSectorSheet(sectorSheet, holdings, currencyFormat);
        
        // 4. Holdings Sheet
        createHoldingsSheet(holdingsSheet, holdings, currencyFormat);
        
        // 5. Transactions Sheet
        createTransactionsSheet(transactionsSheet, transactions, currencyFormat);
        
        // 6. Tax Report Sheet
        createTaxSheet(taxSheet, holdings, totalInvestment, currentValue, currencyFormat);

        // Write to file
        try (FileOutputStream outputStream = new FileOutputStream(filePath)) {
            workbook.write(outputStream);
        }
        workbook.close();
    }

    private void createSummarySheet(Sheet sheet, List<Holding> holdings, double totalInvestment, double currentValue, NumberFormat currencyFormat) {
        Row row = sheet.createRow(0);
        row.createCell(0).setCellValue("Portfolio Summary Report");
        
        double gainLoss = currentValue - totalInvestment;
        double gainLossPercentage = totalInvestment > 0 ? (gainLoss / totalInvestment) * 100 : 0;

        row = sheet.createRow(2);
        row.createCell(0).setCellValue("Total Investment");
        row.createCell(1).setCellValue(currencyFormat.format(totalInvestment));
        
        row = sheet.createRow(3);
        row.createCell(0).setCellValue("Current Value");
        row.createCell(1).setCellValue(currencyFormat.format(currentValue));
        
        row = sheet.createRow(4);
        row.createCell(0).setCellValue("Total Gain/Loss");
        row.createCell(1).setCellValue(currencyFormat.format(gainLoss) + " (" + String.format("%.2f", gainLossPercentage) + "%)");
        
        row = sheet.createRow(5);
        row.createCell(0).setCellValue("Number of Holdings");
        row.createCell(1).setCellValue(holdings != null ? holdings.size() : 0);
    }

    private void createAllocationSheet(Sheet sheet, List<Holding> holdings, NumberFormat currencyFormat) {
        Row row = sheet.createRow(0);
        row.createCell(0).setCellValue("Investment Distribution");
        
        row = sheet.createRow(2);
        row.createCell(0).setCellValue("Symbol");
        row.createCell(1).setCellValue("Value");
        row.createCell(2).setCellValue("Percentage");

        double totalValue = calculateCurrentValue(holdings);
        Map<String, Double> distribution = holdings.stream()
                .collect(Collectors.groupingBy(Holding::getSymbol, 
                    Collectors.summingDouble(h -> h.getQuantity() * h.getCurrentPrice())));

        int rowNum = 3;
        for (Map.Entry<String, Double> entry : distribution.entrySet()) {
            double percentage = totalValue > 0 ? (entry.getValue() / totalValue) * 100 : 0;
            row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(entry.getKey());
            row.createCell(1).setCellValue(currencyFormat.format(entry.getValue()));
            row.createCell(2).setCellValue(String.format("%.2f%%", percentage));
        }
    }

    private void createSectorSheet(Sheet sheet, List<Holding> holdings, NumberFormat currencyFormat) {
        Row row = sheet.createRow(0);
        row.createCell(0).setCellValue("Sector-wise Allocation");
        
        row = sheet.createRow(2);
        row.createCell(0).setCellValue("Sector");
        row.createCell(1).setCellValue("Value");
        row.createCell(2).setCellValue("Allocation");

        double totalValue = calculateCurrentValue(holdings);
        Map<String, String> symbolToSector = getSymbolToSectorMapping();
        Map<String, Double> sectorValues = new HashMap<>();

        for (Holding holding : holdings) {
            String sector = symbolToSector.getOrDefault(holding.getSymbol(), "Other");
            double value = holding.getQuantity() * holding.getCurrentPrice();
            sectorValues.put(sector, sectorValues.getOrDefault(sector, 0.0) + value);
        }

        int rowNum = 3;
        for (Map.Entry<String, Double> entry : sectorValues.entrySet()) {
            double percentage = totalValue > 0 ? (entry.getValue() / totalValue) * 100 : 0;
            row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(entry.getKey());
            row.createCell(1).setCellValue(currencyFormat.format(entry.getValue()));
            row.createCell(2).setCellValue(String.format("%.2f%%", percentage));
        }
    }

    private void createHoldingsSheet(Sheet sheet, List<Holding> holdings, NumberFormat currencyFormat) {
        Row row = sheet.createRow(0);
        String[] headers = {"Symbol", "Quantity", "Avg Cost", "Current Price", "Value", "P&L"};
        for (int i = 0; i < headers.length; i++) {
            row.createCell(i).setCellValue(headers[i]);
        }

        int rowNum = 1;
        for (Holding holding : holdings) {
            double value = holding.getQuantity() * holding.getCurrentPrice();
            double cost = holding.getQuantity() * holding.getAverageCost();
            double pnl = value - cost;
            
            row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(holding.getSymbol());
            row.createCell(1).setCellValue(holding.getQuantity());
            row.createCell(2).setCellValue(currencyFormat.format(holding.getAverageCost()));
            row.createCell(3).setCellValue(currencyFormat.format(holding.getCurrentPrice()));
            row.createCell(4).setCellValue(currencyFormat.format(value));
            row.createCell(5).setCellValue(currencyFormat.format(pnl));
        }
    }

    private void createTransactionsSheet(Sheet sheet, List<Transaction> transactions, NumberFormat currencyFormat) {
        Row row = sheet.createRow(0);
        String[] headers = {"Date", "Type", "Symbol", "Quantity", "Price", "Total"};
        for (int i = 0; i < headers.length; i++) {
            row.createCell(i).setCellValue(headers[i]);
        }

        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM yyyy");
        int rowNum = 1;
        for (Transaction transaction : transactions) {
            row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(sdf.format(transaction.getTransactionDate()));
            row.createCell(1).setCellValue(transaction.getType());
            row.createCell(2).setCellValue(transaction.getSymbol());
            row.createCell(3).setCellValue(transaction.getQuantity());
            row.createCell(4).setCellValue(currencyFormat.format(transaction.getPrice()));
            row.createCell(5).setCellValue(currencyFormat.format(transaction.getQuantity() * transaction.getPrice()));
        }
    }

    private void createTaxSheet(Sheet sheet, List<Holding> holdings, double totalInvestment, double currentValue, NumberFormat currencyFormat) {
        Row row = sheet.createRow(0);
        row.createCell(0).setCellValue("Tax Report");
        
        double totalGainLoss = currentValue - totalInvestment;
        double estimatedTax = Math.max(0, totalGainLoss * 0.15);

        row = sheet.createRow(2);
        row.createCell(0).setCellValue("Total Investment");
        row.createCell(1).setCellValue(currencyFormat.format(totalInvestment));
        
        row = sheet.createRow(3);
        row.createCell(0).setCellValue("Current Portfolio Value");
        row.createCell(1).setCellValue(currencyFormat.format(currentValue));
        
        row = sheet.createRow(4);
        row.createCell(0).setCellValue("Unrealized Gain/Loss");
        row.createCell(1).setCellValue(currencyFormat.format(totalGainLoss));
        
        row = sheet.createRow(5);
        row.createCell(0).setCellValue("Estimated Tax Liability (15%)");
        row.createCell(1).setCellValue(currencyFormat.format(estimatedTax));
    }

    public String getReportsDirectory() {
        return reportsDirectory;
    }
}
