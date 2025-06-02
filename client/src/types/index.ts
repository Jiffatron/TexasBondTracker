export interface DashboardMetrics {
  totalDebt: number;
  activeIssuers: number;
  avgRating: string;
  ytdIssuances: number;
}

export interface FilterState {
  entityTypes: string[];
  creditRatings: string[];
  region: string;
  minDebt: number;
  maxDebt: number;
}

export interface BondSearchFilters {
  cusip: string;
  bondType: string[];
  maturityRange: string;
  yieldRange: string;
}

export interface MapData {
  county: string;
  debtLevel: 'low' | 'medium' | 'high';
  totalDebt: number;
  municipalityCount: number;
}

export interface ChartDataPoint {
  month: string;
  amount: number;
  count: number;
}

export interface RatingDistribution {
  rating: string;
  count: number;
  percentage: number;
}

export interface ExtractedFinancialData {
  netPosition: {
    totalAssets: number;
    totalLiabilities: number;
    netPosition: number;
  };
  fundBalance: {
    generalFund: number;
    debtServiceFund: number;
    totalFundBalance?: number;
  };
  revenues: {
    local: number;
    state: number;
    federal: number;
    total?: number;
  };
  expenditures: {
    instruction: number;
    admin: number;
    debtService: number;
    total?: number;
  };
  districtName?: string;
  fiscalYear?: string;
}
