const express = require('express');
const app = express();
const userDB = require('../models/userModel.js');
const path = require('path');

const User = {
	name: null,
	email: null,
	apikey: null,
};

exports.index = async function (req, res) {
	if (req.headers.accept != 'application/json') {
		res.status(200).sendFile('index.html', {
			root: path.join(__dirname, '../views'),
		});
	} else {
		res.status(200).send(User);
	}
};

exports.register = async function (req, res) {
	if (req.headers.accept != 'application/json') {
		res.status(200).sendFile('register.html', {
			root: path.join(__dirname, '../views'),
		});
	} else {
		const json = {
			password: null,
			name: null,
			email: null,
		};
		res.status(200).send(json);
	}
};

exports.loginPage = async function (req, res) {
	if (req.headers.accept != 'application/json') {
		if (User.name == null && User.email == null && User.apikey == null) {
			res.status(200).sendFile('login.html', {
				root: path.join(__dirname, '../views'),
			});
		} else {
			res.status(200).redirect('/user');
		}
	} else {
		const json = {
			password: null,
			email: null,
		};
		res.status(200).send(json);
	}
};

exports.info = async function (req, res) {
	if (req.headers.accept != 'application/json') {
		if (User.email != null && User.name != null && User.apikey != null) {
			res.status(200).send(`
				<head>
					<meta charset="UTF-8">
					<meta http-equiv="X-UA-Compatible" content="IE=edge">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Account</title>
				</head>

				<style>

					@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

					body {
						padding: 0;
						margin: 0;
						font-family: 'Roboto';
						background-image: linear-gradient(-225deg, #FFFEFF 0%, #D7FFFE 100%);
						height: 100vh;
						width: 100vw;
					}
				
					.container {
						position: absolute;
						top: 0;
						left: 0;
						width: fit-content;
						padding: 100px;
					}
				
					h1 {
						font-size: 30px;
						font-weight: bold;
					}
				
					h2 {
						font-size: 18px;
						font-weight: bold;
						margin-top: 20px;
						margin-bottom: 0;
					}
				
					p {
						font-size: 16px;
						margin-top: 5px;
					}

					a {
						color: #000000;
						margin-top: 10px;
					}

					button {
						margin-top: 10px;
						width: 100%;
						height: 34px;
						border: 2px solid #489fb5;
						border-radius: 5px;
						background: #489fb5;
						color: #fcfcfc;
						font-size: 14px;
						transition: 300ms ease-in-out;
						cursor: pointer;
					}

					button:hover {
						background: transparent;
						color: #489fb5;
					}
				
				</style>
				
				<body>
				
					<div class="container">
				
						<h1>
							Account
						</h1>
				
						<div class="personal-data">
				
							<p class="welcome">Hello </p>
				
							<h2>E-Mail</h2>
							<p class="email"></p>
				
							<h2>API-Key</h2>
							<p class="apikey"></p>
				
						</div>

						<div class="user-actions">
							<a href='/logout'>Logout</a> <br>
							<a href='/update-email'>Update E-mail</a> <br>
							<a href='/update-password'>Update Password</a>
							<form action='/delete?email=' method='post'><button type='Submit' class='btn btn-danger'>Delete</button></form> 
						</div>
				
					</div>

				</body>
				
					<script>
					
						document.querySelector(".welcome").textContent += "${User.name}";
						document.querySelector(".email").textContent = "${User.email}";
						document.querySelector(".apikey").textContent = "${User.apikey}";
						document.querySelector('form').action += "${User.email}";
					
					</script>
				
				</html>
			`);
		} else {
			res.status(400).send({ error: 'Logged Out! FILE!!!!' });
			//res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') });
		}
	} else {
		res.status(200).send(User);
	}
};

exports.login = async function (req, res) {
	let usr = await userDB.getUserByEmail(req, res, req.body.email);
	usr = await usr.rows[0];

	if ((await usr) == null) {
		if (req.headers.accept != 'application/json') {
			res.status(400).send({ error: 'Wrong E-mail! FILE!!!!' });
			// res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views')});
		} else {
			res.status(400).send({ error: 'Wrong E-mail!' });
		}
	} else if ((await usr).password != req.body.password) {
		if (req.headers.accept != 'application/json') {
			res.status(400).send({ error: 'Wrong Password! FILE!!!!' });
			// res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views')});
		} else {
			res.status(400).send({ error: 'Wrong Password!' });
		}
	} else {
		User.name = (await usr).name;
		User.email = (await usr).email;
		User.apikey = (await usr).apikey;
		if (req.headers.accept != 'application/json') {
			res.status(200).redirect('/user');
		} else {
			res
				.status(200)
				.send({ info: 'logged in, try GET /user to get UserInfo' });
		}
	}
};

