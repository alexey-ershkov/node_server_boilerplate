drop table if exists users cascade;
drop table if exists stocks cascade;
drop table if exists users_stock;
drop table if exists quote;

create extension if not exists citext;

create table users
(
    id         serial primary key,
    email      citext collate "C" not null unique,
    first_name text               not null,
    last_name  text               not null,
    password   text               not null,
    balance    bigint default 0
);

create table stocks
(
    symbol                citext collate "C" primary key,
    name                  text  not null,
    logo                  text  not null,
    description           text default '',
    website               text  not null,
    country               text  not null,
    exchange              text  not null,
    ipo                   date  not null,
    market_capitalization float not null,
    phone                 text  not null,
    share_outstanding     float not null,
    industry              text  not null
);

create table users_stock
(
    user_id      integer            not null references users (id) on delete cascade,
    stock_symbol citext collate "C" not null references stocks (symbol) on delete cascade,
    count        integer            not null,
    constraint pk_user_id_stock_symbol primary key (user_id, stock_symbol)
);

create table quote
(
    symbol         citext collate "C" primary key not null references stocks (symbol) on delete cascade,
    current_price  float                          not null,
    change         float                          not null,
    percent_change float                          not null,
    high           float                          not null,
    low            float                          not null,
    open           float                          not null,
    prev_close     float                          not null,
    updated_at     timestamp                           not null
);