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

	ouvertureDiv = '<div id="row" ><div class="container-fluid">';
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

function genererCorpContact(User, jsonDescontact){

	var request = $.ajax({
		type : 'GET',
		data : {U:User},
		async: !1,
		url : 'Controller/getContact.php'
	}).done(function(reponse)
		{
			var result = $.parseJSON(reponse);
			$("#title").after(""+"<div id='listContact'style='display:none'>"+reponse+"</div>"+ /* ICI ON STORE EN LOCAL DANS LE HTML LE JSON DE LA LISTE DES CONTACTS*/
				"<div id='gestionContact' >"+
				"<label><h2>Gestion des contacts</h2></label><br>"+		
				"</div>");
			genererTableauGroupe(User);
			$("#tabGroupe").after("<div id='tabContact' class='col-xs-12 col-sm-12 col-md-12 col-lg-6'></div>");
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
			
			jsonDescontact = result;
			
		});
	return jsonDescontact;
}

	function genererTableauGroupe(User){
	$("#gestionContact").append(
		"<label><h3>Groupe de contact</h3></label><br>"+
			"<button id='btnCreateGroupe' type='button' class='btn btn-default'>Creer un groupe</button>"+
			"<form class='form-inline' id='formNewGroup' style='display:none'>"+
				"<div class='form-group'>"+
				"<input type='text' class='form-control' id='inputGroupName'  placeholder='Creer un nouveau groupe'>"+
				"</div>"+
				"<button id='btnAjoutergroupe' type='button' class='btn btn-default'>Ajouter</button>"+
			"</form>");
	$("#gestionContact").after("<div id='tabGroupe' class='col-xs-12 col-sm-12 col-md-12 col-lg-6'></div>");
	$("#tabGroupe").append("<label><h3>Mes Groupes</h3></label><div id='row' class='bodytabGroupe'>");
	newLineGroupe(User);
	$("#tabGroupe").append("</div>");

}

function newLineGroupe(User){
	$.ajax({type:'GET',data:{U:User}, url:'Controller/getlistofmyGroup.php', success:function(reponse){
		arrayReponse = $.parseJSON(reponse);	
		for (var i = 0; i < arrayReponse.length ; i++) {
		
			$(".bodytabGroupe").append(""+
				 	"<div class='row ligngroup'>"+
				 		"<div class='col-xs-12 col-lg-7 col-md-8 col-sm-8' ><div id='groupName-"+arrayReponse[i].idGroupe+"' statut='normal' style='font-size: 18px; vertical-align: middle;'>"+arrayReponse[i].nom+"</div></div>"+
				 		"<div class='col-xs-12  col-lg-5 col-md-4 col-sm-4' style='text-align: right;heigh:25px;margin-bottom:3px'><button id='btnEditerGroup' class='btn btn-default btn-xs'  value='"+arrayReponse[i].idGroupe+"' statut='Editer'><span class='glyphicon glyphicon-edit' aria-hidden='true'></span> Editer</button><button id='btnEnregisterEditionGroup' value='"+arrayReponse[i].idGroupe+"' class='btn btn-default btn-xs' style='float:right; display:none'>Enregistrer</button></div>"+
				 	"</div>"
				 );

		}
	}
	});
}

function getlistofUserinaGroup(groupID){
	$.ajax({
		url: 'Controller/getlistofUserinaGroup.php',
		type: 'GET',
		dataType: 'json',
		data: {id: groupID},
	})
	.done(function(reponse) {
			$('#listOfUserInGroup-'+groupID).html('<table class="table table-striped" id="tableOfuserIngroup-'+groupID+'"><tbody id="tbodyOfuserInGroup-'+groupID+'"></tbody></table>');
		console.log(reponse);
		if(reponse.arrayUser == null && reponse.admin == null){
			$('#tbodyOfuserInGroup-'+groupID).after('<th id="defaut-'+groupID+'">Aucun utilisateur dans ce groupe</th>');
			//$('#listOfUserInGroup-'+groupID).html("");
		}else 
		if(reponse.arrayUser != null){
			for (i=0; i < reponse.arrayUser.length; i++){
				view = '<tr url="'+reponse.arrayUser[i]+'"><td>'+reponse.arrayUser[i]+'</td><td><select><option>Utilisateur</option><option>Admin</option></select></td>></tr>';
				$('#tbodyOfuserInGroup-'+groupID).prepend(view);
			}
			
		}
		if(reponse.admin != null){
			for (i=0; i < reponse.admin.length; i++){
				view = '<tr url="'+reponse.admin[i]+'"><td>'+reponse.admin[i]+'</td><td><select id="select-'+groupID+'-'+reponse.admin[i]+'"><option>Utilisateur</option><option>Admin</option></select></td>></tr>';
				$('#tbodyOfuserInGroup-'+groupID).prepend(view);
				$('#select-'+groupID+'-'+reponse.admin[i]).val('Admin');
			}

		}

	})
	.fail(function(reponse) {
		console.log("error");
		console.log(reponse);
	})
	.always(function() {
		
	});
	
}

