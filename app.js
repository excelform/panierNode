'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Panier = require('./panier');
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

var ligneSchema = new mongoose.Schema({
	prorietaire : String,
	code : String,
	qte : Number,
	prix : Number
}, {
    versionKey: false
});

var clientModel = mongoose.model('clients', clientSchema);
var ligneModel = mongoose.model('lignes', ligneSchema);

var monClient = new clientModel({ nom : 'rambo', prenom : 'john', email : 'john.rambo@boom.com', password : '123456' });
var maLigne = new ligneModel({proprietaire : "john.rambo@boom.com", code : "1" , qte : 53 , prix : 9});
monClient.save(function (err) {
  if (err) throw err;
  console.log('client ajouté avec succès !'); 
});
maLigne.save(function (err) {
  if (err) throw err;
  console.log('ligne panier ajouté avec succès !'); 
});
var monPanier;
ligneModel.find({}, function (err, liste) 
{
	if (err)  console.log(err);
	monPanier = liste;
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
var chargerPanier = function(){
	personnes.destroy({where: {nom: pers.nom, prenom: pers.prenom}}).then(function(arg){
		console.log(arg);
	});
}
app.get("/", function(req, res) {
			res.render('login.ejs', {}); 
	})
.post('/connecter', function(req, res) {
    var client = checkLogin(req.body.login, req.body.mdp)
	if (client) 
	{
		res.render('index.ejs', {client: client , liste : monPanier , nbre : monPanier.length}); 
    }
    else res.redirect('/');
});
// .post('/ajouter', function(req, res) {
    // if (req.body.nom != '' && req.body.prenom != '') 
	// {
		// var pers = creerPersonne(req.body.prenom, req.body.nom);
		// ajouterPersonne(pers);
    // }
    // res.redirect('/');

app.listen(5000);