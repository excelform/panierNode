'use strict';
class LignePanier 
{ 
    constructor(code, qte, prix)
	{ 
		this.codeArticle = code;
		this.qteArticle = qte;
		this.prixArticle = prix;
    } 

	ajouterQte(qte)
	{
		this.qteArticle += qte;
	}
	getPrixLigne()
	{
		var resultat = this.prixArticle * this.qteArticle;
		return resultat;
	}
	getCode() 
	{
		return this.codeArticle;
	}
}
module.exports = class Panier 
{ 
    constructor()
	{ 
		this.liste = [];
    } 

	ajouterArticle(code, qte, prix)
	{ 
		var index = this.getArticle(code);
		if (index == -1) this.liste.push(new LignePanier(code, qte, prix));
		else this.liste[index].ajouterQte(qte);
	}
	getPrixPanier()
	{
		var total = 0;
		for(var i = 0 ; i < this.liste.length ; i++)
			total += this.liste[i].getPrixLigne();
		return total;
	}
	getArticle(code)
	{
		for(var i = 0 ; i <this.liste.length ; i++)
			if (code == this.liste[i].getCode()) return i;
		return -1;
	}
	supprimerArticle(code)
	{
		var index = this.getArticle(code);
		if (index > -1) this.liste.splice(index, 1);
	}
}
