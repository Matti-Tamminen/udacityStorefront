CREATE TABLE store.order_rows (id SERIAL PRIMARY KEY, quantity INTEGER NOT NULL CHECK (quantity > 0));