package com.tnc.domain.reports.service;

import com.tnc.domain.holdings.dto.HoldingRowDTO;
import com.tnc.domain.holdings.service.HoldingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final HoldingsService holdingsService;

    /**
     * Generate Excel report
     */
    public byte[] generateExcelReport() throws IOException {
        var holdingsSummary = holdingsService.getAllHoldings();

        try (Workbook workbook = new XSSFWorkbook()) {
            // Create Summary Sheet
            Sheet summarySheet = workbook.createSheet("Summary");
            createSummarySheet(summarySheet, holdingsSummary.getTotalInvested(), 
                    holdingsSummary.getTotalCurrentValue(), holdingsSummary.getTotalGainLoss());

            // Create Holdings Sheet
            Sheet holdingsSheet = workbook.createSheet("Holdings");
            createHoldingsSheet(holdingsSheet, holdingsSummary.getHoldings());

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            log.info("Excel report generated");
            return baos.toByteArray();
        }
    }

    private void createSummarySheet(Sheet sheet, java.math.BigDecimal invested, 
            java.math.BigDecimal current, java.math.BigDecimal gainLoss) {
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Portfolio Summary");

        Row row2 = sheet.createRow(2);
        row2.createCell(0).setCellValue("Total Invested");
        row2.createCell(1).setCellValue(invested.doubleValue());

        Row row3 = sheet.createRow(3);
        row3.createCell(0).setCellValue("Current Value");
        row3.createCell(1).setCellValue(current.doubleValue());

        Row row4 = sheet.createRow(4);
        row4.createCell(0).setCellValue("Gain/Loss");
        row4.createCell(1).setCellValue(gainLoss.doubleValue());
    }

    private void createHoldingsSheet(Sheet sheet, List<HoldingRowDTO> holdings) {
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("Symbol");
        headerRow.createCell(1).setCellValue("Quantity");
        headerRow.createCell(2).setCellValue("Avg Buy Price");
        headerRow.createCell(3).setCellValue("Current Price");
        headerRow.createCell(4).setCellValue("Investment");
        headerRow.createCell(5).setCellValue("Current Value");
        headerRow.createCell(6).setCellValue("Gain/Loss");
        headerRow.createCell(7).setCellValue("Gain/Loss %");

        int rowNum = 1;
        for (HoldingRowDTO holding : holdings) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(holding.getSymbol());
            row.createCell(1).setCellValue(holding.getQuantity());
            row.createCell(2).setCellValue(holding.getAverageBuyPrice().doubleValue());
            row.createCell(3).setCellValue(holding.getCurrentPrice().doubleValue());
            row.createCell(4).setCellValue(holding.getInvestmentAmount().doubleValue());
            row.createCell(5).setCellValue(holding.getCurrentValue().doubleValue());
            row.createCell(6).setCellValue(holding.getGainLoss().doubleValue());
            row.createCell(7).setCellValue(holding.getGainLossPercent().doubleValue());
        }
    }
}
