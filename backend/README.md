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
    * "password": <your password>
    * },
    * "test": {
    * "driver": "pg",
    * "host": "127.0.0.1",
    * "database": 'your test database',
    * "user": 'your username',
    * "password": 'your password'
    * }
    * }

## Schema
* project uses schema 'store' not mentioned in migrations, create schema to your dev-db and test-db

## Tables
* Product (store.products):
    * id (PK)
    * name
    * price
    * category

* Customer (store.customers):
    * id (PK)
    * name
    * street_address
    * postal_code
    * city

* Order_header (store.order_headers):
    * id (PK)
    * customer_id (FK -> customers)
    * user_id (FK -> users)
    * active

* Order_row (store.order_rows):
    * id (PK)
    * product_id (FK -> products)
    * order_id (FK -> order_headers)
    * quantity

* User (store.users):
    * id (PK)
    * first_name
    * last_name
    * username
    * password

## Endpoints (open)
* /users/create -> create user
* /index -> safe user information
* /login -> provides token when passed

* /products -> list all products
* /products/:id -> show product
* /products/category/:category -> list products of given category
* /products/top5 -> list 5 most popular products

## Endpoints (secured)
* /products/create -> create product
* /customers/create -> create customer
* /orders/headers/create -> create header (customer and user required)
* /orders/headers/:order_id/add -> add row to header (header and product required)

* /orders/details/:id -> detailed information about order
* /orders/user/:user_id -> list orders from given user

## Testing urls
* base http://localhost:3000/
* products http://localhost:3000/products
* top5 http://localhost:3000/products/top5
* category http://localhost:3000/products/category/*
* details http://localhost:3000/orders/details/*
* myorders http://localhost:3000/orders/user/*

## Scripts
* "lint" -> starts eslint fix
* "watch" -> starts tsc-watch
* "build" -> builds typescript
* "start" -> starts build version
* "test" -> runs test db migrations and jasmine