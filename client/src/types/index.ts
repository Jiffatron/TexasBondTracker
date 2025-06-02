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
