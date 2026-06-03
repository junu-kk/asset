export type AssetItem = { name: string; amount: number };
export type FlowItem = { name: string; amount: number };

export type NasdaqMeta = {
  보유: number;
  실현수익?: number; // 올해 매도 실현수익 (만원)
  수익?: number; // legacy: 미실현수익 (구 청산가치 모델)
  공제?: boolean; // legacy: 마이그레이션용
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
