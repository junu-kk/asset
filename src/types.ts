export type AssetItem = { name: string; amount: number };
export type FlowItem = { name: string; amount: number };

export type NasdaqMeta = {
  보유: number;
  수익: number;
  공제: boolean;
};

export type MonthRecord = {
  month: string;            // "YYYY-MM"
  reportedAt?: string;      // "YYYY-MM-DD"
  income: FlowItem[];
  expense: FlowItem[];
  assets: {
    cash: AssetItem[];
    investment: AssetItem[];
  };
  notes: string;
  _meta?: {
    나스닥?: NasdaqMeta;
  };
};
