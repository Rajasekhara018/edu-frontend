CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(80) NOT NULL UNIQUE,
  description varchar(200),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(120) NOT NULL UNIQUE,
  description varchar(200),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE role_permissions (
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username varchar(120) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  full_name varchar(160) NOT NULL,
  email varchar(160),
  territory varchar(50),
  branch_code varchar(30),
  status varchar(20) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token varchar(400) NOT NULL UNIQUE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamp NOT NULL,
  revoked boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(200) NOT NULL,
  gstin varchar(30) UNIQUE,
  license_no varchar(50),
  billing_address text,
  shipping_address text,
  contact_name varchar(120),
  contact_phone varchar(30),
  email varchar(160),
  territory varchar(50),
  credit_limit numeric(14,2) NOT NULL DEFAULT 0,
  payment_terms_days int NOT NULL DEFAULT 0,
  status varchar(20) NOT NULL,
  account_manager_id uuid REFERENCES users(id),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku varchar(80) NOT NULL UNIQUE,
  name varchar(200) NOT NULL,
  hsn varchar(30),
  gst_rate numeric(5,2) NOT NULL DEFAULT 0,
  manufacturer varchar(160),
  category varchar(120),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE inventory_batch (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id),
  batch_no varchar(80) NOT NULL,
  expiry_date date NOT NULL,
  mrp numeric(14,2) NOT NULL,
  purchase_rate numeric(14,2) NOT NULL,
  qty_available numeric(14,2) NOT NULL DEFAULT 0,
  qty_reserved numeric(14,2) NOT NULL DEFAULT 0,
  qty_quarantine numeric(14,2) NOT NULL DEFAULT 0,
  branch_code varchar(30),
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120),
  UNIQUE (product_id, batch_no)
);

CREATE INDEX idx_inventory_product_expiry ON inventory_batch (product_id, expiry_date);

CREATE TABLE sales_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_no varchar(40) NOT NULL UNIQUE,
  customer_id uuid NOT NULL REFERENCES customers(id),
  status varchar(30) NOT NULL,
  allocation_status varchar(20) NOT NULL,
  order_date date NOT NULL,
  branch_code varchar(30),
  subtotal numeric(14,2) NOT NULL,
  discount_total numeric(14,2) NOT NULL,
  tax_total numeric(14,2) NOT NULL,
  net_total numeric(14,2) NOT NULL,
  credit_checked boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE INDEX idx_sales_order_customer_status_created ON sales_order (customer_id, status, created_at);

CREATE TABLE sales_order_line (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES sales_order(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  quantity numeric(14,2) NOT NULL,
  unit_price numeric(14,2) NOT NULL,
  discount numeric(14,2) NOT NULL,
  tax_rate numeric(5,2) NOT NULL,
  net_amount numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE order_allocation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_line_id uuid NOT NULL REFERENCES sales_order_line(id) ON DELETE CASCADE,
  batch_id uuid NOT NULL REFERENCES inventory_batch(id),
  qty_allocated numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE dispatch (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE REFERENCES sales_order(id) ON DELETE CASCADE,
  lr_no varchar(80),
  vehicle_no varchar(80),
  transporter varchar(120),
  eta date,
  dispatched_at timestamp,
  delivered_at timestamp,
  status varchar(30) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE invoice_sequence (
  branch_code varchar(30) NOT NULL,
  financial_year varchar(20) NOT NULL,
  next_seq bigint NOT NULL,
  PRIMARY KEY (branch_code, financial_year)
);

CREATE TABLE invoice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no varchar(50) NOT NULL UNIQUE,
  order_id uuid NOT NULL UNIQUE REFERENCES sales_order(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  invoice_date date NOT NULL,
  branch_code varchar(30),
  financial_year varchar(20) NOT NULL,
  subtotal numeric(14,2) NOT NULL,
  discount_total numeric(14,2) NOT NULL,
  tax_total numeric(14,2) NOT NULL,
  net_total numeric(14,2) NOT NULL,
  paid_amount numeric(14,2) NOT NULL DEFAULT 0,
  outstanding_amount numeric(14,2) NOT NULL,
  status varchar(20) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE invoice_line (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoice(id) ON DELETE CASCADE,
  order_line_id uuid REFERENCES sales_order_line(id),
  product_id uuid NOT NULL REFERENCES products(id),
  batch_id uuid NOT NULL REFERENCES inventory_batch(id),
  quantity numeric(14,2) NOT NULL,
  unit_price numeric(14,2) NOT NULL,
  discount numeric(14,2) NOT NULL,
  tax_rate numeric(5,2) NOT NULL,
  net_amount numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE payment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  payment_date date NOT NULL,
  amount numeric(14,2) NOT NULL,
  method varchar(20) NOT NULL,
  reference varchar(120),
  status varchar(20) NOT NULL,
  notes text,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE payment_allocation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payment(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES invoice(id),
  amount numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE return_order (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoice(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  return_date date NOT NULL,
  reason varchar(200),
  status varchar(20) NOT NULL,
  total_amount numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE return_line (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id uuid NOT NULL REFERENCES return_order(id) ON DELETE CASCADE,
  invoice_line_id uuid NOT NULL REFERENCES invoice_line(id),
  batch_id uuid NOT NULL REFERENCES inventory_batch(id),
  quantity numeric(14,2) NOT NULL,
  unit_price numeric(14,2) NOT NULL,
  tax_rate numeric(5,2) NOT NULL,
  net_amount numeric(14,2) NOT NULL,
  saleable boolean NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE credit_note (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_no varchar(50) NOT NULL UNIQUE,
  invoice_id uuid NOT NULL REFERENCES invoice(id),
  return_id uuid NOT NULL REFERENCES return_order(id),
  credit_date date NOT NULL,
  amount numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE credit_note_line (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_note_id uuid NOT NULL REFERENCES credit_note(id) ON DELETE CASCADE,
  invoice_line_id uuid NOT NULL REFERENCES invoice_line(id),
  quantity numeric(14,2) NOT NULL,
  amount numeric(14,2) NOT NULL,
  created_at timestamp NOT NULL DEFAULT now(),
  updated_at timestamp NOT NULL DEFAULT now(),
  created_by varchar(120),
  updated_by varchar(120)
);

CREATE TABLE audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type varchar(80) NOT NULL,
  entity_id uuid NOT NULL,
  action varchar(80) NOT NULL,
  before_data jsonb,
  after_data jsonb,
  user_id uuid,
  correlation_id varchar(120),
  created_at timestamp NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_entity ON audit_log (entity_type, entity_id, created_at);
