import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { months as initialMonths } from '../data/loader';
import { parseExpression } from '../lib/expression';
import { computeNasdaq } from '../lib/nasdaq';
import { downloadJson } from '../lib/download';
import FlowSection, { type FlowRow } from '../components/FlowSection';
import AssetSection, { type AssetRow } from '../components/AssetSection';
import { type NasdaqState } from '../components/NasdaqInput';
import type { MonthRecord, FlowItem, AssetItem } from '../types';
import styles from './EditPage.module.css';

const DEFAULT_INCOME: FlowRow[] = [
  { name: '월급', amount: '', fixed: true },
  { name: '개업지', amount: '30', fixed: true },
  { name: 'k패스환급', amount: '', fixed: true },
  { name: '월간 네페포', amount: '1', fixed: true },
];

const DEFAULT_EXPENSE: FlowRow[] = [
  { name: '일반', amount: '', fixed: true },
  { name: '개업지', amount: '', fixed: true },
  { name: '내일로', amount: '5', fixed: true },
  { name: '사원증', amount: '', fixed: true },
];

const DEFAULT_ASSETS: AssetRow[] = [
  { name: '현금', amount: '', fixed: true, bucket: 'cash' },
  { name: '달러', amount: '', fixed: true, bucket: 'cash' },
  { name: '채권', amount: '', fixed: true, bucket: 'cash' },
  { name: '나스닥', amount: '', fixed: true, bucket: 'investment' },
  { name: '자사주', amount: '', fixed: true, bucket: 'investment' },
  { name: '금', amount: '', fixed: true, bucket: 'investment' },
  { name: '코인', amount: '', fixed: true, bucket: 'investment' },
];

const EMPTY_NASDAQ: NasdaqState = { 보유: '', 수익: '', 공제: false };

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function thisMonthString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

type FormState = {
  month: string;
  reportedAt: string;
  income: FlowRow[];
  expense: FlowRow[];
  assets: AssetRow[];
  나스닥: NasdaqState;
  notes: string;
};

function loadFromRecord(r: MonthRecord): FormState {
  const incomeMap = new Map(r.income.map((it) => [it.name, it.amount]));
  const income: FlowRow[] = DEFAULT_INCOME.map((d) => ({
    ...d,
    amount: incomeMap.has(d.name) ? String(incomeMap.get(d.name)) : '',
  }));
  for (const it of r.income) {
    if (!DEFAULT_INCOME.find((d) => d.name === it.name)) {
      income.push({ name: it.name, amount: String(it.amount), fixed: false });
    }
  }
  const expenseMap = new Map(r.expense.map((it) => [it.name, it.amount]));
  const expense: FlowRow[] = DEFAULT_EXPENSE.map((d) => ({
    ...d,
    amount: expenseMap.has(d.name) ? String(expenseMap.get(d.name)) : '',
  }));
  for (const it of r.expense) {
    if (!DEFAULT_EXPENSE.find((d) => d.name === it.name)) {
      expense.push({ name: it.name, amount: String(it.amount), fixed: false });
    }
  }
  const cashMap = new Map(r.assets.cash.map((it) => [it.name, it.amount]));
  const invMap = new Map(r.assets.investment.map((it) => [it.name, it.amount]));
  const assets: AssetRow[] = DEFAULT_ASSETS.map((d) => {
    const map = d.bucket === 'cash' ? cashMap : invMap;
    return { ...d, amount: map.has(d.name) ? String(map.get(d.name)) : '' };
  });
  for (const it of r.assets.cash) {
    if (!DEFAULT_ASSETS.find((d) => d.name === it.name)) {
      assets.push({ name: it.name, amount: String(it.amount), fixed: false, bucket: 'cash' });
    }
  }
  for (const it of r.assets.investment) {
    if (!DEFAULT_ASSETS.find((d) => d.name === it.name)) {
      assets.push({ name: it.name, amount: String(it.amount), fixed: false, bucket: 'investment' });
    }
  }
  const meta = r._meta?.나스닥;
  const 나스닥: NasdaqState = meta
    ? { 보유: String(meta.보유), 수익: String(meta.수익), 공제: meta.공제 }
    : EMPTY_NASDAQ;
  return {
    month: r.month,
    reportedAt: r.reportedAt ?? todayString(),
    income,
    expense,
    assets,
    나스닥,
    notes: r.notes,
  };
}

