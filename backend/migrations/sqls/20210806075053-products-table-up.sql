CREATE TABLE store.products (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, price NUMERIC CHECK (price > 0), category VARCHAR(50));