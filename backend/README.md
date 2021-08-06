# udacityStorefront
RESTful api for course to provide secured endpoints to show product information.

## Development setup (.env & database.json)
* create .env file at backend root and add:
POSTGRES_USER=<your postgres username>
POSTGRES_PASSWORD=<your postgres password>
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=<your main dev-database>
POSTGRES_DB_TEST=<your test database>
PORT=5432
ENV=dev
BCRYPT_PASSWORD=<pepper for crypting>
SALT_ROUNDS=<rounds to hash>
TOKEN_SECRET=<token pepper>
* create database.json file backend root and add:
{
    "dev": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": <your database>,
        "user": <your username>,
        "password": <your password>
    },
    "test": {
        "driver": "pg",
        "host": "127.0.0.1",
        "database": <your test database>,
        "user": <your username>,
        "password": <your password>
    }
}

## Scripts
* "dev-server" -> starts tsc-watch
* "build" -> builds typescript


## Schema
* Product (products):
** id (PK)
** name
** price
** category

* Customer (customers):
** id (PK)
** name
** street_address
** postal_code
** city

* Order_header (order_headers):
** id (PK)
** customer_id (FK -> customers)
** user_id (FK -> users)
** active

* Order_row (order_rows):
** id (PK)
** product_id (FK -> products)
** order_id (FK -> order_headers)
** quantity

* User (users):
** id (PK)
** first_name
** last_name
** username
** password

## Views
* Details - full order information with products 
* Users - user names listed without secrets
* TopSellers - top5 most sold products
* Category - products listed by category

## Endpoints

## Testing urls