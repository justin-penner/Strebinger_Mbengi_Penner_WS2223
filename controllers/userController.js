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
        if(User.name == null && User.email == null && User.apikey == null) {
            res.status(200).sendFile('login.html', { root: path.join(__dirname, '../views') })
        } 
        else {
            res.status(200).redirect("/user")
        }
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
            res.send("<head><link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css' integrity='sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T' crossorigin='anonymous'></head>" + 
            "<p>Hello, " + User.name + "</p>" +
            "<p>E-mail: " + User.email + "</p>" +
            "<p>Api-Key: " + User.apikey + "</p>" + 
            "<a href='/logout'>Logout</a> <br>" +
            "<a href='/update-email'>Update E-mail</a> <br>" +
            "<a href='/update-password'>Update Password</a>" + 
            "<form action='/delete?email="+ User.email +"' method='post'><button type='Submit' class='btn btn-danger'>Delete</button></form>")
        } else {
            res.status(400).send({"error":"Logged Out! FILE!!!!"})
            //res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') });
        }
    } else {
        res.status(200).send(User);
    }
}

exports.login = async function(req, res) {
    let usr = await userDB.getUserByEmail(req, res, req.body.email);
    usr = await usr.rows[0];
    
    if((await usr) == null) {
        if(req.headers.accept != "application/json") {
            res.status(400).send({"error":"Wrong E-mail! FILE!!!!"});
            // res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views')});
        } else {
            res.status(400).send({"error":"Wrong E-mail!"});
        }

    } else if ((await usr).password != req.body.password) {
        if(req.headers.accept != "application/json") {
            res.status(400).send({"error":"Wrong Password! FILE!!!!"})
            // res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views')});
        } else {
            res.status(400).send({"error":"Wrong Password!"});
        }
    } else {
        User.name = (await usr).name
        User.email = (await usr).email
        User.apikey = (await usr).apikey
        res.status(200).redirect("/user");
    }
}

exports.updatePageEmail = async function(req, res) {
    if(User.apikey != null) {
        if(req.headers.accept != "application/json") {
            res.status(200).sendFile('update-email.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(200).send({"email":null});
        }
    } else {
        if(req.headers.accept != "application/json") {
            res.status(400).send({"error":"logged out! FILE!!!!"})
            // res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(400).send({"error":"logged out"});
        }
    }
}


exports.updateEmail = async function(req, res) {
    try {
        let emails = await userDB.getAllEmails(req, res);
        if(req.headers.accept != "application/json") {
            if(checkEmail(req.body.email, emails.rows)==true) {
                try {
                    userDB.updateEmail(req, res, User.email);
                } catch(err) {
                    res.status(400).send({"error":"Failed TO Update! FILE!!!!"})
                }
                User.email = req.body.email;
                res.status(200).redirect("/user");
            } else {
                res.status(400).send({"error":"E-mail Already exists FILE!!!!"})
            }
        } else {
            if(checkEmail(req.body.email, emails.rows)==true) {
                try {
                    userDB.updateEmail(req, res, User.email);
                } catch(err) {
                    res.status(400).send({"error":"Failed to Update!"})
                }
                User.email = req.body.email;
                res.status(200).redirect("/user");
            } else {
                res.status(400).send({"error":"E-mail Already exists"})
            }
        }
    } catch (err) {
        if(req.headers.accept != "applicatiob/json") {
            res.status(400).sendFile('update-email.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(400).send({"error": err})
        }
    }
}

exports.updatePagePassword = async function(req, res) {
    if(User.apikey != null) {
        if(req.headers.accept != "application/json") {
            res.status(200).sendFile('update-password.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(200).send({"password":null});
        }
    } else {
        if(req.headers.accept != "application/json") {
            res.status(400).send({"error":"logged out! FILE!!!!"})
            // res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(400).send({"error":"logged out"});
        }
    }
}

exports.updatePassword = async function(req, res) {
    try {
            userDB.updatePassword(req, res, User.email);
            User.password = req.body.password;
            res.status(200).redirect("/user");
    } catch(err) {
        if(req.headers.accept != "applicatiob/json") {
            res.status(500).send({"error":"Failed to update Password! FILE!!!!"})
            // res.status(400).sendFile('update-password.html', { root: path.join(__dirname, '../views') }); 
        } else {
            res.status(500).send({"error":"Failed to update Password!"})
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

exports.delete = async function(req, res) {
    try{
        userDB.delete(req, res);
        User.name = null;
        User.email = null;
        User.apikey = null;
        res.status(200).redirect("/login");
    } catch(err) {
        if(req.body.accept != "application/json") {
            res.status(500).send({"error":"Could not delete! FILE!!!"});
        } else {
            res.status(500).send({"error":"Could not delete!"})
        }
    }
}