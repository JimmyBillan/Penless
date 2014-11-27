function postDocument(arrayNewDocument){
	$.ajax({
		type : 'POST',
		url : '../../Controller/processSaveDocument.php',
		data: {document : arrayNewDocument},
		success: function(reponse){
			//$("#LabelGeneral").html(reponse);
			//$("#LabelGeneral").show()
			//$("#LabelGeneral").html("Sauvegardé..");
			//$("#LabelGeneral").show().delay(400).fadeOut();	
		}

	});
}



function AnalyseQuestion(question){
	alert(question);
}

function dateJour(){
	var today = new Date();
	var sec = today.getSeconds();
	var min = today.getMinutes();
	var dd = today.getDate();
	var hh = today.getHours();
	var mm = today.getMonth()+1; //January is 0!
	var yyyy = today.getFullYear();

	if(sec<10){
		sec='0'+sec;
	}

	if(hh<10){
		hh='0'+hh;
	}

	if(min<10){
		min='0'+min;
	}

	if(dd<10){
	    dd='0'+dd;
	} 

	if(mm<10){
	    mm='0'+mm;
	} 

return mm+'/'+dd+'/'+yyyy+" : "+hh+":"+min+"."+sec;
}

function SH(id){
	$("#"+id).show(300);
}
function HI(id){
	$("#"+id).hide(300);
}

function inputToLabel(button, label, input){
	$("#"+label).html($("#"+input).val());
	SH(label);
	HI(input);
	HI(button);	
}

function labelToInput(button, label, input){
	HI(label);
	SH(input);
	SH(button);
}

function generateEnonce(compteur, type){
	text ='<div id="exo'+compteur+'" compRep="0" isok="0" class="droite15 greybox col-xs-12" style="display : block">'+
            '<input id="inputtitreExo" name="titreExo'+compteur+'" type="text" placeholder="Saisir la question ici" class="form-controlEnonce col-xs-11" >'+
            '<span id="SupprimerQuestion" comp='+compteur+' class="glyphiconSupprimerQuestion glyphicon-remove" aria-hidden="true" type="submit" title="Supprimer l\'exercice"></span>'+
            '<input id="plus'+type+'" class="btn btn-default"  type="submit"  compRep="0" value="Ajouter une reponse">'+
             
            '<label id="labelErreur">'+'</label>'+
           '</div>';
     return text;
}

function addCheckBox(compRep){
	text = 
	'<div rep="'+compRep+'" type="CB" class="checkbox reponseCheckbox">'+
	
    	'<input id="CB'+compRep+'" class="cbQCM" type="checkbox" name="reponseJuste'+compRep+'"  value='+compRep+' >'+
   		'<input id="CBinput'+compRep+'" type ="text" name="CBinput'+compRep+'" class="form-controlReponse" placeholder="Intitulé de la reponse">'+
   		'<span    compRep="'+compRep+'" id="supprimerReponse" class="glyphiconSupprimerReponse glyphicon-remove" aria-hidden="true"></span>'+
 	'</div>';
 	return text;
}

function addReponseSimple(compRep){
	text = 
	'<div rep="'+compRep+'" type="RS" class="checkbox reponseCheckbox">'+
   		'<input id="RSinput'+compRep+'" type ="text" name="RSinput'+compRep+'" class="form-controlReponse" placeholder="Intitulé de la reponse">'+
   		'<span  compRep="'+compRep+'" id="supprimerReponse" class="glyphiconSupprimerReponse glyphicon-remove" aria-hidden="true"></span>'+
 	'</div>';
 	return text;
}



/*function rendreVisible(element){
	idCourrant = "#"+$(element).closest('div[id]').attr("id");
	$(idCourrant).find("input").show(300);
	$(idCourrant).find("label").hide();

}*/

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function preparationPost(divQuestionCourant,arrayNewDocument){

	var array = $(divQuestionCourant).find(" input,select,textarea").serializeArray();
	var json = {};

	jQuery.each(array, function() {
		json[this.name] = this.value || '';
	});
	
	arrayNewDocument[divQuestionCourant] = json;

	postDocument(arrayNewDocument);

}


