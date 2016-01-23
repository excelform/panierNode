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

var monPanier; 
var lignes;	
var clients;

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

clientModel.find({}, function (err, liste) 
{
	if (err)  console.log(err);
	clients = liste;	
});

var checkLogin = function(login, mdp)
{
	for (var i = 0; i < clients.length; i++) 
	{
		if (clients[i].email == login && clients[i].password == mdp)
			return (clients[i]);
	}
}

app.get("/", function(req, res) 
{
	ligneModel.find({}, function (err, liste) 
	{
		if (err)  console.log(err);
		lignes = liste;
	});
	res.render('login.ejs', {}); 
})
.post('/connecter', function(req, res) 
{
    var client = checkLogin(req.body.login, req.body.mdp)
	if (client) 
	{
		chargerPanier(req.body.login);
		res.render('index.ejs', {
		client: client,
		liste : monPanier.liste,
		nbre : monPanier.liste.length, 
		total : monPanier.getPrixPanier()}); 
    }
    else res.redirect('/');
})
.post('/ajouter', function(req, res) {
	if (req.body.code != '' && req.body.qte != ''&& req.body.prix != '') 
	{ 
		var client = new Object();
		client.nom = req.body.nom; 
		client.prenom = req.body.prenom;
		client.email = req.body.email;
		monPanier.ajouterArticle(req.body.code, parseInt(req.body.qte), parseInt(req.body.prix));
		res.render('index.ejs', {
		client: client,
		liste : monPanier.liste,
		nbre : monPanier.liste.length, 
		total : monPanier.getPrixPanier()}); 
    }
    else res.redirect('/');
})
.post('/supprimer', function(req, res) {
	if (req.body.ident != '') 
	{ 
		var client = new Object();
		client.nom = req.body.nom; 
		client.prenom = req.body.prenom;
		client.email = req.body.email;
		monPanier.supprimerArticle(req.body.ident);
		res.render('index.ejs', {
		client: client,
		liste : monPanier.liste,
		nbre : monPanier.liste.length, 
		total : monPanier.getPrixPanier()}); 
    }
    else res.redirect('/');
})
.post('/sauvegarder', function(req, res) 
{
	ligneModel.remove({ proprietaire : req.body.proprietaire }, function (err) 
	{
		if (err) { throw err; }
		console.log("lignes détruites");
		var maLigne;
		var longueur = monPanier.liste.length;
		for (var i = 0; i < longueur; i++)
		{
			maLigne = new ligneModel({proprietaire : req.body.proprietaire, code : monPanier.liste[i].getCode() , qte : parseInt(monPanier.liste[i].getQte()) , prix : parseInt(monPanier.liste[i].getPrix())});
			maLigne.save(function (err) {
				if (err) throw err;
				console.log('ligne panier ajouté avec succès !');
			});
		}
		res.redirect('/');
	});
});

//mongoose.connection.close();
app.listen(5000);