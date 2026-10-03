import { createContext } from 'react';

export const CURRENCIES = {
  usd: { name: 'usd', symbol: '$', label: 'USD' },
  eur: { name: 'eur', symbol: '€', label: 'EUR' },
  inr: { name: 'inr', symbol: '₹', label: 'INR' },
  gbp: { name: 'gbp', symbol: '£', label: 'GBP' },
};

export const CoinContext = createContext(null);

export default CoinContext;

