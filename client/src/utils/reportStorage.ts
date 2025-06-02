import { ExtractedFinancialData } from '@/types';

export interface StoredReport {
  filename: string;
  timestamp: string;
  data: ExtractedFinancialData;
}

const STORAGE_KEY = 'texas_isd_reports';

export class ReportStorage {
  static saveReport(filename: string, data: ExtractedFinancialData): void {
    try {
      const reports = this.getAllReports();
      const reportKey = this.sanitizeFilename(filename);
      
      const storedReport: StoredReport = {
        filename: filename,
        timestamp: new Date().toISOString(),
        data
      };

      reports[reportKey] = storedReport;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Failed to save report:', error);
    }
  }

  static getAllReports(): Record<string, StoredReport> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load reports:', error);
      return {};
    }
  }

  static getReportsList(): StoredReport[] {
    const reports = this.getAllReports();
    return Object.values(reports).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  static getReport(filename: string): StoredReport | null {
    const reports = this.getAllReports();
    const reportKey = this.sanitizeFilename(filename);
    return reports[reportKey] || null;
  }

  static deleteReport(filename: string): void {
    try {
      const reports = this.getAllReports();
      const reportKey = this.sanitizeFilename(filename);
      delete reports[reportKey];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  }

  static clearAllReports(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear reports:', error);
    }
  }

  static exportCSV(data: ExtractedFinancialData): void {
    const headers = [
      'District Name',
      'Fiscal Year',
      'Net Position - Total Assets',
      'Net Position - Total Liabilities', 
      'Net Position - Net Position',
      'Fund Balance - General Fund',
      'Fund Balance - Debt Service Fund',
      'Revenues - Local',
      'Revenues - State',
      'Revenues - Federal',
      'Expenditures - Instruction',
      'Expenditures - Administration',
      'Expenditures - Debt Service'
    ];

    const row = [
      data.districtName || '',
      data.fiscalYear || '',
      data.netPosition.totalAssets,
      data.netPosition.totalLiabilities,
      data.netPosition.netPosition,
      data.fundBalance.generalFund,
      data.fundBalance.debtServiceFund,
      data.revenues.local,
      data.revenues.state,
      data.revenues.federal,
      data.expenditures.instruction,
      data.expenditures.admin,
      data.expenditures.debtService
    ];

    const csvContent = [
      headers.join(','),
      row.join(',')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.districtName || 'audit'}_financial_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  }
}