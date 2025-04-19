// lib/zakat/stateThresholds.ts

// Interface for zakat threshold details per state or federal territory
export interface ZakatThreshold {
    cash: {
      nisab: number;
      notes?: string;
    };
    gold: {
      nisab: number;
      notes?: string;
    };
    silver: {
      nisab: number;
      notes?: string;
    };
    type: 'state' | 'federal';
  }
  
  // Thresholds for cash, gold and silver by Malaysian states and federal territories (in RM)
  export const stateThresholds: Record<string, ZakatThreshold> = {
    "Johor": {
      type: 'state',
      cash: { nisab: 17200 },
      gold: { nisab: 17200 },
      silver: { nisab: 1390 }
    },
    "Kedah": {
      type: 'state',
      cash: { nisab: 17150 },
      gold: { nisab: 17150 },
      silver: { nisab: 1340 }
    },
    "Kelantan": {
      type: 'state',
      cash: { nisab: 17000 },
      gold: { nisab: 17000 },
      silver: { nisab: 1335 }
    },
    "Melaka": {
      type: 'state',
      cash: { nisab: 17300 },
      gold: { nisab: 17300 },
      silver: { nisab: 1330 }
    },
    "Negeri Sembilan": {
      type: 'state',
      cash: { nisab: 17250 },
      gold: { nisab: 17250 },
      silver: { nisab: 1350 }
    },
    "Pahang": {
      type: 'state',
      cash: { nisab: 17050 },
      gold: { nisab: 17050 },
      silver: { nisab: 1315 }
    },
    "Perak": {
      type: 'state',
      cash: { nisab: 17400 },
      gold: { nisab: 17400 },
      silver: { nisab: 1345 }
    },
    "Perlis": {
      type: 'state',
      cash: { nisab: 16700 },
      gold: { nisab: 16700 },
      silver: { nisab: 1300 }
    },
    "Pulau Pinang": {
      type: 'state',
      cash: { nisab: 17350 },
      gold: { nisab: 17350 },
      silver: { nisab: 1360 }
    },
    "Sabah": {
      type: 'state',
      cash: { nisab: 17100 },
      gold: { nisab: 17100 },
      silver: { nisab: 1325 }
    },
    "Sarawak": {
      type: 'state',
      cash: { nisab: 16900 },
      gold: { nisab: 16900 },
      silver: { nisab: 1340 }
    },
    "Selangor": {
      type: 'state',
      cash: {
        nisab: 17800,
        notes: "Equivalent to 85g gold at RM209/g"
      },
      gold: {
        nisab: 17800,
        notes: "85g gold × RM209/g"
      },
      silver: {
        nisab: 1380,
        notes: "595g silver × RM2.32/g"
      }
    },
    "Terengganu": {
      type: 'state',
      cash: { nisab: 16800 },
      gold: { nisab: 16800 },
      silver: { nisab: 1320 }
    },
    "Kuala Lumpur": {
      type: 'federal',
      cash: { nisab: 17500 },
      gold: { nisab: 17500 },
      silver: { nisab: 1370 }
    },
    "Putrajaya": {
      type: 'federal',
      cash: { nisab: 17500 },
      gold: { nisab: 17500 },
      silver: { nisab: 1365 }
    },
    "Labuan": {
      type: 'federal',
      cash: { nisab: 16850 },
      gold: { nisab: 16850 },
      silver: { nisab: 1310 }
    }
  };
  