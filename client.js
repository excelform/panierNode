'use strict';
module.exports = class Client 
{ 
    constructor(firstName, lastName, mail, mdp)
	{ 
        this.prenom = firstName; 
        this.nom = lastName;
		this.email = mail;
		this.password = mdp;		
    } 

    decrire()
	{ 
        console.log("nom : " + this.nom + " et prenom : " + this.prenom); 
    } 
}