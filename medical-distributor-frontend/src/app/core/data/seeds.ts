export const CUSTOMERS = [
  {
    id: 'CUST-101',
    name: 'Allied Pharma Distributors',
    gstin: '29AABCU9603R1ZZ',
    licenseNo: 'LIC-APD-001',
    territory: 'South Region',
    creditLimit: 500000,
    creditUsed: 125000,
    status: 'ACTIVE',
    primaryContact: 'Ravi Kumar',
    paymentTermsDays: 15
  },
  {
    id: 'CUST-102',
    name: 'MedAxis Wellness',
    gstin: '27AAACM2133K1Z5',
    licenseNo: 'LIC-MAW-008',
    territory: 'West Region',
    creditLimit: 400000,
    creditUsed: 98000,
    status: 'HOLD',
    primaryContact: 'Priya Shah',
    paymentTermsDays: 30
  },
  {
    id: 'CUST-103',
    name: 'CarePath Hospitals',
    gstin: '07AACCM9910C1Z0',
    licenseNo: 'LIC-CPH-014',
    territory: 'North Region',
    creditLimit: 650000,
    creditUsed: 210000,
    status: 'ACTIVE',
    primaryContact: 'Dr. Sanjay Rao',
    paymentTermsDays: 0
  },
  {
    id: 'CUST-104',
    name: 'Metro Medical Stores',
    gstin: '19AAACM2133G1Z7',
    licenseNo: 'LIC-MMS-020',
    territory: 'East Region',
    creditLimit: 200000,
    creditUsed: 52000,
    status: 'BLOCKED',
    primaryContact: 'Anita Joseph',
    paymentTermsDays: 10
  },
  {
    id: 'CUST-105',
    name: 'CityCare Pharmacies',
    gstin: '07AADCM9910M1Z3',
    licenseNo: 'LIC-CCP-033',
    territory: 'Central Region',
    creditLimit: 350000,
    creditUsed: 98000,
    status: 'ACTIVE',
    primaryContact: 'Manish Verma',
    paymentTermsDays: 20
  }
];

export const DEFAULT_ORDER_LINES = [
  {
    id: 'LINE-001',
    productId: 'MED-001',
    productName: 'Paracetamol 500 mg',
    quantity: 120,
    unitPrice: 68,
    discount: 120,
    taxRate: 5,
    netAmount: 7740
  },
  {
    id: 'LINE-002',
    productId: 'MED-002',
    productName: 'Cetirizine 10 mg',
    quantity: 80,
    unitPrice: 54,
    discount: 0,
    taxRate: 12,
    netAmount: 4838.4
  }
];