exports.updatePageEmail = async function (req, res) {
	if (User.apikey != null) {
		if (req.headers.accept != 'application/json') {
			res.status(200).sendFile('update-email.html', {
				root: path.join(__dirname, '../views'),
			});
		} else {
			res.status(200).send({ email: null });
		}
	} else {
		if (req.headers.accept != 'application/json') {
			res.status(400).send({ error: 'logged out! FILE!!!!' });
			// res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') });
		} else {
			res.status(400).send({ error: 'logged out' });
		}
	}
};

exports.updateEmail = async function (req, res) {
	try {
		let emails = await userDB.getAllEmails(req, res);
		if (req.headers.accept != 'application/json') {
			if (checkEmail(req.body.email, emails.rows) == true) {
				try {
					userDB.updateEmail(req, res, User.email);
				} catch (err) {
					res.status(400).send({
						error: 'Failed TO Update! FILE!!!!',
					});
				}
				User.email = req.body.email;
				res.status(200).redirect('/user');
			} else {
				res.status(400).send({
					error: 'E-mail Already exists FILE!!!!',
				});
			}
		} else {
			if (checkEmail(req.body.email, emails.rows) == true) {
				try {
					userDB.updateEmail(req, res, User.email);
				} catch (err) {
					res.status(400).send({ error: 'Failed to Update!' });
				}
				User.email = req.body.email;
				res.status(200).send({ info: 'updated user email!' });
			} else {
				res.status(400).send({ error: 'E-mail Already exists' });
			}
		}
	} catch (err) {
		if (req.headers.accept != 'applicatiob/json') {
			res.status(400).sendFile('update-email.html', {
				root: path.join(__dirname, '../views'),
			});
		} else {
			res.status(400).send({ error: err });
		}
	}
};

exports.updatePagePassword = async function (req, res) {
	if (User.apikey != null) {
		if (req.headers.accept != 'application/json') {
			res.status(200).sendFile('update-password.html', {
				root: path.join(__dirname, '../views'),
			});
		} else {
			res.status(200).send({ password: null });
		}
	} else {
		if (req.headers.accept != 'application/json') {
			res.status(400).send({ error: 'logged out! FILE!!!!' });
			// res.status(400).sendFile('login.html', { root: path.join(__dirname, '../views') });
		} else {
			res.status(400).send({ error: 'logged out' });
		}
	}
};

exports.updatePassword = async function (req, res) {
	try {
		userDB.updatePassword(req, res, User.email);
		User.password = req.body.password;
		if (req.headers.accept != 'application/json') {
			res.status(200).redirect('/user');
		} else {
			res.status(200).send({ info: 'updated user password!' });
		}
	} catch (err) {
		if (req.headers.accept != 'applicatiob/json') {
			res.status(500).send({
				error: 'Failed to update Password! FILE!!!!',
			});
			// res.status(400).sendFile('update-password.html', { root: path.join(__dirname, '../views') });
		} else {
			res.status(500).send({ error: 'Failed to update Password!' });
		}
	}
};

function checkEmail(email, dbEmail) {
	let boolean = true;
	dbEmail.forEach((element) => {
		if (element.email == email) {
			boolean = false;
		}
	});
	return boolean;
}

exports.logout = async function (req, res) {
	try {
		User.name = null;
		User.email = null;
		User.apikey = null;
		res.status(200).redirect('/index');
	} catch (err) {
		res.status(400).send({ error: err });
	}
};

exports.create = async function (req, res) {
	userDB.create(req, res);
};

exports.delete = async function (req, res) {
	try {
		userDB.delete(req, res);
		User.name = null;
		User.email = null;
		User.apikey = null;
		if (req.headers.accept != 'application/json') {
			res.status(200).redirect('/index');
		} else {
			res
				.status(200)
				.send({ info: 'deleted! post on register to create an account!' });
		}
	} catch (err) {
		if (req.body.accept != 'application/json') {
			res.status(500).send({ error: 'Could not delete! FILE!!!' });
		} else {
			res.status(500).send({ error: 'Could not delete!' });
		}
	}
};

exports.getAllApiKeys = async function (req, res) {
	try {
		let keys = await userDB.getAllApiKeys(req, res);
		return await keys.rows;
	} catch (err) {
		if (req.body.accept != 'application/json') {
			res.status(500).send({
				error: 'Could not check API-Key! Try Again Later! FILE!!!',
			});
		} else {
			res.status(500).send({
				error: 'Could not check API-Key! Try Again Later!',
			});
		}
	}
};
