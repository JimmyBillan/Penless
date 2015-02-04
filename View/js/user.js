function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function Maj(word){
	word = word.toLowerCase().replace(/\b[a-z]/g, function(letter) {
    return letter.toUpperCase();
	});
    return word;
}

function genererEntete(result) {
	nom = Maj(result.nom);
	prenom = Maj(result.prenom);

	ouvertureDiv = '<div id="row" class="droite15"><div class="container-fluid">';
	titreNomPrenom= '<div id="title" class="well"><h2>'+nom+" "+prenom+'</h2></div>';
	fermetureDiv = '</div></div>';
	
	$('#corp').html(ouvertureDiv+titreNomPrenom+fermetureDiv);
}

function genererBoutonEntete(result, User) {
	if(result.isAmi == "MYSELF"){
		$('#title').append('<input type="submit" id="myParameter" class="btn btn-default  btn-xs" value="Mes paramètres">');
		return false;
	}else{

		genererCorpAutreUser(User);	
		if(result.isAmi == "WAITING"){
			$('#title').append('<input type="submit" id="cancelAddContact" class="btn btn-default  btn-xs" value="Annuler l\'invitation">');
		}else
		if(result.isAmi == "ALREADY_FRIEND"){
			$('#title').append('<input type="submit" id="deleteContact" class="btn btn-default  btn-xs" value="Supprimer des contacts">');
		}else
		
		if(result.isAmi == "WAITING_FOR_ME"){
			$('#title').append("Souhaite faire partie de vos contacts <p><input id='accepterContact' type='button' idUrl='"+User+"' value='Accepter' class='btn btn-default  btn-xs'>"+ 
							" <input id='refuserContact' type='button' idUrl='"+User+"' value='Refuser' class='btn btn-default  btn-xs'></p>");
		}
	}
}

function genererCorpAutreUser(User){
	$.ajax({type : 'GET',data : {U:User}, url : 'Controller/getDocumentUserNotMe.php',
	success:function(reponse){

		if(reponse =="no_document"){
			$("#title").after("<label>Cet utilisateur n'a aucun document disponible</label>")
		}else{
			var result = $.parseJSON(reponse);

			$("#title").after("<div id='tabDocument'></div>")
			$("#tabDocument").append("<table class='table table-striped table-hover '><thead><tr><th class='hideMobile'>Nom</th><th class='hideMobile'>Dernière modification</th></tr></thead><tbody id='bodyTabDocument'>");
			for(key in result){
				$("#bodyTabDocument").append("<tr id='goToTargetDocument' target='"+result[key].idDocument+"'><td class='clickable'>"+result[key].nomDocument+"</td><td class='clickable'>"+result[key].DateModification +"</td></tr>");
			}
			$("#tabDocument").append("</tbody></table></div></div></div>");
		
		}

	}});
}

function genererCorpNotification(User) {
	$.ajax({type : 'GET',data : {U:User},url : 'Controller/getNotification.php',
						success:function(reponse){
							var result = $.parseJSON(reponse);
							
							if(result.notification.demandeContact){
								arrayKey = Object.keys(result.notification.demandeContact);
								
								for(url in result.notification.demandeContact){
									nom = Maj(result.values[url]['nom']);
									prenom = Maj(result.values[url]['prenom']);
									date = result.notification.demandeContact[url];
									$("#title").after("<blockquote><p><a href='?&U="+url+"'>"+nom+" "+prenom+"</a> souhaite faire partie de vos contacts  "+ 
										"<input id='accepterContact' type='button' idUrl='"+url+"' value='Accepter' class='btn btn-default  btn-xs'>"+ 
										" <input id='refuserContact' type='button' idUrl='"+url+"' value='Refuser' class='btn btn-default  btn-xs'> </p><footer> Le "+date+"...</footer></blockquote>");
									
								}
							}

						}
					});
}

