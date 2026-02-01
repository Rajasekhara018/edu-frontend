# Medical Distributor ERP Frontend

Angular + Material UI for the Medical Distributor Sales, Inventory, and Checkout system.

## Highlights
- Role-based navigation for Sales, Warehouse, Finance, and Audit workflows
- Server-side pagination, sorting, and filtering on list views
- FEFO batch visibility with CDK virtual scroll
- ERP-style dense tables with reusable UI components

## Development server
```bash
npm install
npm start
```

Open `http://localhost:4200/#/login`.

## Backend API
Set the API base URL in `src/environments/environment.ts`.
Default expected API URL: `http://localhost:8081`

## Tests
```bash
npm test
```

## Build
```bash
npm run build
```

## Modules covered
- Masters: Customers, Products
- Inventory: Batch availability (FEFO)
- Orders: Sales order creation
- Checkout: Invoice generation and lock
- Payments: Allocation and outstanding aging
- Returns: Credit note preview
- Reporting: Sales, aging, near-expiry