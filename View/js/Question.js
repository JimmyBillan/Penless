function Question(divExo) {
	
	var question = this;

	question.divExo = divExo;
	
	/* Formulaire pour la création de l'exercice
	this.afficheFormEnoncePourAuteur(compteur) = function (compteur){
	///////////////////////////////////////////////////////////
		question.divExo.append(
			'<div id="exo'+compteur+'" isok="0" class="droite15 greybox col-xs-12" style="display : block">'+
        	'<form class="form-inline" role="form">'+
        	'<div class="form-group col-xs-12">'+
        	'<label id="labeltitreExo'+compteur+'" title="modifier ?" class="alignGauche"  style="display : none"></label>'+
        	'<input id="inputtitreExo'+compteur+'" name="titreExo'+compteur+'" type="text" placeholder="Saisir la question ici" class="form-control" style="width : 80%">'+
        	'<input id="supprimerExo" comp='+compteur+' class="btn btn-default" type="submit" value="X" title="Supprimer l\'éxercice">'+
        	'</div>'+
        	'</form>'+
        	'</div>');
	};

	this.afficheFormReponsePourAuteur(compteur) = function (compteur) {
	///////////////////////////////////////////////////////////
		question.divExo.append(
			'<div id="ReponseSimple'+compteur+'" class="col-xs-12">'+   
        	'</div>'+
        	'<div class="col-xs-12">'+
        	'<input id="plusReponseSimple" comp='+compteur+' class="btn btn-default"  type="submit"  compRep="0" value="Ajouter une réponse">'+
        	'<input id="enregistrerReponseSimple" comp='+compteur+' type="submit"  style="display : none" class="btn btn-default" value="Enregistrer">'+
        	'<label id="erreurReponseSimple">'+'</label>'+
        	'</div>');
		question.nbReponse = 0;
	};

	this.addReponseAuteur(compteur) = function (compteur) {
	///////////////////////////////////////////////////////////
		question.divExo.append(
			'<form class="form-inline" role="form" name="reponseSimple'+compRep+'">'+
        	'<div class="form-group col-xs-12">'+
        	'<input id="inputReponseSimple'+compRep+'" type="text"  style="width : 80%" class="form-control" placeholder="Réponse juste">'+
        	'<input id="supprimerReponseSimple'+compRep+'" class="btn btn-default suppr" type="submit" value="X" title="Supprimer la réponse">'+
        	'</div>'+
        	'</form>');
		question.nbReponse ++;
	};
	*/

	// Formulaire pour l'éxécution de l'exercice par un élève.
	this.afficheEnoncePourEleve = function (idQuestion, enonce) {
	///////////////////////////////////////////////////////////
		question.idQuestion = idQuestion;
		question.divExo.append(
			'<div id="Q'+question.idQuestion+'" class="droite15 greybox col-xs-12" style="display : block">'+
			'<label>'+enonce+'</label>'+
			'</div>');
		question.divQuestion = $('#Q'+question.idQuestion);
		question.QSinputInForm = false;
	};
	
	this.afficheReponsePourEleve = function() {
	///////////////////////////////////////////////////////////
		//if (question.divQuestion != "undefined" && !question.QSinputInForm) {
		question.typeQuestion = "QS";
		if (!question.QSinputInForm) {
			question.divQuestion.append ('<div><input id="R'+question.idQuestion+'" type="text"></div>');
			question.QSinputInForm = true; 
		}
	};

	this.afficheReponseQCMPourEleve = function(idReponse, reponse) {
	///////////////////////////////////////////////////////////
		//if (question.divQuestion != "undefined" && !question.QSinputInForm) {
		question.typeQuestion = "QCM";
		question.divQuestion.append (
			'<div class="checkbox col-xs-12"><input id="'+question.idQuestion+idReponse+'"type="checkbox"><label>'+reponse+'</label></div>');
	};

	// Formulaire de Correction
	this.checkAndSaveReponseEleve = function(jsonReponse) {
		
		//alert(question.divQuestion.html());
		if (question.typeQuestion == "QS") {
			var valReponse = question.divQuestion.find("input");
			if ((valReponse.length == 0)||(valReponse[0].value == "")) {
				jsonReponse["isReady"] = false; 
				alert("Il manque une réponse");
			}
			else {
				jsonReponse[question.idQuestion] = valReponse[0].value;
				//alert("QS avec R" + question.idQuestion + " => " + valReponse[0].value);
			}
			
		}
		if (question.typeQuestion == "QCM") {
			var ReponseChecked = question.divQuestion.find(":checked");
			//alert("QCM avec " + ReponseChecked.length + " reponses");
			var s="";
			if (ReponseChecked.length == 0) {
				jsonReponse["isReady"] = false; 
				alert("Il manque une réponse");}
			else {
				jsonReponse[question.idQuestion] = [];
				for (var i = 0; i< ReponseChecked.length; i++) {
					jsonReponse[question.idQuestion].push(ReponseChecked[i].id);
					s += question.idQuestion + " => " + ReponseChecked[i].id +" /";
				}
				//alert (s);
			}
		}
	};

}

/*function QuestionQCM(divExo) {
	this.afficheReponsePourEleve = function(idReponse, reponse) {
	///////////////////////////////////////////////////////////
		//if (question.divQuestion != "undefined" && !question.QSinputInForm) {
		question.divQuestion.append (
			'<div class="checkbox col-xs-12"><input id="'+idReponse+'"type="checkbox"><label>'+reponse+'</label></div>');
	};
}
QuestionQCM.prototype = Question.prototype;
QuestionQCM.prototype.constructor = QuestionQCM;*/