$(document).ready(function(){

window.setInterval(function(){
  //Sauvegarde auto toute les 10 secondes
  arrayNewDocument["nbQuestion"] = questions.nombreExo;

   for (var i = 1; i <= questions.nombreExo; i++) {
   			divQuestionCourant = "#exo" +i;
  			preparationPost(divQuestionCourant,arrayNewDocument);
  		};

}, 10000);


/////////////////////////////////////////////////////
//Modification d'un document
	var Document = getParameterByName('D');
	

	if(Document !=""){
		$.ajax({
			type : 'POST',
			data : {D: Document},
			url : '../../Controller/getDocumentModifie.php',
			success: function(reponse){
				//var result = $.parseJSON(reponse);			
				alert(reponse);
			}

		});
	}
	
/////////////////////////////////////////////////////
//Declaration des variables globales
	
	var compteur= 0; //Nombre d'exercice

	//Object qui represente les questions, (donne un nouveau numero à chaque question)
	var questions = {	nombreExo : 0,
						incrementNombreExo: function(c){
						this.nombreExo++;
						$("#enregistrer").show(300);
						},
						decrementeNombreExo: function(c){
							this.nombreExo--;
						}
	}

	//Represente L'ensemble des donner à poster
	var arrayNewDocument = {};
	
/////////////////////////////////////////////////////
//BOUTON Enregistrer Document

	$("#enregistrer").click(function(){
		$('#LabelGeneral').hide();
		nbExoDisplay = 0;
		
		for(i = 0; i < questions.nombreExo; i++){
			parcourQuestion = $("#exo" +i);
			if(parcourQuestion.css('display') != 'none'){
				
				AnalyseQuestion(parcourQuestion);
				if(parcourQuestion.attr('isok') != 0){
					alert(parcourQuestion.attr("id")+ " possede "+ (parcourQuestion.attr('comprep') +1)+"reponses" );
					
				}else{
					$('#LabelGeneral').html("Exercice(s) non validé(s)");
					$('#LabelGeneral').show(500);
				}

				nbExoDisplay++;
			}
		}
		if(nbExoDisplay == 0 ){
			$(this).hide(300);
			$('#LabelGeneral').html("Il n'y a aucun exercice à  enregistrer");
			$('#LabelGeneral').show(500);
		}else{

		}
	});


/////////////////////////////////////////////////////
//BOUTON Creer titre Document

	$("#validerTitreDoc").click(function(){

		if($('#titreDoc').val()==""){
			var a = dateJour();
			$('#titreDoc').val("Document_sans_nom "+a);
			arrayNewDocument["nomDocument"] = $('#titreDoc').val();
		}else{
			arrayNewDocument["nomDocument"] = $('#titreDoc').val();
		}
		inputToLabel("validerTitreDoc", "labeltitreDoc", "titreDoc");
		postDocument(arrayNewDocument); // (Sauvegarde ici )
		//SH("ajouterElement");//(Supprimé le 25novembre 19h57)
		SH("new_element");	//Menu deroulant rennomé new_element le 25 novembre19h59
	});
	


/////////////////////////////////////////////////////
//BOUTON Modifier Titre Document

	$('#labeltitreDoc').click(function(){
		labelToInput("validerTitreDoc","labeltitreDoc","titreDoc");
	});



/////////////////////////////////////////////////////
//Menu Deroulant Action

	$('#new_element').change(function() {
	    if ($(this).val() === 'qcm') {
	    	questions.incrementNombreExo();
	    	qcm = generateEnonce(questions.nombreExo, "Qcm");
	    	
	        $("#creationDocument").append(qcm);
	       // $("#creationDocument").attr("compQuestion")
	    }else if ($(this).val() === 'questionSimple') {
	    	questions.incrementNombreExo();
            questionSimple = generateEnonce(questions.nombreExo, "QuestionSimple");
          	
	        $("#creationDocument").append(questionSimple);
	      //  $("#creationDocument").attr("compQuestion")
	    }
 		$(this).val("Choisir un type d'element");
	    $("body").animate({ scrollTop: $(document).height() }, "slow");
	    $('#LabelGeneral').hide();  
	    return false;
	});



/////////////////////////////////////////////////////
//BOUTON Valider Un Exercice


	$("body").on('click', '#enregistrerExo', function(){
		
		oktogo = 0;
		comp = $(this).attr("comp"); //compteur du nombre de question
		divCourrant = "#exo"+comp; 
		$(divCourrant).find("#labelErreur").hide();
		labelTitre = "labeltitreExo"+comp;
		inputTitre = "inputtitreExo"+comp;
	
		
		cRep = parseInt($(divCourrant).attr("comprep"));
		checkedfalse = 0;
		var champVide = -1; 
		
			for(i = 0; i< cRep+1; i++){

				if($(divCourrant).find("#CBinput"+i).val() ==""){
					champVide = i;
				}
				if($(divCourrant).find("#CB"+i).is(':checked') == true){
					checkedfalse = 1;
				}

				if(champVide +1 > 0){
					$(divCourrant).find("#labelErreur").html("La question : "+ (champVide + 1)+" est vide");
					$(divCourrant).find("#labelErreur").show();
				}
			}

		if(checkedfalse == 0){
				$(divCourrant).find("#labelErreur").html("Aucune bonne reponse n'est cochée");
				$(divCourrant).find("#labelErreur").show();
		}

		if(checkedfalse == 1 && champVide == -1){
			$(divCourrant).attr("isok","1");
			var array = $(divCourrant).find(" input,select,textarea").serializeArray();

			var json = {};
			
			jQuery.each(array, function() {
				json[this.name] = this.value || '';
			});
			
			arrayNewDocument[divCourrant] = json;

			postDocument(arrayNewDocument);
			$(divCourrant).find("#labelErreur").html("Sauvegardé..");
			$(divCourrant).find("#labelErreur").show().delay(1500).fadeOut();		

		}else{
			$(divCourrant).attr("isok","0");
		}


	});


/////////////////////////////////////////////////////
//BOUTON Supprimer Une question

	$("body").on('click', "#SupprimerQuestion", function(){
		//comp 		= $(this).attr("comp");
		id = $(this).parent().attr("id");
		nbQuestion = questions.nombreExo;

		//Aterlier collage decoupage
		questionCourante = "#"+id;
		numQ = parseInt(jQuery.trim(id).substring(3));
		console.log(arrayNewDocument);
		delete arrayNewDocument[questionCourante];
		console.log(arrayNewDocument);

		var lastI;
		for (var i = numQ + 1; i <= nbQuestion; i++) {
			newValeur = i-1;
			idQuestion = "#exo"+i;
			question = $("#creationDocument").find(idQuestion);
			input = question.find("#inputtitreExo");
			input.attr("name", "titreExo"+newValeur);

			span = question.find("#SupprimerQuestion");
			span.attr("comp", newValeur);
//
			question.attr("id", "exo"+newValeur);
			lastI = i;
		}

		questions.decrementeNombreExo();
		delete arrayNewDocument["#exo"+lastI];
		

		$(questionCourante).hide(2000);
		$(this).parent().remove();

		
	});


/////////////////////////////////////////////////////
//BOUTON Supprimer Une Reponse
	$("body").on('click', "#supprimerReponse", function(){
		
		questionCourante = "#"+$(this).parent().parent().attr("id");
		reponseCourante  = parseInt($(this).attr('comprep'));
		nbRepQuestion    = $(this).parent().parent().attr("comprep");

		for (var i = reponseCourante +1; i <= nbRepQuestion; i++) {
			divRep = $(questionCourante).find("[rep='"+i+"']");
			newValeur = divRep.attr("rep") - 1;
			divRep.attr("rep", newValeur);

			if(divRep.attr("type") == "CB"){
				CB = divRep.find("#CB"+i);
				CB.attr("id", "CB"+newValeur);
				CB.attr("name", "reponseJuste"+newValeur);
				CB.attr("value", newValeur);

				CBinput = divRep.find("#CBinput"+i);
				CBinput.attr("id", "CBinput"+newValeur);
				CBinput.attr("name", "CBinput"+newValeur);
				
				icon = divRep.find("#supprimerReponse");
				icon.attr("comprep", newValeur);
			}else
			if(divRep.attr("type") == "RS"){
				RSinput = divRep.find("#RSinput"+i);
				RSinput.attr("id", "RSinput"+newValeur);
				RSinput.attr("name", "RSinput"+newValeur);

				icon = divRep.find("#supprimerReponse");
				icon.attr("comprep", newValeur);
			}
			
		};
		
		$(this).parent().parent().attr("comprep",nbRepQuestion-1)
		$(this).parent().remove();
	
	});


/////////////////////////////////////////////////////
//BOUTON Ajouter Une Reponse

	$("body").on('click', '#plusQcm', function(){
		compQuestion 		= $(this).attr("comp");
		divQuestionCourant = "#"+$(this).parent().attr('id');
		$(divQuestionCourant).find("#labelErreur").hide();

			
		var compRep =  $(this).parent().attr('comprep');
		compRep++;
		$(divQuestionCourant).append(addCheckBox(compRep));
		$(divQuestionCourant).attr('comprep', compRep);
		
		$(this).attr('comprep', compRep);
		$(divQuestionCourant).attr("isok","0");
		$(divQuestionCourant).animate({ scrollTop: $(document).height()}, "slow");
			
	if($("#inputtitreExo"+compQuestion).val() == ""){
		$(divQuestionCourant).find("#labelErreur").html("<span style='left : 5px;' class='glyphicon glyphicon-warning-sign' ria-hidden='true'>Question vide !</span> ");
		$(divQuestionCourant).find("#labelErreur").show(300);

	}

	//Procedure Post
	

		
	});

	$("body").on('click', '#plusQuestionSimple', function(){
		compQuestion 		= $(this).attr("comp");
		divQuestionCourant = "#"+$(this).parent().attr('id');
		$(divQuestionCourant).find("#labelErreur").hide();

			
			var compRep =  $(this).parent().attr('comprep');
			compRep++;

			$(divQuestionCourant).append(addReponseSimple(compRep));
			$(divQuestionCourant).attr('comprep', compRep);

			
			$(this).attr('comprep', compRep);
			$(divQuestionCourant).attr("isok","0");
			$(divQuestionCourant).animate({ scrollTop: $(document).height()}, "slow");
			
	if($("#inputtitreExo"+compQuestion).val() == ""){
		$(divQuestionCourant).find("#labelErreur").html("<span style='left : 5px;' class='glyphicon glyphicon-warning-sign' ria-hidden='true'>Question vide !</span> ");
		$(divQuestionCourant).find("#labelErreur").show(300);

	}
	
		
	});



/////////////////////////////////////////////////////
//BOUTON Afficher Menu Deroulant (Supprimé 25 novembre 19h56)

	$('#ajouterElement').click(function(){
		SH("new_part");
	});




});
