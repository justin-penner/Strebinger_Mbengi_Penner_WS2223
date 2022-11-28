const express = require('express');
const app = express();
const userDB = require('../models/userModel.js');
const path = require("path")

const User = {
    "name": null,
    "email": null,
    "apikey": null
}

exports.index = async function(req, res) {
    res.status(200).sendFile('index.html', { root: path.join(__dirname, '../views') }); 
}

exports.register = async function(req, res) {
    if(req.headers.accept != "application/json") {
        res.status(200).sendFile('register.html', { root: path.join(__dirname, '../views') }); 
    } else {
        const json = {
            "password":null,
	        "name":null,
	        "email":null
        }
        res.status(200).send(json);
    }
}

exports.loginPage = async function(req, res) {
    if(req.headers.accept != "application/json") {
        if(User.name == null && User.email == null && User.apikey == null) {console.log("Logged out!"); res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') })} else {res.status(200).redirect("/user")}
    } else {
        const json = {
            "password":null,
	        "name":null,
	        "email":null
        }
        res.status(200).send(json);
    }
}

exports.info = async function(req, res) {
    if(req.headers.accept != "application/json") {
        if(User.email != null && User.name != null && User.apikey != null) {
            res.send("<p>Hello, " + User.name + "</p>" +
            "<p>E-mail: " + User.email + "</p>" +
            "<p>Api-Key: " + User.apikey + "</p>" + 
            "<a href='/logout'>Logout</a>")
        } else {console.log("Logged out!");res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') });}
    } else {
        res.status(200).send(User);
    }
}

exports.login = async function(req, res) {
    let usr = await userDB.getUserByEmail(req, res, req.body.email);
    usr = await usr.rows[0];
    if((await usr) == null) {
        console.log({error:"Wrong Email!"})
        res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views')});

    } else if ((await usr).password != req.body.password) {
        console.log({error:"Wrong Password!"})
        res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views')});

    } else {
        User.name = (await usr).name
        User.email = (await usr).email
        User.apikey = (await usr).apikey
        res.status(200).redirect("/user");
    }
}

exports.logout = async function(req, res) {
    User.name = null; User.email = null; User.apikey = null;
    res.status(200).redirect("/index");
}

exports.create = async function(req, res) {
    userDB.create(req, res);
}