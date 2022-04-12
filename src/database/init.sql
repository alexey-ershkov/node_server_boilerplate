drop table if exists users_stock;
drop table if exists users cascade;
drop table if exists stocks cascade;

create extension if not exists citext;

create table users
(
    id        serial primary key,
    email     citext collate "C" not null unique,
    first_name text               not null,
    last_name  text               not null,
    password  text               not null,
    balance   bigint default 0
);

create table stocks
(
    symbol      citext collate "C" primary key,
    title       text not null,
    logo_url     text not null,
    description text not null,
    website     text not null,
    country     text not null
);

create table users_stock
(
    user_id      integer            not null references users (id) on delete cascade,
    stock_symbol citext collate "C" not null references stocks (symbol) on delete cascade
)