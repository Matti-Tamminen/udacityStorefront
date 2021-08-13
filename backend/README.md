# udacityStorefront
RESTful api for course to provide secured endpoints to show product information.

## Development setup (.env & database.json)
* create .env file at backend root and add:
    * POSTGRES_USER='your postgres username'
    * POSTGRES_PASSWORD='your postgres password'
    * POSTGRES_HOST=127.0.0.1
    * POSTGRES_DB='your main dev-database'
    * POSTGRES_DB_TEST='your test database'
    * PORT=5432
    * ENV=dev
    * BCRYPT_PASSWORD='pepper for crypting'
    * SALT_ROUNDS='rounds to hash'
    * TOKEN_SECRET='token pepper'
* create database.json file backend root and add:
    * {
    * "dev": {
    * "driver": "pg",
    * "host": "127.0.0.1",
    * "database": 'your database',
    * "user": 'your username',
    * "password": 'your password'
    * },
    * "test": {
    * "driver": "pg",
    * "host": "127.0.0.1",
    * "database": 'your test database',
    * "user": 'your username',
    * "password": 'your password'
    * }
    * }

## Ports
* default port for backend db is 5432 and backend server is 3000

## Schema
* project uses schema 'store' not mentioned in migrations, create schema to your dev-db and test-db
* all the PKs are SERIAL NOT NULL
* FKs are constrained, price and quantity are constrained (> 0)

## Tables
* Product (store.products):
    * id INTEGER (PK)
    * name VARCHAR(50) NOT NULL
    * price NUMERIC(10,2) 
    * category VARCHAR(50)

* Customer (store.customers):
    * id INTEGER (PK)
    * name VARCHAR(100)
    * street_address VARCHAR
    * postal_code INTEGER
    * city VARCHAR(50)

* Order_header (store.order_headers):
    * id INTEGER (PK)
    * customer_id INTEGER NOT NULL (FK -> customers)
    * user_id INTEGER NOT NULL (FK -> users)
    * active BOOLEAN NOT NULL DEFAULT(true)

* Order_row (store.order_rows):
    * id INTEGER (PK)
    * product_id INTEGER NOT NULL(FK -> products)
    * order_id INTEGER NOT NULL(FK -> order_headers)
    * quantity INTEGER NOT NULL

* User (store.users):
    * id INTEGER (PK)
    * first_name VARCHAR
    * last_name VARCHAR NOT NULL
    * username VARCHAR NOT NULL
    * password VARCHAR NOT NULL

## Endpoints (open)
* POST /users/create -> create user
* GET /index -> safe user information
* POST /login -> provides token when passed

* GET /products -> list all products
* GET /products/:id -> show product
* GET /products/category/:category -> list products of given category
* GET /products/top5 -> list 5 most popular products

## Endpoints (secured)
* POST /products/create -> create product
* POST /customers/create -> create customer
* POST /orders/headers/create -> create header (customer and user required)
* POST /orders/headers/:order_id/add -> add row to header (header and product required)

* GET /orders/details/:id -> detailed information about order
* GET /orders/user/:user_id -> list orders from given user

## Testing urls
* GET base http://localhost:3000/
* GET users http://localhost:3000/index
* GET products http://localhost:3000/products
* GET category http://localhost:3000/products/category/*
* GET top5 http://localhost:3000/products/top5
* GET details http://localhost:3000/orders/details/*
* GET userorders http://localhost:3000/orders/user/*

## Scripts
* "lint" -> starts eslint fix
* "watch" -> starts tsc-watch
* "migrate" -> migrates db
* "build" -> builds typescript and migrates db
* "start" -> starts build version
* "test" -> runs test db migrations and jasmine