CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP IF EXISTS TABLE users;
CREATE TABLE users (id SERIAL primary key not null, name varchar(250) not null, email varchar(250) not null unique, password varchar(250), apikey uuid DEFAULT uuid_generate_v4());
INSERT INTO users (name, email, password) VALUES ('admin', 'admin@traveldb.mail', 'secret');
