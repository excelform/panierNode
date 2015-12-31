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
  if (err) { throw err; }
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
  if (err) { throw err; }
  console.log('client ajouté avec succès !');
  
});

var clients;

clientModel.find({nom: 'autran'}, function (err, comms) {
  if (err) 
  { 
	console.log(err);
  }
clients = comms;
  var comm;
  for (var i = 0; i < comms.length; i++) {
    comm = comms[i];
    console.log('------------------------------');
    console.log('Nom : ' + comm.nom);
    console.log('Prenom : ' + comm.prenom);
    console.log('------------------------------');
	mongoose.connection.close();
  }
});


app.get("/", function(req, res) {
			res.render('index.ejs', {liste: clients, nbre: clients.length}); 
	});

app.listen(5000);