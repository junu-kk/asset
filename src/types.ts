export type AssetItem = { name: string; amount: number };
export type FlowItem = { name: string; amount: number };

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
};