function genererCorpContact(User){
	$.ajax({
						type : 'GET',
						data : {U:User},
						url : 'Controller/getContact.php',
						success:function(reponse)
						{
							var result = $.parseJSON(reponse);
							$("#title").after(""+
								"<div id='gestionContact'>"+
								"<label><h2>Gestion des contacts</h2></label><br>"+
								"<label><h3>Groupe de contact</h3></label><br>"+
									//"<button id='btnmodifiergroupe' type='button' class='btn btn-default'>Modifier</button>"+
									"<button id='btnCreateGroupe' type='button' class='btn btn-default'>Creer un groupe</button>"+
									"<form class='form-inline' id='formNewGroup' style='display:none'>"+
										"<div class='form-group'>"+
										"<input type='text' class='form-control' id='inputGroupName' placeholder='Creer un nouveau groupe'>"+
										"</div>"+
										"<button id='btnAjoutergroupe' type='button' class='btn btn-default'>Ajouter</button>"+
									"</form>"+				
								"</div>");
							


							$("#gestionContact").after("<div id='tabContact'></div>");
							$("#tabContact").append(""+
								"<label><h3>Mes contacts </h3></label>"+
								"<table class='table table-striped table-hover '>"+
									"<thead>"+
										"<tr>"+
											"<th class='hideMobile'>Nom </th>"+
											"<th class='hideMobile'>Prenom</th>"+
										"</tr>"+
									"</thead>"+
									"<tbody id='bodyTabContact'>");
							for(key in result){
								$("#bodyTabContact").append(""+
										"<tr id='goToTarget' target='"+result[key].idUrl+"'>"+
											"<td class='clickable'>"+result[key].nom+"</td>"+
											"<td class='clickable'>"+result[key].prenom +"</td>"+
										"</tr>");
							}
							$("#tabContact").append("</tbody></table></div></div></div>");

						}
					});


}



