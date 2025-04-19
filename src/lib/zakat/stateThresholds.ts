// src/lib/zakat/stateThresholds.ts

export interface ZakatThreshold {
  cash: { nisab: number }; // No notes here
  gold: { nisab: number };
  silver: { nisab: number };
  type: 'state' | 'federal';
}

// Centralized gold rate logic (can be dynamically updated later)
export const GOLD_RATE = 220.5;
export const GOLD_GRAMS = 85;
export const GOLD_EQUIVALENT = +(GOLD_RATE * GOLD_GRAMS).toFixed(2);
export const GOLD_NOTE = `Equivalent to ${GOLD_GRAMS}g gold at RM${GOLD_RATE.toFixed(2)}/g = RM${GOLD_EQUIVALENT.toLocaleString()}`;

// Clean state thresholds
export const stateThresholds: Record<string, ZakatThreshold> = {
  Selangor: {
    type: 'state',
    cash: { nisab: 17800 },
    gold: { nisab: 17800 },
    silver: { nisab: 1380 },
  },
  Johor: {
    type: 'state',
    cash: { nisab: 17500 },
    gold: { nisab: 17500 },
    silver: { nisab: 1350 },
  },
  Kedah: {
    type: 'state',
    cash: { nisab: 17150 },
    gold: { nisab: 17150 },
    silver: { nisab: 1340 },
  },
  Kelantan: {
    type: 'state',
    cash: { nisab: 17000 },
    gold: { nisab: 17000 },
    silver: { nisab: 1320 },
  },
  Melaka: {
    type: 'state',
    cash: { nisab: 17300 },
    gold: { nisab: 17300 },
    silver: { nisab: 1330 },
  },
  "Negeri Sembilan": {
    type: 'state',
    cash: { nisab: 17450 },
    gold: { nisab: 17450 },
    silver: { nisab: 1350 },
  },
  Pahang: {
    type: 'state',
    cash: { nisab: 17600 },
    gold: { nisab: 17600 },
    silver: { nisab: 1360 },
  },
  Perak: {
    type: 'state',
    cash: { nisab: 17200 },
    gold: { nisab: 17200 },
    silver: { nisab: 1325 },
  },
  Perlis: {
    type: 'state',
    cash: { nisab: 17000 },
    gold: { nisab: 17000 },
    silver: { nisab: 1310 },
  },
  "Pulau Pinang": {
    type: 'state',
    cash: { nisab: 17400 },
    gold: { nisab: 17400 },
    silver: { nisab: 1335 },
  },
  Sabah: {
    type: 'state',
    cash: { nisab: 17550 },
    gold: { nisab: 17550 },
    silver: { nisab: 1345 },
  },
  Sarawak: {
    type: 'state',
    cash: { nisab: 17650 },
    gold: { nisab: 17650 },
    silver: { nisab: 1365 },
  },
  Terengganu: {
    type: 'state',
    cash: { nisab: 17300 },
    gold: { nisab: 17300 },
    silver: { nisab: 1325 },
  },
  "Kuala Lumpur": {
    type: 'federal',
    cash: { nisab: 17800 },
    gold: { nisab: 17800 },
    silver: { nisab: 1380 },
  },
  Putrajaya: {
    type: 'federal',
    cash: { nisab: 17800 },
    gold: { nisab: 17800 },
    silver: { nisab: 1380 },
  },
  Labuan: {
    type: 'federal',
    cash: { nisab: 17800 },
    gold: { nisab: 17800 },
    silver: { nisab: 1380 },
  },
};