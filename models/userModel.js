const express = require('express');
const app = express();
const { Pool } = require("pg");

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "traveldb",
  port: 5432,
};

// Connect with a connection pool.
const pool = new Pool(credentials);

exports.create = async function (req, res) {
    try{
      const query = 'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)';
      const values = [req.body.name, req.body.email, req.body.password];
      await pool.query(query, values);
      res.redirect('/index');
    } catch (err) {
      res.status(500).send({error:err.code + " - " + err.constraint + " - email already exists"})
    }
}

exports.getUserByEmail = async function (req, res, email) {
    try{
      const query = 'SELECT * FROM users WHERE email=$1';
      const values = [email];
      return await pool.query(query, values);
    } catch (err) {
      res.status(500).send({error:err.code + " - " + err.constraint + " - email doesnt exist"})
    }
}

exports.getAllEmails = async function (req, res) {
  try {
    const query = 'SELECT email FROM users';
    return await pool.query(query);
  } catch (err) {
    res.status(500).send({"error": err})
  }
}

exports.updateEmail = async function(req, res, email) {
  try {
    const query = "UPDATE users SET email=$1 WHERE email=$2";
    const values = [req.body.email, email];
    return await pool.query(query, values);
  } catch (err) {
    res.status(500).send({error:"user doesnt exist"})
  }
}

exports.updatePassword = async function(req, res, email) {
  try {
    const query = "UPDATE users SET password=$1 WHERE email=$2";
    const values = [req.body.password, email];
    return await pool.query(query, values);
  } catch (err) {
    res.status(500).send({error:"user doesnt exist"})
  }
}
