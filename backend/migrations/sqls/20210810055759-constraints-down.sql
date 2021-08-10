ALTER TABLE store.order_headers ALTER COLUMN customer_id DROP NOT NULL;
ALTER TABLE store.order_headers ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE store.order_rows ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE store.order_rows ALTER COLUMN order_id DROP NOT NULL;
ALTER TABLE store.products ALTER COLUMN price TYPE numeric;
ALTER TABLE store.order_headers ALTER COLUMN active DROP DEFAULT;