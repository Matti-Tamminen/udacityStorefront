ALTER TABLE store.order_headers DROP COLUMN customer_id CASCADE;
ALTER TABLE store.order_headers DROP COLUMN user_id CASCADE;
ALTER TABLE store.order_rows DROP COLUMN product_id CASCADE;
ALTER TABLE store.order_rows DROP COLUMN order_id CASCADE;