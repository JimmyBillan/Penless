function postDocument(dictExo){
	$.ajax({
		type : 'POST',
		url : '../../Controller/processSaveDocument.php',
		data: {document : dictExo},
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

function generateEnonce(compteur) {
    //text ='<div id="exo'+compteur+'" compRep="-1" isok="0" class="droite15 greybox col-xs-12" style="display : block">'+ CKE
    text ='<div id="exo'+compteur+'" isok="0" class="droite15 greybox col-xs-12" style="display : block">'+
        '<form class="form-inline" role="form">'+
        '<div class="form-group col-xs-12">'+
        '<label id="labeltitreExo'+compteur+'" title="modifier ?" class="alignGauche"  style="display : none"></label>'+
        '<input id="inputtitreExo'+compteur+'" name="titreExo'+compteur+'" type="text" placeholder="Saisir la question ici" class="form-control" style="width : 80%">'+
        '<input id="supprimerExo" comp='+compteur+' class="btn btn-default" type="submit" value="X" title="Supprimer l\'Ã©xercice">'+
        '</div>'+
        '</form>'+
        '</div>';
    return text;
}

function generateDivReponsesMultiples(compteur){
	text ='<div id="ReponsesMultiples'+compteur+'" class="col-xs-12">'+   
        '</div>'+
        '<div class="col-xs-12">'+
        '<input id="plusCB" comp='+compteur+' class="btn btn-default"  type="submit"  compRep="0" value="Ajouter une reponse">'+
        '<input id="enregistrerQCM" comp='+compteur+' type="submit"  style="display : none" class="btn btn-default" value="Enregistrer">'+
        '<label id="erreurQCM">'+'</label>'+
        '</div>';              
     return text;
}

function addCheckBox(compteur, compRep){
	text = '<form class="form-inline" role="form">'+
        '<div class="form-group col-xs-12">'+
        '<input id="CB'+compRep+'" type="checkbox" name="reponseJuste'+compRep+'"  value='+compRep+' >'+
   		'<input id="CBinput'+compRep+'" type ="text" name="CBinput'+compRep+'" style="width : 80%" class="form-control" placeholder="IntitulÃ© de la reponse">'+
        '<input id="supprimerCB'+compRep+'" class="btn btn-default suppr" type="submit" value="X" title="Supprimer la rÃ©ponse">'+
        '</div>'+
        '</form>';
 	return text;
}

function generateDivReponseSimple(compteur) {
    text = '<div id="ReponseSimple'+compteur+'" class="col-xs-12">'+   
        '</div>'+
        '<div class="col-xs-12">'+
        '<input id="plusReponseSimple" comp='+compteur+' class="btn btn-default"  type="submit"  compRep="0" value="Ajouter une rÃ©ponse">'+
        '<input id="enregistrerReponseSimple" comp='+compteur+' type="submit"  style="display : none" class="btn btn-default" value="Enregistrer">'+
        '<label id="erreurReponseSimple">'+'</label>'+
        '</div>';           
     return text;
}

function addReponseSimple(compteur, compRep) {
    text= '<form class="form-inline" role="form" name="reponseSimple'+compRep+'">'+
        '<div class="form-group col-xs-12">'+
        '<input id="inputReponseSimple'+compRep+'" type="text"  style="width : 80%" class="form-control" placeholder="RÃ©ponse juste">'+
        '<input id="supprimerReponseSimple'+compRep+'" class="btn btn-default suppr" type="submit" value="X" title="Supprimer la rÃ©ponse">'+
        '</div>'+
        '</form>';
    return text;
}

/*function rendreVisible(element){
	idCourant = "#"+$(element).closest('div[id]').attr("id");
	$(idCourant).find("input").show(300);
	$(idCourant).find("label").hide();

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

	var dictExo = {};
	
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
					alert(parcourExo.attr("id")+ " possede "+ (parcourExo.attr('compRep') +1)+"reponses" );
					
				}else{
					$('#labelEnregistrer').html("Exercice(s) non validÃ©(s)");
					$('#labelEnregistrer').show(500);
				}

				nbExoDisplay++;
			}
		}
		if(nbExoDisplay == 0 ){
			$(this).hide(300);
			$('#labelEnregistrer').html("Il n'y a aucun exercice Ã  enregistrer");
			$('#labelEnregistrer').show(500);
		}else{

		}
	});


	/////////////////////////////////////////////////////
	///////////////////BOUTON Creer titre Document///////
	/////////////////////////////////////////////////////

	$("#validerTitreDoc").click(function(){

		if($('#titreDoc').val()==""){
			var a = dateJour();
			$('#titreDoc').val("Document_sans_nom "+a);
			dictExo["nomDocument"] = $('#titreDoc').val();
		}else{
			dictExo["nomDocument"] = $('#titreDoc').val();
		}
		inputToLabel("validerTitreDoc", "labeltitreDoc", "titreDoc");
		SH("ajouterElement");		
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
            // Enoncé
            enonce = generateEnonce(exercices.nombreExo);
            $("#creationDocument").append(enonce);  
            // Réponses
            qcm = generateDivReponsesMultiples(exercices.nombreExo);
	        $("#exo"+exercices.nombreExo).append(qcm);
		    
	    }
        else if ($(this).val() === 'questionSimple') {
            // Enoncé
            enonce = generateEnonce(exercices.nombreExo);
            $("#creationDocument").append(enonce);  
            // Réponses
            reponseSimple = generateDivReponseSimple(exercices.nombreExo);
	        $("#exo"+exercices.nombreExo).append(reponseSimple);
	    }
        //
	     $(this).val("");
	     $(this).hide(300);
	     $("body").animate({ scrollTop: $(document).height() }, "slow");
	     $('#labelEnregistrer').hide();
	     exercices.incrementNombreExo();
	    
	    return false;
	});



	/////////////////////////////////////////////////////
	//////            BOUTON Valider Un QCM       ///////
	/////////////////////////////////////////////////////

	$("body").on('click', '#enregistrerQCM', function(){
		
		oktogo = 0;
		comp = $(this).attr("comp"); //compteur du nombre de question - index de la Question CM
		divExoCourant = "#exo"+comp; 
		erreurQCM= $(divExoCourant).find("#erreurQCM");
        erreurQCM.hide(); 
		labelTitre = "labeltitreExo"+comp;
		inputTitre = "inputtitreExo"+comp;	
		
        cRep = parseInt($(divExoCourant +" #plusCB").attr("compRep"));
		nbReponseJuste  = 0;
        nbReponseFausse = 0;
        //checkedfalse = 0;
		nbReponseInvalide = 0; // CKE var ou pas var : qu'est-ce que ça change?
		
        for(i = 0; i< cRep+1; i++){// CKE pourquoi le +1? On a fait +1 avant d'ajouter la nouvelle réponse
            
            if($(divExoCourant).find("#CBinput"+i).val() ==""){
                nbReponseInvalide++;
                erreurQCM.html("La rÃ©ponse "+ (i + 1)+" est vide");
                erreurQCM.show();
            }
            if($(divExoCourant).find("#CB"+i).is(':checked') == true){
                nbReponseJuste++;
            } else {
                nbReponseFausse++;
            }
        }

		if(nbReponseJuste == 0){
            erreurQCM.html("Aucune bonne rÃ©ponse n'est cochÃ©e");
            erreurQCM.show();
		}
        if(nbReponseFausse == 0){
            erreurQCM.html("Aucune mauvaise rÃ©ponse n'est proposÃ©e");
            erreurQCM.show();
		}
        
        /*erreurQCM.html("nbReponseTotal = " + (cRep + 1)+
                       "nbReponseInvalide = " + nbReponseInvalide +
                       "nbReponseJuste = " + nbReponseJuste +
                       "nbReponseFausse" + nbReponseFausse);*/
        
		if((nbReponseInvalide == 0) && (nbReponseJuste > 0) && (nbReponseFausse > 0)){
            
			$(divExoCourant).attr("isok","1");
            // Creation json
			var array = $(divExoCourant).find(" input,select,textarea").serializeArray();
			var json = {};			
			jQuery.each(array, function() {
				json[this.name] = this.value || '';
			});
			
			dictExo[divExoCourant] = json; // CKE c'est quoi dictExo??

			postDocument(dictExo);
			erreurQCM.html("SauvegardÃ©..");
			erreurQCM.show().delay(1500).fadeOut();		

		}else{
			$(divExoCourant).attr("isok","0");
            //erreurQCM.html("Problème");
            erreurQCM.show();
		}


	});

    
	/////////////////////////////////////////////////////////////////
	//////    BOUTON Valider Une Question à Réponse simple    ///////
	/////////////////////////////////////////////////////////////////

	$("body").on('click', '#enregistrerReponseSimple', function(){
		
		comp = $(this).attr("comp"); //compteur du nombre de question - index de la Question dans l'exercice
		divExoCourant = "#exo"+comp; 
		erreurQS= $(divExoCourant).find("#erreurReponseSimple");
        erreurQS.hide(); 
		//titreExo = "inputtitreExo"+comp; // C'est la question posée : à renommer
		var json = {};
        json["titreExo"+comp] = $(divExoCourant).find($("#inputtitreExo"+comp)).val(); // Test non nul à faire ici CKE
                                                           
        cRep = parseInt($(divExoCourant +" #plusReponseSimple").attr("compRep")); // nombre de réponses
		nbReponse         = 0;
		nbReponseInvalide = 0;
        
        for(i = 0; i< cRep; i++){
            
            if($(divExoCourant).find("#inputReponseSimple"+i).val() ==""){
                nbReponseInvalide++;
                erreurQS.html("La rÃ©ponse "+ (i + 1)+" est vide");
                erreurQS.show();
            }
            else {
                json["reponse" + i] = $(divExoCourant).find($("#inputReponseSimple"+i)).val();
                nbReponse++;
            }
        }
        
		if(nbReponse == 0){
            erreurQS.html("Aucune rÃ©ponse");
            erreurQS.show();
		}
        
		if((nbReponseInvalide == 0) && (nbReponse > 0)){
			$(divExoCourant).attr("isok","1");
            // Creation json
			//var array = $(divExoCourant).find("[type='text']").serializeArray(); // CKE ?????
				
            //v = "";
			/*jQuery.each(array, function() {
                v = v + this.name + " " + this.value + " ";
				json[this.name] = this.value || '';
			});*/
            			
			dictExo[divExoCourant] = json; // CKE c'est quoi dictExo??

			postDocument(dictExo);
			erreurQS.html("SauvegardÃ©..");
			erreurQS.show().delay(1500).fadeOut();		

		}else{
			$(divExoCourant).attr("isok","0");
		}

	});


	/////////////////////////////////////////////////////
	//////////////////BOUTON Supprimer Un Exercice///////
	/////////////////////////////////////////////////////
	$("body").on('click', "#supprimerExo", function(){
		comp = $(this).attr("comp");
		divCourant = "#exo"+comp; 
		$(divCourant).hide(2000);

		delete dictExo[divCourant];
	});  
    
    
	//////////////////////////////////////////////////////////////////
	////////////     BOUTON Ajouter Une Reponse dans un QCM    ///////
	//////////////////////////////////////////////////////////////////

	$("body").on('click', '#plusCB', function(){
		comp = $(this).attr("comp");
        divExoCourant      = "#exo"+comp;
		divReponsesCourant = "#ReponsesMultiples"+comp;
        
        //divCourant = "#exo"+comp; CKE
		if($("#inputtitreExo"+comp).val() != ""){
			$(divExoCourant).find("#enregistrerQCM").show(300); 
			$(divExoCourant).find("#erreurQCM").hide(); 
            compRep = $(this).attr('compRep');//var compRep = $(this).attr('compRep');CKE
            $(divReponsesCourant).append(addCheckBox(comp, compRep));
			//$(this).attr('compRep', compRep); // CKE??
			compRep++;
			$(this).attr('compRep', compRep);
			//$(divExoCourant).attr("isok","0"); CKE??
			$(divExoCourant).animate({ scrollTop: $(document).height() }, "slow");
			
		}else{
			$(divExoCourant).find("#erreurQCM").html("L'intitulÃ© de l'exercice est vide");
			$(divExoCourant).find("#erreurQCM").show(300);

		}
		
	});
    
    //////////////////////////////////////////////////////////////////
	////////////////////BOUTON Ajouter Une Reponse Simple /////// --> CKE mettre en commun ce qui peut l'être
	//////////////////////////////////////////////////////////////////

	$("body").on('click', '#plusReponseSimple', function(){
		comp = $(this).attr("comp");
        divExoCourant      = "#exo"+comp;
		divReponsesCourant = "#ReponseSimple"+comp;
        
        //divCourant = "#exo"+comp; CKE
		if($("#inputtitreExo"+comp).val() != ""){
			$(divExoCourant).find("#enregistrerReponseSimple").show(300); 
			$(divExoCourant).find("#erreurReponseSimple").hide(); 
            compRep = $(this).attr('compRep');
            $(divReponsesCourant).append(addReponseSimple(comp, compRep));
            //$(divExoCourant).find("#erreurReponseSimple").html("Add reponse " + compRep);
            //$(divExoCourant).find("#erreurReponseSimple").show();
			compRep++;
			$(this).attr('compRep', compRep);
			//$(divExoCourant).attr("isok","0"); CKE??
			$(divExoCourant).animate({ scrollTop: $(document).height() }, "slow");
			
		}else{
			$(divExoCourant).find("#erreurReponseSimple").html("L'intitulÃ© de l'exercice est vide");
			$(divExoCourant).find("#erreurReponseSimple").show(300);

		}
		
	});

    ////////////////////////////////////////////////////////
	///////////  BOUTON Supprimer Une Réponse        ///////
	////////////////////////////////////////////////////////
	$("body").on('click', '.suppr', function(){
    //$("#supprimerReponseSimple0").click(function(){ // CKE : ne marche pas, pourquoi???? Car element créé après le chargement de la page!
        $(this).parent().remove();
        return false; // CKE sans çà tout le formulaire disparaît.
	});
    
    /////////////////////////////////////////////////////
	////////////////BOUTON Afficher Menu Deroulant///////
	/////////////////////////////////////////////////////
	
	$('#ajouterElement').click(function(){
		SH("new_part");
	});
});
