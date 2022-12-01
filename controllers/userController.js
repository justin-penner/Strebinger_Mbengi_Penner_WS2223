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
    if(req.headers.accept != "application/json") {
        res.status(200).sendFile('index.html', { root: path.join(__dirname, '../views') }); 
    } else {
        res.status(200).send(User);
    }
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

exports.updatePage = async function(req, res) {
    if(User.apikey != null) {
        if(req.headers.accept != "application/json") {
            res.status(200).sendFile('update.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(200).send(User);
        }
    } else {
        if(req.headers.accept != "application/json") {
            console.log("Log in first")
            res.status(200).sendFile('login.html', { root: path.join(__dirname, '../views') }); 
        } else {
            const json = {
                "name":null,
                "password":null,
                "email":null
            }
            res.status(200).send(json);
        }
    }
}


exports.update = async function(req, res) {
    try {
        let emails = await userDB.getAllEmails(req, res);
        if(req.headers.accept != "application/json") {
            if(checkEmail(req.body.email, emails.rows)==true) {
                try {
                    userDB.updateUserByEmail(req, res, User.email);
                } catch(err) {
                    res.status(400).send({"error":"Failed TO Update!"})
                }
                User.email = req.body.email;
                User.name = req.body.name;
                User.password = req.body.password;
                res.status(200).redirect("/user");
            } else {
                res.status(400).send({"error":"E-mail Already exists"})
            }
        } else {
            if(checkEmail(req.body.email, emails.rows)==true) {
                try {
                    userDB.updateUserByEmail(req, res, User.email);
                } catch(err) {
                    res.status(400).send({"error":"Failed TO Update!"})
                }
                User.email = req.body.email;
                User.name = req.body.name;
                User.password = req.body.password;
                res.status(200).redirect("/user");
            } else {
                res.status(400).send({"error":"E-mail Already exists"})
            }
        }
    } catch (err) {
        if(req.headers.accept != "applicatiob/json") {
            res.status(400).sendFile('update.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(400).send({"error": err})
        }
    }
}

function checkEmail(email, dbEmail) {
    let boolean = true;
    dbEmail.forEach(element => {
        if(element.email == email ) {boolean = false;}
    });
    return boolean
}

exports.logout = async function(req, res) {
    try{
        User.name = null; User.email = null; User.apikey = null;
        res.status(200).redirect("/index");
    } catch (err) {
        res.status(400).send({"error": err});
    }
}

exports.create = async function(req, res) {
    userDB.create(req, res);
}