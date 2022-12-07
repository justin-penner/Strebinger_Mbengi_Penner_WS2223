CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users;
CREATE TABLE users (id SERIAL primary key not null, name varchar(250) not null, email varchar(250) not null unique, password varchar(250), apikey uuid DEFAULT uuid_generate_v4());
INSERT INTO users (name, email, password, apikey) VALUES ('admin', 'admin@traveldb.mail', 'secret', 'd2eee56f-8b93-4436-a920-d8756a8f5972');
