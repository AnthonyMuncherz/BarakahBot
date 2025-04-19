// src/lib/zakat/stateThresholds.ts

export interface ZakatThreshold {
  cash: { nisab: number }; // Current Nisab value for 2024
  gold: { nisab: number };
  silver: { nisab: number };
  type: 'state' | 'federal';
}

// Updated gold rate for 2024 (can be dynamically updated later)
export const GOLD_RATE = 285.50; // Current market rate as of 2024
export const GOLD_GRAMS = 85;
export const GOLD_EQUIVALENT = +(GOLD_RATE * GOLD_GRAMS).toFixed(2);
export const GOLD_NOTE = `Equivalent to ${GOLD_GRAMS}g gold at RM${GOLD_RATE.toFixed(2)}/g = RM${GOLD_EQUIVALENT.toLocaleString()}`;

// Updated state thresholds for 2024
export const stateThresholds: Record<string, ZakatThreshold> = {
  Selangor: {
    type: 'state',
    cash: { nisab: 24424.54 }, // Using standard rate until updated
    gold: { nisab: 24424.54 },
    silver: { nisab: 1890.00 },
  },
  Johor: {
    type: 'state',
    cash: { nisab: 24424.54 },
    gold: { nisab: 24424.54 },
    silver: { nisab: 1890.00 },
  },
  Kedah: {
    type: 'state',
    cash: { nisab: 22612.24 },
    gold: { nisab: 22612.24 },
    silver: { nisab: 1750.00 },
  },
  Kelantan: {
    type: 'state',
    cash: { nisab: 21553.15 },
    gold: { nisab: 21553.15 },
    silver: { nisab: 1670.00 },
  },
  Melaka: {
    type: 'state',
    cash: { nisab: 21625.69 },
    gold: { nisab: 21625.69 },
    silver: { nisab: 1675.00 },
  },
  "Negeri Sembilan": {
    type: 'state',
    cash: { nisab: 22669.53 },
    gold: { nisab: 22669.53 },
    silver: { nisab: 1755.00 },
  },
  Pahang: {
    type: 'state',
    cash: { nisab: 24424.54 },
    gold: { nisab: 24424.54 },
    silver: { nisab: 1890.00 },
  },
  Perak: {
    type: 'state',
    cash: { nisab: 24424.54 },
    gold: { nisab: 24424.54 },
    silver: { nisab: 1890.00 },
  },
  Perlis: {
    type: 'state',
    cash: { nisab: 22578.76 },
    gold: { nisab: 22578.76 },
    silver: { nisab: 1748.00 },
  },
  "Pulau Pinang": {
    type: 'state',
    cash: { nisab: 15885.00 },
    gold: { nisab: 15885.00 },
    silver: { nisab: 1230.00 },
  },
  Sabah: {
    type: 'state',
    cash: { nisab: 21500.00 },
    gold: { nisab: 21500.00 },
    silver: { nisab: 1665.00 },
  },
  Sarawak: {
    type: 'state',
    cash: { nisab: 24467.11 },
    gold: { nisab: 24467.11 },
    silver: { nisab: 1893.00 },
  },
  Terengganu: {
    type: 'state',
    cash: { nisab: 22176.03 },
    gold: { nisab: 22176.03 },
    silver: { nisab: 1717.00 },
  },
  "Kuala Lumpur": {
    type: 'federal',
    cash: { nisab: 21626.00 },
    gold: { nisab: 21626.00 },
    silver: { nisab: 1675.00 },
  },
  Putrajaya: {
    type: 'federal',
    cash: { nisab: 21626.00 },
    gold: { nisab: 21626.00 },
    silver: { nisab: 1675.00 },
  },
  Labuan: {
    type: 'federal',
    cash: { nisab: 21626.00 },
    gold: { nisab: 21626.00 },
    silver: { nisab: 1675.00 },
  },
};