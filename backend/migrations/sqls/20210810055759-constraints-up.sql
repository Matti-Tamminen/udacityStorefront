ALTER TABLE store.order_headers ALTER COLUMN customer_id SET NOT NULL;
ALTER TABLE store.order_headers ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE store.order_rows ALTER COLUMN product_id SET NOT NULL;
ALTER TABLE store.order_rows ALTER COLUMN order_id SET NOT NULL;
ALTER TABLE store.products ALTER COLUMN price TYPE numeric(10,2);
ALTER TABLE store.order_headers ALTER COLUMN active SET DEFAULT true;