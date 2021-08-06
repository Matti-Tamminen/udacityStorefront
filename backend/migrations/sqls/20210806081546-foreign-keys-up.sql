ALTER TABLE store.order_headers ADD customer_id INTEGER REFERENCES store.customers (id);
ALTER TABLE store.order_headers ADD user_id INTEGER REFERENCES store.users (id);
ALTER TABLE store.order_rows ADD product_id INTEGER REFERENCES store.products (id);
ALTER TABLE store.order_rows ADD order_id INTEGER REFERENCES store.order_headers (id);