function buildRecord(state: FormState): MonthRecord {
  const toAmount = (s: string): number | null => {
    if (s.trim() === '') return null;
    const r = parseExpression(s);
    return r.valid ? r.value : null;
  };
  const flowItems = (rows: FlowRow[]): FlowItem[] => {
    const items: FlowItem[] = [];
    for (const r of rows) {
      const a = toAmount(r.amount);
      if (a === null || r.name.trim() === '') continue;
      items.push({ name: r.name, amount: a });
    }
    return items;
  };
  const cash: AssetItem[] = [];
  const investment: AssetItem[] = [];
  let nasdaqMeta: { 보유: number; 수익: number; 공제: boolean } | null = null;
  for (const r of state.assets) {
    if (r.fixed && r.name === '나스닥') {
      const 보유 = parseExpression(state.나스닥.보유);
      const 수익 = parseExpression(state.나스닥.수익);
      if (!보유.valid || !수익.valid) continue;
      const amount = computeNasdaq({ 보유: 보유.value, 수익: 수익.value, 공제: state.나스닥.공제 });
      investment.push({ name: '나스닥', amount });
      nasdaqMeta = { 보유: 보유.value, 수익: 수익.value, 공제: state.나스닥.공제 };
      continue;
    }
    const a = toAmount(r.amount);
    if (a === null || r.name.trim() === '') continue;
    const item: AssetItem = { name: r.name, amount: a };
    if (r.bucket === 'cash') cash.push(item);
    else investment.push(item);
  }
  const record: MonthRecord = {
    month: state.month,
    reportedAt: state.reportedAt,
    income: flowItems(state.income),
    expense: flowItems(state.expense),
    assets: { cash, investment },
    notes: state.notes,
  };
  if (nasdaqMeta) {
    record._meta = { 나스닥: nasdaqMeta };
  }
  return record;
}

function validate(state: FormState, isEditMode: boolean): string[] {
  const errors: string[] = [];
  if (!/^\d{4}-\d{2}$/.test(state.month)) {
    errors.push('월(month)은 YYYY-MM 형식이어야 합니다');
  }
  const checkRows = (rows: { amount: string }[], label: string) => {
    for (const r of rows) {
      if (r.amount.trim() === '') continue;
      if (!parseExpression(r.amount).valid) {
        errors.push(`${label} 금액 표현식이 잘못됨: "${r.amount}"`);
      }
    }
  };
  checkRows(state.income, '수입');
  checkRows(state.expense, '지출');
  checkRows(state.assets.filter((a) => !(a.fixed && a.name === '나스닥')), '누적');
  const 보유Empty = state.나스닥.보유.trim() === '';
  const 수익Empty = state.나스닥.수익.trim() === '';
  if (!보유Empty || !수익Empty) {
    if (보유Empty || !parseExpression(state.나스닥.보유).valid) {
      errors.push('나스닥 보유총액 표현식이 잘못됨');
    }
    if (수익Empty || !parseExpression(state.나스닥.수익).valid) {
      errors.push('나스닥 수익 표현식이 잘못됨');
    }
  }
  if (!isEditMode && initialMonths.some((r) => r.month === state.month)) {
    errors.push(`${state.month}은 이미 존재합니다. 수정 모드를 사용하세요`);
  }
  return errors;
}

export default function EditPage() {
  const navigate = useNavigate();
  const { month: monthParam } = useParams<{ month?: string }>();
  const isEditMode = !!monthParam;

  const initial = useMemo<FormState>(() => {
    if (isEditMode) {
      const found = initialMonths.find((r) => r.month === monthParam);
      if (found) return loadFromRecord(found);
    }
    return {
      month: thisMonthString(),
      reportedAt: todayString(),
      income: DEFAULT_INCOME,
      expense: DEFAULT_EXPENSE,
      assets: DEFAULT_ASSETS,
      나스닥: EMPTY_NASDAQ,
      notes: '',
    };
  }, [isEditMode, monthParam]);

  const [month, setMonth] = useState(initial.month);
  const [reportedAt, setReportedAt] = useState(initial.reportedAt);
  const [income, setIncome] = useState(initial.income);
  const [expense, setExpense] = useState(initial.expense);
  const [assets, setAssets] = useState(initial.assets);
  const [나스닥, set나스닥] = useState(initial.나스닥);
  const [notes, setNotes] = useState(initial.notes);

  const handleSave = () => {
    const state: FormState = { month, reportedAt, income, expense, assets, 나스닥, notes };
    const errors = validate(state, isEditMode);
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    const record = buildRecord(state);
    const others = initialMonths.filter((r) => r.month !== record.month);
    const merged = [...others, record].sort((a, b) => a.month.localeCompare(b.month));
    downloadJson(merged, 'months.json');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{isEditMode ? `수정: ${month}` : '새 기록'}</h1>
      <div className={styles.headerRow}>
        <label className={styles.headerField}>
          월:
          <input
            type="text"
            className={styles.headerInput}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            disabled={isEditMode}
            placeholder="YYYY-MM"
          />
        </label>
        <label className={styles.headerField}>
          기입일:
          <input
            type="text"
            className={styles.headerInput}
            value={reportedAt}
            onChange={(e) => setReportedAt(e.target.value)}
          />
        </label>
      </div>

      <FlowSection title="수입" rows={income} onChange={setIncome} />
      <FlowSection title="지출" rows={expense} onChange={setExpense} />
      <AssetSection
        rows={assets}
        onChange={setAssets}
        나스닥={나스닥}
        onNasdaqChange={set나스닥}
      />

      <section className={styles.section}>
        <h3 className={styles.title}>메모 (markdown)</h3>
        <div data-color-mode="auto">
          <MDEditor
            value={notes}
            onChange={(v) => setNotes(v ?? '')}
            preview="edit"
            height={240}
          />
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.btnSecondary} onClick={() => navigate(-1)}>
          취소
        </button>
        <button type="button" className={styles.btnPrimary} onClick={handleSave}>
          저장 → months.json 다운로드
        </button>
      </div>
    </div>
  );
}