$(document).ready(function(){
	var User = getParameterByName('U');
	var idDocument = getParameterByName('D');
	var codePage = getParameterByName('C');


	if(User !=""){
		$.ajax({type : 'GET', data : {U: User}, url : 'Controller/getUser.php',
			success: function(reponse)
			{
				var result = $.parseJSON(reponse);
				
				/*Le lien avec le parameter U est invalide, l'utilisateur n'existe pas */
				if(result.isAmi == "No_user") {
					alert("lien invalide");
					return false;
				}
				genererEntete(result); /*l'utilisateur existe on genere l'entete user*/

				if(result.isAmi == ""){
					$('#title').append('<input type="submit" id="addContact" class="btn btn-default  btn-xs" value="Ajouter aux contacts">');
					}	
				else 
				if(result.isAmi){
					genererBoutonEntete(result, User); /* la fonction genererBoutonEntete appel la fonction genererCorpAutreUser */
				}

				if(codePage == "Notification"){
					genererCorpNotification(User);
				}
				else
				if(codePage == "Contact"){			
					genererCorpContact(User);
				}


				
			}

		});

	}else{
		window.location ="/MyDocuments.php";
	}
	

	$('#corp').on('click', '#btnCreateGroupe',function(){
		if( $('#formNewGroup').is(":visible")){
			$('#inputGroupName').val("");
			$('#formNewGroup').hide();
			$('#btnCreateGroupe').html('Creer un groupe');
		}else if ( $('#formNewGroup').is(":hidden")){
			$('#formNewGroup').show();
			$('#btnCreateGroupe').html('Annuler');

		}
	});

	$('#corp').on('click', '#btnAjoutergroupe',function(){
		if( $('#inputGroupName').val() !=""){
			$.ajax({type : 'POST',data : {G: $('#inputGroupName').val()},url : 'Controller/initGroup.php',
			success: function(reponse){
				if(reponse == "init_success"){
					$('#inputGroupName').val("");
					$('#formNewGroup').hide();
					$('#btnCreateGroupe').html('Creer un groupe');
				}
				
			}
			});
		}
	
	});



	$('#corp').on('click', '#addContact', function(){
		$.ajax({type : 'POST',data : {U: User},url : 'Controller/addContact.php',
			success: function(reponse){
				console.log(reponse);
				console.log(User);
				if(reponse == User){
					$("#addContact").remove();
					$('#title').append('<input type="submit" id="cancelAddContact" class="btn btn-default  btn-xs" value="Annuler l\'invitation">');
				}
			}
		});
	});

	$('#corp').on('click', '#cancelAddContact', function(){
		$.ajax({type : 'POST',data : {U: User},url : 'Controller/cancelAddContact.php',
			success: function(reponse){
				console.log(reponse);
				if(reponse == User){
					$("#cancelAddContact").remove();
					$('#title').append('<input type="submit" id="addContact" class="btn btn-default  btn-xs" value="Ajouter aux contacts">');
				}
			}
		});
	});

	$('#corp').on('click', '#deleteContact', function(){
		$.ajax({type : 'POST',data : {U: User},url : 'Controller/deleteContact.php',
			success: function(reponse){
				console.log(reponse);
				console.log(User);
				if(reponse == User){
					$("#deleteContact").remove();
					$('#title').append('<input type="submit" id="addContact" class="btn btn-default  btn-xs" value="Annuler l\'invitation">');
				}
			}
		});
	})

	$('#corp').on('click', '#myParameter', function(){
		if($('#formParametre').is(":visible")){
			$('#formParametre').hide();
			$('#myParameter').prop('value', 'Mes paramètres');
		}else if ($('#formParametre').is(":hidden")){
				$('#formParametre').show();
				$('#myParameter').prop('value', 'Annuler');
		}else
		{
			$('#myParameter').prop('value', 'Annuler');
				$.ajax({
					type : 'POST',
					data : {U: User},
					url : 'Controller/parametreConfidentiel.php',

					success: function(reponse){
					checkboxMail = "<input id='idCheckboxMail' type='checkbox'>";
					saveParametre = "<input id='saveParametre' type='submit' value='Sauvegarder' class='btn btn-default  btn-xs'>";
					var result = $.parseJSON(reponse);

					$("#title").after("<form id='formParametre'class='form-inline' style='display:none;'>"+
						"<form class='form-horizontal'><div class='form-group'><input class='form-control' value="+result.nom+"></div><div class='form-group'><input class='form-control' value="+result.prenom+"></div></form>"+
						"<label>Info Confidentiel</label>"+
						"<form class='form-horizontal'><div class='checkbox'><label>"+checkboxMail+"Recevoir les notifications par mail :</label></div></form>"+saveParametre+"</form>");
					
					if(result.notificationMail == true)
						$( "#idCheckboxMail" ).prop( "checked", true );
					$('#formParametre').show();

					}


				});
		}

	});

	$("body").on('click', '#EnregistrerReponseEleve', function(){
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
		
	});

	$("body").on('click', '#Corriger', function(){
		//CKE Possibilité incohérence id
		
		exo.afficheCorrection();		
	});

	$("body").on('click', '#goToTarget', function(){
		console.log($(this).attr("target"));
		window.location ="/?&U="+$(this).attr("target");	
	});



	
	$('#corp').on('click', '#accepterContact', function(){
			$.ajax({
				type : 'POST',
				data : {U:$(this).attr("idUrl")},
				url : 'Controller/accepterContact.php',
				success:function(reponse){
					return false;
				} 
			});
			console.log($(this).parent().parent());
			$(this).parent().parent().hide();
			
			
		});

		$('#corp').on('click', '#refuserContact', function(){
			
			$.ajax({
				type : 'POST',
				data : {U:$(this).attr("idUrl")},
				url : 'Controller/refuserContact.php',
				success:function(reponse){
					return false;
				} 
			});
			$(this).parent().parent().hide();
		});

});
