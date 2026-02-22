
export interface StockAnalysis {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  timestamp: string;
  fundamentalScore: number;
  technicalScore: number;
  overallVerdict: 'STRONG BUY' | 'BUY' | 'HOLD' | 'WAIT FOR DIP' | 'AVOID';
  fundamentals: {
    businessModel: ConditionStatus;
    revenueGrowth: ConditionStatus;
    profitGrowth: ConditionStatus;
    returnRatios: ConditionStatus;
    debtManagement: ConditionStatus;
    cashFlow: ConditionStatus;
    managementQuality: ConditionStatus;
    shareholdingPattern: ConditionStatus;
    valuation: ConditionStatus;
    scalability: ConditionStatus;
  };
  technicals: {
    primaryTrend: ConditionStatus;
    verticalRally: ConditionStatus;
    movingAverages: ConditionStatus;
    supportZones: ConditionStatus;
    volumeBehavior: ConditionStatus;
    rsiStatus: ConditionStatus;
  };
  metrics: {
    revenueCAGR: string;
    profitCAGR: string;
    roe: string;
    roce: string;
    debtToEquity: string;
    interestCoverage: string;
    freeCashFlow: string;
    peRatio: string;
    pegRatio: string;
    promoterHolding: string;
    promoterPledging: string;
    rsi: number;
    dma200: number;
    dma50: number;
  };
  sources: { title: string; uri: string }[];
}

export interface StockSummary {
  symbol: string;
  name: string;
  sector: string;
  reason: string;
  fundamentalScore: number;
  technicalScore: number;
}

export interface ConditionStatus {
  label: string;
  status: 'PASS' | 'FAIL' | 'NEUTRAL';
  value: string;
  reason: string;
}

export type AnalysisCategory = 'FUNDAMENTAL' | 'TECHNICAL';
