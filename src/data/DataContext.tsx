import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { MonthRecord } from '../types';
import { parseMonths } from '../lib/schema';
import { decrypt, type EncryptedPayload } from '../lib/crypto';
import sample from './sample.json';

const SESSION_KEY = 'asset_session_pw';

type DataContextValue = {
  months: MonthRecord[];
  locked: boolean;
  unlock: (password: string) => Promise<boolean>;
  lock: () => void;
};

const DataContext = createContext<DataContextValue | null>(null);

const initialMonths = parseMonths(sample);

export function DataProvider({ children }: { children: ReactNode }) {
  const [months, setMonths] = useState<MonthRecord[]>(initialMonths);
  const [locked, setLocked] = useState<boolean>(true);

  const unlock = async (password: string): Promise<boolean> => {
    const baseUrl = (import.meta.env.BASE_URL ?? '/').replace(/\/$/, '');
    try {
      const res = await fetch(`${baseUrl}/encrypted.json`);
      if (!res.ok) return false;
      const payload = (await res.json()) as EncryptedPayload;
      const plaintext = await decrypt(payload, password);
      if (plaintext === null) return false;
      const data = parseMonths(JSON.parse(plaintext));
      setMonths(data);
      setLocked(false);
      sessionStorage.setItem(SESSION_KEY, password);
      return true;
    } catch {
      return false;
    }
  };

  const lock = () => {
    setMonths(initialMonths);
    setLocked(true);
    sessionStorage.removeItem(SESSION_KEY);
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      // dev 환경: /api/months에서 실제 데이터 자동 로드
      fetch('/api/months')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) {
            setMonths(parseMonths(data));
            setLocked(false);
          }
        })
        .catch(() => {});
      return;
    }
    // prod 환경: sessionStorage에 저장된 비밀번호로 자동 unlock 시도
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      unlock(saved);
    }
  }, []);

  return (
    <DataContext.Provider value={{ months, locked, unlock, lock }}>{children}</DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
