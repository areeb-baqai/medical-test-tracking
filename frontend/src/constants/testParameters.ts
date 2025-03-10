export interface TestParameter {
    unit: string;
    min: number;
    max: number;
}

export const CBC_PARAMETERS: { [key: string]: TestParameter } = {
    'Hemoglobin': { unit: 'g/dL', min: 13.5, max: 17.5 },
    'RBC Count': { unit: '×10¹²/L', min: 4.5, max: 5.5 },
    'WBC Count': { unit: '×10⁹/L', min: 4.5, max: 11.0 },
    'Platelets': { unit: '×10⁹/L', min: 150, max: 450 },
    'Hematocrit': { unit: '%', min: 41, max: 50 },
    'MCV': { unit: 'fL', min: 80, max: 96 },
    'MCH': { unit: 'pg', min: 27, max: 33 },
    'MCHC': { unit: 'g/dL', min: 32, max: 36 },
    'RDW': { unit: '%', min: 11.5, max: 14.5 },
    'Neutrophils': { unit: '%', min: 40, max: 75 },
    'Lymphocytes': { unit: '%', min: 20, max: 45 },
    'Monocytes': { unit: '%', min: 2, max: 10 },
    'Eosinophils': { unit: '%', min: 1, max: 6 },
    'Basophils': { unit: '%', min: 0, max: 1 },
    // ... other parameters
}; 