function saveEditGroupe(arrayGroupe){
	$.ajax({
		url: 'Controller/processSaveGroupEdit.php',
		type: 'POST',
		data: {g: arrayGroupe},
	})
	.done(function() {
		console.log("success");
	})
	.fail(function() {
		console.log("error");
	})
	.always(function(reponse) {
		console.log("complete");
		console.log(reponse);
	});
	
}


$(document).ready(function(){
	var User = getParameterByName('U');
	var idDocument = getParameterByName('D');
	var codePage = getParameterByName('C');
	var jsonDescontact;


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
					jsonDescontact = genererCorpContact(User, jsonDescontact);
					
				}


				
			}

		});

	}


	

$('#corp').on('click', '#supprimerGroup',function(){
	
	$.ajax({type : 'POST',url : '../../Controller/processDeleteGroup.php',data: {idGroup : $(this).attr("value")},
		success: function(reponse){
			if ( reponse = "delete_succes"){
				$("#"+iddoc).hide();}			
		}
	});
});

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
				$('.bodytabGroupe').empty();
				newLineGroupe(User)
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


$("body").on('click', '#goToTarget', function(){
	console.log($(this).attr("target"));
	window.location ="/?&U="+$(this).attr("target");	
});



$("body").on('click', '#btnEditerGroup', function(){
	var groupCourrant = $(this).attr('value');
	var listContact;
	
	if($(this).attr('statut')==="Editer"){
		$(this).closest('div').after(""+
			"<div id='detailGroupe-"+groupCourrant+"' class='col-xs-12' value='"+groupCourrant+"'>"+
				"<h5 id='ajouterNewUserToGroup' class='col-xs-4 actionOnGroup' value='"+groupCourrant+"' statut='on'>Ajouter</h5>"+
				"<h5 id='renommerGroup'class='col-xs-4 actionOnGroup' value='"+groupCourrant+"'>Renommer</h5>"+
				"<h5 id='SupprimerGroup' class='col-xs-4 actionOnGroup' value='"+groupCourrant+"'>Supprimer</h5>"+
		
				"<div id='listOfUserInGroup-"+groupCourrant+"' class='form-inline listOfUserInGroup '>"+
			"</div>");
		getlistofUserinaGroup(groupCourrant);
		
		$(this).parent().find('#btnEnregisterEditionGroup').show();
		$(this).attr('statut', 'Annuler');
		$(this).html("<span class='glyphicon glyphicon-remove-circle' aria-hidden='true'></span> Annuler");
	}
		
	else{
		$(this).attr('statut', 'Editer');;
		$(this).parent().find('#btnEnregisterEditionGroup').hide();
		$(this).html("<span class='glyphicon glyphicon-edit' aria-hidden='true'></span> Editer");
		$('#detailGroupe-'+groupCourrant).remove();
		
	}

});

$("body").on('click', '#renommerGroup', function() {
	var gCourrant = $(this).attr("value");
	var nom = $('#groupName-'+gCourrant).html();

	if($('#groupName-'+gCourrant).attr('statut') == "normal"){

		$('#groupName-'+gCourrant).attr('statut', 'editing');

		$(this).parent().find('#ajouterNewUserToGroup').attr({
			style:'cursor: not-allowed;color: #C2BCBC',
			statut: 'off'
		});
		$(this).parent().find('#SupprimerGroup').attr({
			style:'cursor: not-allowed;color: #C2BCBC',
			statut: 'off'
		});
		$(this).html("Terminer");
		console.log(nom);
		$('#groupName-'+gCourrant).html('<input id="inputGroupName-'+gCourrant+'" type="text" autocomplete="off" class="form-control" >');
		$('#inputGroupName-'+gCourrant).val(nom);
	}else{
		$(this).html("Renommer");

		$('#groupName-'+gCourrant).html($('#inputGroupName-'+gCourrant).val());

		$('#groupName-'+gCourrant).attr('statut', 'normal');
		$(this).parent().find('#ajouterNewUserToGroup').attr({
			style:'',
			statut: 'on'
		});
		$(this).parent().find('#SupprimerGroup').attr({
			style:'',
			statut: 'on'
		});


	}
});

$('#corp').on('click', '#ajouterNewUserToGroup', function(){
	var groupCourrant = $(this).attr('value');
	var ok = false;
	if($(this).attr('statut')==="on"){
		ok = true;
	}
	if($(this).html()==="Ajouter" && ok == true){
		$('#listOfUserInGroup-'+groupCourrant).before(''+
			'<form id ="formNewUserToGroup" class="form-inline"  style="padding-left:8px" onsubmit=" return false;" >'+
				'<input type="text" class="form-control" id="inputNewUserToGroup" placeholder="Saisir son nom ou son ID" style="width:100%">'+
				//'<div id="labelRechercheNewUserToGroup" class="bulleUser bullUser-control" style="display: none"></div><input type="button" id="inputbtnNewUserToGroup" value="+" class="btn btn-default"></form>');
				'<div id="labelRechercheNewUserToGroup" codeGroup="'+groupCourrant+'"></div></form>');
		$(this).html("Annuler ajout");
	}else{
		$(this).html("Ajouter");
		$(this).parent().children('#formNewUserToGroup').remove();
		
	}
});



