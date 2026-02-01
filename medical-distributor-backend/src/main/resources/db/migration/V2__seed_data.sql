WITH perm_ids AS (
  INSERT INTO permissions (id, code, description, created_at, updated_at)
  VALUES
    (gen_random_uuid(), 'CUSTOMER_READ', 'Read customers', now(), now()),
    (gen_random_uuid(), 'CUSTOMER_WRITE', 'Manage customers', now(), now()),
    (gen_random_uuid(), 'PRODUCT_READ', 'Read products', now(), now()),
    (gen_random_uuid(), 'PRODUCT_WRITE', 'Manage products', now(), now()),
    (gen_random_uuid(), 'INVENTORY_READ', 'Read inventory', now(), now()),
    (gen_random_uuid(), 'INVENTORY_WRITE', 'Manage inventory', now(), now()),
    (gen_random_uuid(), 'ORDER_WRITE', 'Manage orders', now(), now()),
    (gen_random_uuid(), 'BILLING_WRITE', 'Create invoices', now(), now()),
    (gen_random_uuid(), 'PAYMENT_WRITE', 'Capture payments', now(), now()),
    (gen_random_uuid(), 'REPORT_READ', 'Read reports', now(), now())
  RETURNING id, code
), role_ids AS (
  INSERT INTO roles (id, name, description, created_at, updated_at)
  VALUES
    (gen_random_uuid(), 'SUPER_ADMIN', 'System administrator', now(), now()),
    (gen_random_uuid(), 'SALES_REP', 'Sales representative', now(), now()),
    (gen_random_uuid(), 'SALES_MANAGER', 'Sales manager', now(), now()),
    (gen_random_uuid(), 'WAREHOUSE', 'Warehouse operator', now(), now()),
    (gen_random_uuid(), 'FINANCE', 'Finance operator', now(), now()),
    (gen_random_uuid(), 'SUPPORT', 'Support', now(), now()),
    (gen_random_uuid(), 'AUDITOR', 'Auditor', now(), now())
  RETURNING id, name
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM role_ids r
CROSS JOIN perm_ids p
WHERE r.name IN ('SUPER_ADMIN', 'SALES_MANAGER', 'FINANCE');

WITH admin_role AS (SELECT id FROM roles WHERE name = 'SUPER_ADMIN'),
admin_user AS (
  INSERT INTO users (id, username, password_hash, full_name, email, status, created_at, updated_at)
  VALUES (gen_random_uuid(), 'admin', '$2a$10$7EqJtq98hPqEX7fNZaFWoO4x2W9WRkG7x1YgnSUQoqBYwygJyI6Cm',
          'System Admin', 'admin@meddist.local', 'ACTIVE', now(), now())
  RETURNING id
)
INSERT INTO user_roles (user_id, role_id)
SELECT admin_user.id, admin_role.id FROM admin_user, admin_role;

INSERT INTO customers (id, name, gstin, license_no, billing_address, shipping_address, contact_name, contact_phone,
  email, territory, credit_limit, payment_terms_days, status, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Apex Health Distributors', '27ABCDE1234F1Z5', 'LIC-2023-001',
   '12 Pharma Park, Pune', '12 Pharma Park, Pune', 'Ravi Shah', '+91-9876543210',
   'apex@health.com', 'West', 500000, 30, 'ACTIVE', now(), now()),
  (gen_random_uuid(), 'CarePlus Medicals', '29PQRSX6789L1Z2', 'LIC-2021-017',
   '88 MG Road, Bengaluru', '88 MG Road, Bengaluru', 'Anita Rao', '+91-9988776655',
   'careplus@med.com', 'South', 300000, 15, 'ACTIVE', now(), now());

INSERT INTO products (id, sku, name, hsn, gst_rate, manufacturer, category, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'TAB-PARA-500', 'Paracetamol 500mg', '3004', 5.00, 'HealthCare Labs', 'Analgesic', now(), now()),
  (gen_random_uuid(), 'SYR-CET-60', 'Cetirizine Syrup 60ml', '3004', 12.00, 'Wellness Pharma', 'Antihistamine', now(), now());

INSERT INTO inventory_batch (id, product_id, batch_no, expiry_date, mrp, purchase_rate, qty_available, qty_reserved, qty_quarantine, branch_code, created_at, updated_at)
SELECT gen_random_uuid(), p.id, 'BCH-001', (current_date + interval '120 days')::date, 25.00, 18.00, 1000, 0, 0, 'HQ', now(), now()
FROM products p WHERE p.sku = 'TAB-PARA-500';

INSERT INTO inventory_batch (id, product_id, batch_no, expiry_date, mrp, purchase_rate, qty_available, qty_reserved, qty_quarantine, branch_code, created_at, updated_at)
SELECT gen_random_uuid(), p.id, 'BCH-002', (current_date + interval '60 days')::date, 42.00, 30.00, 600, 0, 0, 'HQ', now(), now()
FROM products p WHERE p.sku = 'SYR-CET-60';

INSERT INTO invoice_sequence (branch_code, financial_year, next_seq)
VALUES ('HQ', '2025-26', 1);
