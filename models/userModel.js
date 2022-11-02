const { Pool } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "traveldb",
  port: 5432,
};

// Connect with a connection pool.

async function poolDemo() {
  const pool = new Pool(credentials);
  const now = await pool.query(
    `create table users (
    id SERIAL primary key not null,
    name varchar(250) not null,
    email varchar(250) not null unique,
    password varchar(250));`
  );
  await pool.end();

  return now;
}

(async () => {
    const poolResult = await poolDemo();
})();

