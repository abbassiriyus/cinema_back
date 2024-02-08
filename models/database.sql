   create table cinema(
        "id" serial primary key,
        "payment" text,
        "type" text,
        "year" INTEGER NOT NULL,
        "title" text,
        "more_loking" integer default 0 not null,
        "time" integer,
        "appearance" integer,
        "ovoz_berdi" text,
        "country" text,
        "age_limit" integer,
        "description" text,
        "looking" boolean default false not null,
        "language" text,
        "video" text,
        "treler" text,
        "tayming" text,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
    create table image_cinema(
       "id" serial primary key,
       "cinema_id" integer not null,
       "image" text,
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null
    );
create table comment(
       "id" serial primary key,
       "cinema_id" integer not null,
       "supcomment" integer not null,
       "description" text,
       "quanty" boolean default false not null,
       "creator" integer not null,
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null
 );
create table comment_mark(
       "id" serial primary key,
       "dislike" boolean default false not null ,
       "comment_id" integer not null,
       "creator" integer not null,
       unique(creator,comment_id),
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null      
);
create table sharx(
       "id" serial primary key,
       "cinema_id" integer not null,
       "description" text,
       "rating" integer default 6 not null,
       "title" text,
       "creator" integer not null,
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null
);
create table aloqa(
       "id" serial primary key,
       "fullname" text,
       "tema" text,
       "message" text,
       "email" text,
       "time_create" timestamp default current_timestamp not null,
       "time_update" timestamp default current_timestamp not null
);

create table tarjima_cinema(
        "id" serial primary key,
        "cinema_id" integer not null,
        "tarjimon_id" integer not null,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
create table janr_cinema(
        "id" serial primary key,
        "cinema_id" integer not null,
        "janr_id" integer not null,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
create table tarjima(
        "id" serial primary key,
        "full_name" VARCHAR (50),
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
create table janr(
        "id" serial primary key,
        "title" VARCHAR(50) NOT null,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );
create table mark(
        "id" serial primary key,
        "cinema_id" integer,
        "title" integer,
        "time_create" timestamp default current_timestamp not null,
        "time_update" timestamp default current_timestamp not null
    );

create table users(
    "id" serial primary key,
    "email" VARCHAR (50),
    "password" text,
    "familiya" text,
    "pan" boolean default true not null,
    "ptichka" boolean default false not null,
    "name" text,
    "token" text, 
     unique(email),
    "superadmin" boolean default false not null,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
    );

create table seriallar(
    "id" serial primary key,
    "video" text,
    "cinema_id" integer,
    "title" text,
    "more_loking" integer default 0 not null,
    "time" integer,
    "time_create" timestamp default current_timestamp not null,
    "time_update" timestamp default current_timestamp not null
);
 
create table carousel(
 "id" serial primary key,
 "cinema_id" integer,
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null
);
create table paykino(
 "id" serial primary key,
 "user_id" integer not null,
 "start_day" date not null,
 "end_day" date not null,
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null
);
create table look_me(
 "id" serial primary key,
 "cinema_id" integer not null,
 "user_id" integer not null,
 unique(cinema_id, user_id),
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null
);

ALTER SEQUENCE paykino_id_seq OWNED BY paykino.id;
GRANT USAGE, SELECT ON SEQUENCE paykino_id_seq TO uzdubuz_id_rsa;