$("#corp").on('keyup', '#inputNewUserToGroup', function(){
	
 	
    var letters = $(this).val().toLowerCase();
   	var length = letters.length;
	var contactFound = [];
	var c = 0;
	if(letters.length != 0){
		for (var i = 0; i < jsonDescontact.length; i++) {
			if(letters === jsonDescontact[i].nom.substring(0,letters.length)|| letters === jsonDescontact[i].prenom.substring(0,letters.length)){
				contactFound.push(jsonDescontact[i]);
				c++;
			}	
		}
	}
	
	c = contactFound.length;

	
	if( c > 0){
		var view = '<ul multiple  id="formlabelRechercheNewUserToGroup" style="overflow-y: auto;">';
		for (var i = 0; i < c; i++) {
			view = view+'<li id="OptionAddUserToGroup" url="'+contactFound[i].idUrl+'">'+contactFound[i].nom+' '+contactFound[i].prenom+'</li>';
		};

		view = view+'</ul>';

		cGroupe = $(this).parent().children('#labelRechercheNewUserToGroup').attr('codeGroup');

		$(this).parent().children("#labelRechercheNewUserToGroup").html(view);
		$(this).parent().children("#labelRechercheNewUserToGroup").show();

		/* 
		ICI SELECTION DANS LES RESULTATS DU MENU DEROULANT
		
		detailGroupe-bLVmNg67bP
		*/
		$("#corp").on('click',"#OptionAddUserToGroup",function() {
			
			
			/*Supprimer la phrase signalant un groupe vide*/
			$("#defaut-"+cGroupe).remove();
			console.log("nom "+ $(this).html());
			var selected = $(this);
			var groupe = $(this).parent().parent().attr('codegroup');
			var urlUser = $(this).attr("url");


			/* Le .html() pour recuperer le nom et prenom c est pas super à voir*/
			view = '<tr url="'+urlUser+'"><td>'+$(this).html()+'</td><td><select><option>Utilisateur</option><option>Admin</option></select></td>></tr>';
			
			/*On supprime la ligne du menu deroulant */
			$(this).remove();

			
			if($('#tableOfuserIngroup-'+groupe+'>tbody > tr').length == 0){ /*Cas ou il y a pas d'utilisateur dans le groupe */ 
				
				$('#tbodyOfuserInGroup-'+groupe).prepend(view);

				/* On supprime le select si il n'y a plus de resultat*/
				if($.trim($(this).parent().parent().children('#formlabelRechercheNewUserToGroup').html())==''){
					$(this).parent().parent().children('#formlabelRechercheNewUserToGroup').remove();
				}
			}else{
				/*Cas ou il y a déjà des utilisateurs dans le groupe */ 
				var okToPush = true;

				/*On parcours toutes les lignes pour voir si l utilisateur est deja present*/
				$('#tableOfuserIngroup-'+groupe+' >tbody > tr').each(function(){
					if($(this).attr('url') === urlUser )
						okToPush = false;

				});

				if(okToPush == true){
					$('#tbodyOfuserInGroup-'+groupe).prepend(view);

					/* On supprime le select si il n'y a plus de resultat*/
					if($.trim($(this).parent().children('#formlabelRechercheNewUserToGroup').html())==''){
						$(this).parent().children('#formlabelRechercheNewUserToGroup').remove();
					}
				}else{
					/*On supprime la ligne */
					$(this).remove();

					/* On supprime le select si il n'y a plus de resultat*/
					if($.trim($(this).parent().children('#formlabelRechercheNewUserToGroup').html())==''){
						$(this).parent().children('#formlabelRechercheNewUserToGroup').remove();
					}
				}
			}
				
			
			
		});

		if($(this).parent().children('#labelRechercheNewUserToGroup')=='')
			$(this).parent().children('#labelRechercheNewUserToGroup').empty();
	}else{
		$(this).parent().children('#labelRechercheNewUserToGroup').empty();
	}
		
});

$('#corp').on('click', '#btnEnregisterEditionGroup', function() {
var save = {};
save['idGroupe'] = $(this).val();
save['nom'] = $("#groupName-"+save['idGroupe']).html();
save['listUser'] = [];

$('#tableOfuserIngroup-'+save['idGroupe']+' >tbody > tr').each(function(){

	url = $(this).attr('url');
	option = $(this).find('select option:selected').text();
	var row = {};
	row[url] = option ;
	save['listUser'].push(row);
});
console.log(save);
saveEditGroupe(save);
$('#detailGroupe-'+save['idGroupe']).remove();
$(this).parent().children("#btnEditerGroup").attr('statut', 'Editer');
$(this).parent().children("#btnEditerGroup").html("<span class='glyphicon glyphicon-edit' aria-hidden='true'></span> Editer");
$(this).hide();
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
