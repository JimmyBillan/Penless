function Exercice (){

	var exercice = this;

	exercice.arrayQuestion = [];

	this.afficheExercicePourEleve = function (json) {
		///////////////////////////////////////////////////
		exercice.titre = json.nomDocument;
		exercice.date  = json.DateModification;

    	// CKE il vaudrait mieux gérer les col 9/10/12 au niveau supérieur

    	/// Titre de l'exercice ///
		//$('#corp').append('<div id="'+exercice.titre+'" class="col-sm-9 col-md-10 col-xs-12">'+ exercice.titre +'</div>');  
		$('#corp').append(
			'<div id="Exo" class="col-sm-9 col-md-10 col-xs-12">'+ 
			'<label>'+exercice.titre +'</label>'+
			//'<input type="submit" id="EnregistrerReponseEleve" class="btn btn-default" value="Enregistrer">'+
			'<input type="submit" id="Corriger" class="btn btn-default" value="Corriger">'+
			'</div>');  
		//+'<div id="row" class="droite15">');
		exercice.divExo = $('#Exo');
		
		$.each(json, function(key, val){ // On parcourt le document

			
			if(key.substring(0,4) == "#exo"){ // à la recherche des questions CKE : virer le # si possible
				// Test sur le type de la question : QCM, QS, ... 
				var q = new Question(exercice.divExo);
				exercice.arrayQuestion.push (q);
				var nextCBisOK = false;
				$.each(val, function(index, value) {
					/// Enonce / Question ///
					if (index.substring(0,8) == "titreExo"){						
						q.afficheEnoncePourEleve(index, value);
					}
					if(index.substring(0,7) == "CBinput"){
						q.afficheReponseQCMPourEleve(index, value, nextCBisOK);
						nextCBisOK = false;
					}
					if (index.substring(0,7) == "RSinput") {
						q.afficheReponsePourEleve(index, value);
					}
					if (index.substring(0,12) == "reponseJuste") {
						// indique que la prochaine CBinput est une réponse juste
						nextCBisOK = true;
					}

				});
			}
		});
	};

	this.checkAndSaveReponseEleve = function() {
		var jsonReponse = [];
		jsonReponse["isReady"] = true;
		//alert("exo checkAndSaveReponseEleve" + exercice.arrayQuestion.length);
		for (var i = 0; i< exercice.arrayQuestion.length; i++) {
			//alert("appel Q"+i+" checkAndSaveReponseEleve");
			exercice.arrayQuestion[i].checkAndSaveReponseEleve(jsonReponse);
		}
		/*alert("Exo ready " +jsonReponse["isReady"]);
		var s ="Exo JSON";
		for (var j in jsonReponse) {
			s +=" "+j+ " ->" + jsonReponse[j] + "/";	
		}
		alert(s);*/
		return jsonReponse["isReady"];

	};

	this.getDivExo = function() {
		return exercice.divExo;
	};

	this.afficheCorrection = function() {
	//////////////////////////////////////////	
		for (var i = 0; i< exercice.arrayQuestion.length; i++) {
			var reponseIsOK = exercice.arrayQuestion[i].afficheCorrection();
		}	
	};
}
