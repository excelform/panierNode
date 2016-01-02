'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Panier = require('./panier');

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
	proprietaire : String,
	code : String,
	qte : Number,
	prix : Number
}, {
    versionKey: false
});

var clientModel = mongoose.model('clients', clientSchema);
var ligneModel = mongoose.model('lignes', ligneSchema);

//var maLigne = new ligneModel({proprietaire : "marc.autran@datavalue.com", code : "5" , qte : 53 , prix : 9});

// maLigne.save(function (err) {
  // if (err) throw err;
  // console.log('ligne panier ajouté avec succès !'); 
// });

var monPanier; 
var lignes;

ligneModel.find({}, function (err, liste) 
{
	if (err)  console.log(err);
	lignes = liste;
});

var chargerPanier = function(proprio)
{
	monPanier = new Panier();
	var longueur = lignes.length;
	for(var i = 0; i < longueur ; i++)
	{
		if(lignes[i].proprietaire == proprio)
			monPanier.ajouterArticle(lignes[i].code, lignes[i].qte, lignes[i].prix);
	}
}
	
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
		chargerPanier(req.body.login);
		res.render('index.ejs', {client: client , liste : monPanier.liste , nbre : monPanier.liste.length}); 
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