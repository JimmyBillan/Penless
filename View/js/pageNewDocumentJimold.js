function postDocument(newDocument){
	$.ajax({
		type : 'POST',
		url : '../../Controller/processSaveDocument.php',
		data: {document : newDocument},
		success: function(reponse){
			alert(reponse);
		}

	});
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

function generateQCM(compteur){
	text ='<div id="exo'+compteur+'" compRep="-1" isok="0" class="droite15 greybox col-xs-12" style="display : block">'+
			'<label id="labeltitreExo'+compteur+'" title="modifier ?" class="alignGauche"  style="display : none"></label>'+
            '<input id="inputtitreExo'+compteur+'" name="titreExo'+compteur+'" type="text" placeholder="Saisir la question ici" class="form-control" >'+
            '<input id="enregistrerExo" comp='+compteur+' type="submit"  style="display : none" class="btn btn-default" value="Enregistrer">'+
            '<input id="plusCB" comp='+compteur+' class="btn btn-default"  type="submit"  compRep="0" value="Ajouter une reponse">'+
            '<input id="supprimerExo" comp='+compteur+' class="btn btn-default" style="float:right"  type="submit" value="X" title="Supprimer l\'exercice">'+
            '<label id="erreurCb">'+'</label>'+
           '</div>';
     return text;
}

function addCheckBox(compteur, compRep){
	text = 
	'<div class="checkbox col-xs-12">'+
	'<div class="col-xs-12">'+
    	'<input id="CB'+compRep+'" type="checkbox" name="reponseJuste'+compRep+'"  value='+compRep+' >'+
   		'<input id="CBinput'+compRep+'" type ="text" name="CBinput'+compRep+'" style="width : 100%" class="form-control" placeholder="Intitulé de la reponse">'+
 		'<input id="supprimerCB'+compRep+'" class="btn btn-default suppr" type="submit" value="X" title="Supprimer la rÃ©ponse">'+
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

$(document).ready(function(){

	/////////////////////////////////////////////////////
	////////////////////Modification d'un document///////
	/////////////////////////////////////////////////////
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
	////////////////////Modification d'un document///////
	/////////////////////////////////////////////////////


	var compteur= 0; //Nombre d'exercice

	var exercices = {

		nombreExo : 0,
		incrementNombreExo: function(c){
			this.nombreExo++;
			$("#enregistrer").show(300);
		}
	}

	var newDocument = {};
	


	/////////////////////////////////////////////////////
	///////////////////BOUTON Creer titre Document///////
	/////////////////////////////////////////////////////

	$("#validerTitreDoc").click(function(){

		if($('#titreDoc').val()==""){
			var a = dateJour();
			$('#titreDoc').val("Document_sans_nom "+a);
			newDocument["nomDocument"] = $('#titreDoc').val();
		}else{
			newDocument["nomDocument"] = $('#titreDoc').val();
		}
		inputToLabel("validerTitreDoc", "labeltitreDoc", "titreDoc");
		SH("ajouterElement");		
	});
	



	/////////////////////////////////////////////////////
	///////////////////BOUTON Enregistrer Document///////
	/////////////////////////////////////////////////////
	$("#enregistrer").click(function(){
		$('#labelEnregistrer').hide();
		nbExoDisplay = 0;
		
		for(i = 0; i < exercices.nombreExo; i++){
			parcourExo = $("#exo" +i);
			if(parcourExo.css('display') != 'none'){
				if(parcourExo.attr('isok') != 0){
					alert(parcourExo.attr("id")+ " possede "+ (parcourExo.attr('comprep') +1)+"reponses" );
					
				}else{
					$('#labelEnregistrer').html("Exercice(s) non validé(s)");
					$('#labelEnregistrer').show(500);
				}

				nbExoDisplay++;
			}
		}
		if(nbExoDisplay == 0 ){
			$(this).hide(300);
			$('#labelEnregistrer').html("Il n'y a aucun exercice à  enregistrer");
			$('#labelEnregistrer').show(500);
		}else{

		}
	});




	/////////////////////////////////////////////////////
	////////////////BOUTON Modifier Titre Document///////
	/////////////////////////////////////////////////////

	$('#labeltitreDoc').click(function(){
		labelToInput("validerTitreDoc","labeltitreDoc","titreDoc");
	});



	/////////////////////////////////////////////////////
	/////////////////////////Menu Deroulant Action///////
	/////////////////////////////////////////////////////

	$('#new_part').change(function() {
	    if ($(this).val() === 'qcm') {
	    	qcm = generateQCM(exercices.nombreExo);
	    	exercices.incrementNombreExo();
	        $("#creationDocument").append(qcm);
	        $(this).val("");
	        $(this).hide(300);
	     $("body").animate({ scrollTop: $(document).height() }, "slow");
	     $('#labelEnregistrer').hide();  
	    }
 
	    
	    return false;
	});



	/////////////////////////////////////////////////////
	////////////////////BOUTON Valider Un Exercice///////
	/////////////////////////////////////////////////////

	$("body").on('click', '#enregistrerExo', function(){
		
		oktogo = 0;
		comp = $(this).attr("comp"); //compteur du nombre de question
		divCourrant = "#exo"+comp; 
		$(divCourrant).find("#erreurCb").hide();
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
					$(divCourrant).find("#erreurCb").html("La question : "+ (champVide + 1)+" est vide");
					$(divCourrant).find("#erreurCb").show();
				}
			}

		if(checkedfalse == 0){
				$(divCourrant).find("#erreurCb").html("Aucune bonne reponse n'est cochée");
				$(divCourrant).find("#erreurCb").show();
		}

		if(checkedfalse == 1 && champVide == -1){
			$(divCourrant).attr("isok","1");
			var array = $(divCourrant).find(" input,select,textarea").serializeArray();

			var json = {};
			
			jQuery.each(array, function() {
				json[this.name] = this.value || '';
			});
			
			newDocument[divCourrant] = json;

			postDocument(newDocument);
			$(divCourrant).find("#erreurCb").html("Sauvegardé..");
			$(divCourrant).find("#erreurCb").show().delay(1500).fadeOut();		

		}else{
			$(divCourrant).attr("isok","0");
		}


	});


	/////////////////////////////////////////////////////
	//////////////////BOUTON Supprimer Un Exercice///////
	/////////////////////////////////////////////////////
	$("body").on('click', "#supprimerExo", function(){
		comp = $(this).attr("comp");
		divCourrant = "#exo"+comp; 
		$(divCourrant).hide(2000);
		delete newDocument[divCourrant];
	});

	/////////////////////////////////////////////////////
	////////////////////BOUTON Ajouter Une Reponse///////
	/////////////////////////////////////////////////////

	$("body").on('click', '#plusCB', function(){
		comp = $(this).attr("comp");
		divCourrant = "#exo"+comp;

		if($("#inputtitreExo"+comp).val() != ""){
			$(divCourrant).find("#enregistrerExo").show(300);
			$(divCourrant).find("#erreurCb").hide();
			var compRep =  $(this).attr('comprep');
			$(divCourrant).append(addCheckBox(comp, compRep));
			$(divCourrant).attr('comprep', compRep);
			compRep++;
			$(this).attr('comprep', compRep);
			$(divCourrant).attr("isok","0");
			$(divCourrant).animate({ scrollTop: $(document).height() }, "slow");
			
		}else{
			$(divCourrant).find("#erreurCb").html("L'intitulé de l'exercice est vide");
			$(divCourrant).find("#erreurCb").show(300);

		}	
		
	});



	/////////////////////////////////////////////////////
	////////////////BOUTON Afficher Menu Deroulant///////
	/////////////////////////////////////////////////////
	
	$('#ajouterElement').click(function(){
		SH("new_part");
	});
});
