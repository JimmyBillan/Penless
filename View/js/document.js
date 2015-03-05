function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function dateJour(){
	var today = new Date();
	var sec = today.getSeconds();
	var min = today.getMinutes();
	var dd = today.getDate();
	var hh = today.getHours();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(sec<10){sec='0'+sec;}

	if(hh<10){hh='0'+hh;}

	if(min<10){min='0'+min;}

	if(dd<10){dd='0'+dd;} 

	if(mm<10){mm='0'+mm;} 

	return mm+'/'+dd+'/'+yyyy+" : "+hh+":"+min+"."+sec;
}
 
﻿function postDocument(){
	var jsonDoc={}
	// Titre
	jsonDoc["titreDocument"] = $('[name="titreDocument"]').val();
	// Partage
	jsonDoc["confident"]= $('input[name=optionsRadios]:checked', '#popPartager').val();
	// Catégories
	jsonDoc["categorie"] = CATEGORY.inputToArray();
	// Tags
	jsonDoc["tags"] = CATEGORY.tagsToArray();
	// Exercices
	jsonDoc["nbExo"] = 0;
	$("#blockQuestion").find('[name^="exo"]').each(function() {
		if (jsonDoc["titreDocument"])
		jsonDoc["nbExo"] ++;
		var idExo = "exo" +jsonDoc["nbExo"]; //ou $(this).attr("name"); si on ne veut pas renuméroter
		jsonDoc[idExo] = {};
		jsonDoc[idExo]["typeExo"] = $(this).attr("typeExo");
		var arrayExo = $(this).find(" input,select,textarea").serializeArray();
		jQuery.each(arrayExo, function() {
			jsonDoc[idExo][this.name] = this.value || '';
		});
	});
	if (jsonDoc["titreDocument"] !== '') {
		console.log(jsonDoc);
		$.ajax({
			type : 'POST',
			url : '../../Controller/processSaveDocument.php',
			data: {document : jsonDoc},
			success: function(reponse){
				//$("#LabelGeneral").html(" Sauvegardé..");
				//$("#LabelGeneral").show().delay(400).fadeOut();	
			}
		});
	}
}
$(document).ready(function(){
	///////////////////////////////////////////////////
	var idDocument = getParameterByName('D');
	var codePage   = getParameterByName('C');
	///////////////////////////////////////////////////
	
	var jsonDoc = {};		
	///////////////////////////////////////////////////

	if ((idDocument ==="")&&(codePage ==="Creation")){
		// Création d'un nouveau document
		///////////////////////////////////////
		$.ajax({
			type : 'POST',
			url  : 'Controller/getNewDocumentId.php',
			success: function(reponse){
				console.log(reponse);
				if(reponse == "DISCONNECTED"){
					$("#corp").html("<label>Vous devez vous connecter pour créer un document</label>")
				}else{
					idDocument = reponse;
					addFormDocHeader($('#corp'), "CREATE"); // CKE ne contient pas l'IdDoc?
					// Le document en cours d'écriture sera enregistré toutes les 4 secondes
					window.setInterval( function() {postDocument()}, 4000);
				}			
			}
		});
	}

	else if (idDocument !==""){
		if (codePage === "Affichage"){
			$.ajax({
				type : 'POST',
				data : {D: idDocument},
				url : 'Controller/getDocument.php',
				success: function(reponse){
					console.log(reponse);
					if(reponse == "itsprivate"){
						$("#corp").html("<label>Ce document est privé, vous n'avez pas l'autorisation de le lire</label>")
					}else{
						jsonDoc = $.parseJSON(reponse);
						afficheDoc($("#corp"), "READ", jsonDoc);
					}				
				}
			});
		}
		else if (codePage === "Modification"){
			$.ajax({
				type : 'POST',
				data : {D: idDocument},
				url : 'Controller/getDocumentModifie.php',
				success: function(reponse){
					console.log(reponse);
					if(reponse == "INVALID_DOCUMENT"){
						$("#corp").html("<label>Ce document n'existe pas.</label>");
					}else if (reponse == "UNAUTHORIZED_USER"){
						$("#corp").html("<label>Seul l'auteur du document peut le modifier.</label>");
					}else {
						jsonDoc = $.parseJSON(reponse);			
						afficheDoc($("#corp"), "UPDATE", jsonDoc);
						window.setInterval( function() {postDocument()}, 4000);
					}				
				}
			});
		}
	}
	
	////////////////////////////////////////////////////////////
	//        Création/Modification d'un document             //
	////////////////////////////////////////////////////////////
	
	//BOUTON "Creer titre Document"
	//---------------------------------------------------
	$("body").on('click', "[name='validerTitreDoc']", function(){

		console.log("*** validerTitreDoc ***");
		// Nom par défaut si non-renseigné
		var divTitreDoc = $('[name="titreDocument"]');
		console.log(divTitreDoc);
		if(divTitreDoc.val()===""){
			var a = dateJour();
			divTitreDoc.val("Document_"+a);
		}

		// Premier enregistrement
		postDocument();

		// Désactivation du Titre
		showLabel(divTitreDoc.parent(), 0);

		// Affichage du menu déroulant de choix des exercices
		$("#new_element").show(300);
		// Affichage du bouton "Partager"
		$("#partager").show(300);
		// Affichage du bouton "Partager"
		$("#categorie").show(300);
	});
	
	//MENU DEROULANT "Ajouter un élément"	
	//---------------------------------------------------
	$("body").on('change', '#new_element', function() {
		
	    // Ajoute le formulaire pour saisir la nouvelle question
	    var infoQ = {div     : $("#blockQuestion"),
	   		 		 typeExo : $(this).val(),
	   		 		 mode    : "CREATE"};
	   	
	    addFormQuestion(infoQ);

 		$(this).val("Ajouter un élément"); // CKE : il faudrait pouvoir retrouver la valeur1 du select sans la nommer
	    $("body").animate({ scrollTop: $(document).height() }, "slow");
	    $('#LabelGeneral').hide();  
	    return false;
	});
	
	//BOUTON "Ajouter Une Reponse"	
	//---------------------------------------------------
	$("body").on('click', '[name^="plusReponse"]', function(){

		var divExo = $(this).parent(); //$("#"+$(this).parent().attr('id')); CKE
		divExo.find("[name='labelErreur']").hide();
			
		// Incremente le compteur de réponse : CKE a supprimer si possible : index nextAvailableIdReponse
		// Insère le formulaire de saisie de la nouvelle réponse
		addFormReponse({
			div       : divExo,
            mode      : "CREATE"});

		divExo.animate({ scrollTop: $(document).height()}, "slow");	
	});

	//BOUTONS "Partager"
	//---------------------------------------------------
	$("body").on('click', "#partager", function(){
		showInput($("#popPartager"));
		$("#popPartager").show();
		$("#textNotifyPopPartager").html("");
	});

	$("body").on('click', '#annulerpopPartager', function(){
		$("#popPartager").hide();
	});

	$("body").on('click', '#validerpopPartager', function(){
		$("#textNotifyPopPartager").html("");	
		var docOK = checkDocument();
		$("#partager").val($('input[name=optionsRadios]:checked').val());			
		if (docOK) {
			postDocument();
			$("#textNotifyPopPartager").html('<b>Sauvegarde effectuée</b>');
			$("#popPartager").delay(1000).fadeOut();
		} else {
			$("#textNotifyPopPartager").append("<span style='color:red'><br><b>Il existe une erreur dans vos exercices</b></span>");
		}
	});
	
	//BOUTONS Modifier
	//---------------------------------------------------
	$("body").on('click', '[name^="modifier"]', function(){	
		showInput($(this).parent(), 300);		
	});

	//BOUTONS Valider
	//---------------------------------------------------
	$("body").on('click', '[name="valider"]', function(){

		var exoOK = checkExo($(this).parent());
		if (exoOK) {
			showLabel($(this).parent());
		}
	});

	//BOUTONS Supprimer	
	//---------------------------------------------------
	$("body").on('click', '[name^="supprimer"]', function(){		
		$(this).parent().remove();		
	});

	/////////////////////////////////////////////////////
	//       Suppression d'un document                 //
	/////////////////////////////////////////////////////
	$("body").on('click', '#iconsupprimerDoc', function(){
		
		var idDoc = $(this).attr("value");
		$.ajax({
			type : 'POST',
			url : '../../Controller/processDeleteDocument.php',
			data: {idDocument : idDoc},//$(this).attr("value")},
			success: function(reponse){
				if ( reponse = "delete_succes"){
					$("#"+idDoc).hide();
				}				
			}
		});
	});

	/////////////////////////////////////////////////////
	//BOUTON Enregistrer réponse élève CKE TODO
	/////////////////////////////////////////////////////
	/*$("body").on('click', '#EnregistrerReponseEleve', function(){
		//CKE Possibilité incohérence id
		var isReady = exo.checkAndSaveReponseEleve(); // faire juste le check
		
		if (isReady){
			var dataReponse = exo.getDivExo().serialize();
			$.ajax({
				type : 'POST',
				data : {document : dataReponse},
				url  : 'Controller/processSaveReponseEleve.php',
				success:function(reponse){
					alert(reponse);
					//exo.afficheCorrection();
				}
			});
		}		
		
	});*/

	/////////////////////////////////////////////////////
	//BOUTON Corriger

	$("body").on('click', '#Corriger', function(){
		//CKE Possibilité incohérence id		
		afficheCorrectionDoc(jsonDoc);		
	});

	/////////////////////////////////////////////////////
	$("body").on('click', '#goToTargetDocument', function(){
		console.log($(this).attr("target"));
		window.location ="/?&D="+$(this).attr("target");	
	});

});