FROM postgres:13

ADD /database/create-database.sql /docker-entrypoint-initdb.d

WORKDIR /app

EXPOSE 3000