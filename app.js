'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var LignePanier = require('./LignePanier');
//var Panier = require('./Panier');
var Client = require('./client');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// initialisation de mongoose
mongoose.connect('mongodb://localhost/caddy', function(err) {
  if (err) throw err;
});


var clientSchema = new mongoose.Schema({
	nom : String,
	prenom : String,
	email : String,
	password : String
}, {
    versionKey: false
});

var clientModel = mongoose.model('clients', clientSchema);

var monClient = new clientModel({ nom : 'rambo', prenom : 'john', email : 'john.rambo@boom.com', password : '123456' });

monClient.save(function (err) {
  if (err) throw err;
  console.log('client ajouté avec succès !'); 
});

var clients;

clientModel.find({}, function (err, liste) 
{
	if (err)  console.log(err);
	clients = liste;
	mongoose.connection.close();
});
var checkLogin = function(login, mdp)
{
	for (var i = 0; i < clients.length; i++) 
	{
    if (clients[i].email == login && clients[i].password == mdp)
		return (clients[i]);
	}
}

app.get("/", function(req, res) {
			res.render('login.ejs', {}); 
	})
.post('/connecter', function(req, res) {
    var client = checkLogin(req.body.login, req.body.mdp)
	if (client) 
	{
		res.render('index.ejs', {client: client}); 
    }
    else res.redirect('/');
})

app.listen(5000);