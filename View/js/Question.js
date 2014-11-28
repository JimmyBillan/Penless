function Question(divExo) {
	
	var question = this;

	question.divExo = divExo;
	question.arrayReponse = [];

	/* Formulaire pour la création de l'exercice
	this.afficheFormEnoncePourAuteur(compteur) = function (compteur){
	///////////////////////////////////////////////////////////
		cf pageNewDocument + mettre en commun avec l'affichage pour Eleve
		--> input pour Auteur / label pour Eleve
	};

	this.afficheFormReponsePourAuteur(compteur) = function (compteur) {
	///////////////////////////////////////////////////////////
		cf pageNewDocument
	};

	this.addReponseAuteur(compteur) = function (compteur) {
	///////////////////////////////////////////////////////////
		cf PageNewDocument
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
	
	this.afficheReponsePourEleve = function(idReponse, reponse) {
	///////////////////////////////////////////////////////////
		//if (question.divQuestion != "undefined" && !question.QSinputInForm) {
		question.typeQuestion = "QS";
		if (!question.QSinputInForm) {
			question.divQuestion.append (
				'<div><input id="R'+question.idQuestion+'" type="text">'+
				'<span id="Validation"></span>'+
				'<label id="Correction"></label>'+
				'</div>');
			question.QSinputInForm = true; 
		}
		question.arrayReponse.push(reponse);
	};

	this.afficheReponseQCMPourEleve = function(idReponse, reponse, reponseOK) {
	///////////////////////////////////////////////////////////
		//if (question.divQuestion != "undefined" && !question.QSinputInForm) {
		question.typeQuestion = "QCM";
		question.divQuestion.append (
			'<div class="checkbox col-xs-12"><input id="'+idReponse+'" type="checkbox">'+
			'<label>'+reponse+'</label>'+
			'<span id="Validation'+idReponse+'"></span>'+
			'</div>');
		
		question.arrayReponse.push({id   : idReponse, 
									isOK : reponseOK});
	};

	this.checkAndSaveReponseEleve = function(jsonReponse) {
	///////////////////////////////////////////////////////	
		//alert(question.divQuestion.html());
		if (question.typeQuestion == "QS") {
			var valReponse = question.divQuestion.find("input");
			if ((valReponse.length == 0)||(valReponse[0].value == "")) {
				jsonReponse["isReady"] = false; 
				alert("Il manque une réponse");
			}
			/*else {
				//jsonReponse[question.idQuestion] = valReponse[0].value;
				// --> remplacé par un appel à serialize au niveau de l'exercice
				//alert("QS avec R" + question.idQuestion + " => " + valReponse[0].value);
			}*/
			
		}
		if (question.typeQuestion == "QCM") {
			var ReponseChecked = question.divQuestion.find(":checked");
			//alert("QCM avec " + ReponseChecked.length + " reponses");
			//var s="";
			if (ReponseChecked.length == 0) {
				jsonReponse["isReady"] = false; 
				alert("Il manque une réponse");
			}
			/*else {				
				// --> remplacé par un appel à serialize au niveau de l'exercice
				jsonReponse[question.idQuestion] = [];
				for (var i = 0; i< ReponseChecked.length; i++) {
					jsonReponse[question.idQuestion].push(ReponseChecked[i].id);
					s += question.idQuestion + " => " + ReponseChecked[i].id +" /";
				}
				//alert (s);
			}*/
		}
	};

	this.afficheCorrection = function() {
	/////////////////////////////////////
		var removeIcon = function(elem) {
			elem.removeClass("glyphiconVert glyphiconRouge glyphicon-ok glyphicon-remove glyphicon-unchecked");}

		var setIconOK = function(elem) {elem.addClass("glyphiconVert glyphicon-ok");}
		var setIconKO = function(elem) {elem.addClass("glyphiconRouge glyphicon-remove");}
		var setIconCBOK = function(elem, c) {
			if (c) {elem.addClass("glyphiconVert glyphicon-ok");}
			else {elem.addClass("glyphiconVert glyphicon-unchecked");}}
		var setIconCBKO = function(elem, c) {
			if (c) {elem.addClass("glyphiconRouge glyphicon-ok");}
			else {elem.addClass("glyphiconRouge glyphicon-unchecked");}}

		var reponseIsOK;

		if (question.typeQuestion == "QS") {

			var reponseEleve = question.divQuestion.find("input");
			var correction   = question.divQuestion.find("#Correction");
			var validation   = question.divQuestion.find("#Validation");
			reponseIsOK = false;

			if ((reponseEleve.length == 0)||(reponseEleve[0].value == "")) {
				correction.html("Réponse attendue!"); 
			}
			else {
				removeIcon(validation);
				// Il peut y avoir plusieurs réponses valides, donc on parcourt ce set de réponses
				for (var i = 0; i< question.arrayReponse.length; i++) {
					if (reponseEleve[0].value == question.arrayReponse[i]){
						setIconOK(validation);
						correction.html("Réponse exacte");
						reponseIsOK = true;
					}
				}
				if (!reponseIsOK) {
					setIconKO(validation);
					correction.html("La bonne réponse est : <em>"+question.arrayReponse[0]+"</em>");
				}
			}
		}
		if (question.typeQuestion == "QCM") {
		
			reponseIsOK = true;

			for (var i=0; i< question.arrayReponse.length; i++) {

				var reponseEleve = question.divQuestion.find("#"+question.arrayReponse[i].id)[0];
				var validation   = question.divQuestion.find("#Validation"+question.arrayReponse[i].id);

				removeIcon(validation);

				if (question.arrayReponse[i].isOK == (reponseEleve.checked)) {
					// Bonne réponse
					setIconCBOK(validation, question.arrayReponse[i].isOK);
					/*if (question.arrayReponse[i].isOK) {
						// On ne met l'icone OK que si la réponse est juste et a étéait cochée par l'élève
						// On ne met pas d'icone si la réponse est mauvaise et que l'élève ne l'a pas cochée
						setIconOK(validation);
					}*/
				}
				else{
					setIconCBKO(validation, question.arrayReponse[i].isOK);
					reponseIsOK = false
				}
			}
		}
		//return reponseIsOK; // Pour future notation 
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