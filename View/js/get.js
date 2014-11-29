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



$(document).ready(function(){
	var User = getParameterByName('U');
	var idDocument = getParameterByName('D');
	var codePage = getParameterByName('C');


	if(User !=""){

		
		$.ajax({
			type : 'POST',
			data : {U: User},
			url : 'Controller/getUser.php',
			success: function(reponse){
				var result = $.parseJSON(reponse);
				console.log(result);
				nom = Maj(result.nom);
				prenom = Maj(result.prenom);

				part1 = '<div id="row" class="droite15"><div class="container-fluid">';
				part2 = '<div id="title" class="well"><h2>';
				part21 = '</h2></div>'
				part3 = '<table class="table table-striped table-hover "><thead><tr><th>Nom du document</th><th>Dernière modification</th></tr></thead><tbody>';
				part5 = '</tbody></table></div></div>';
				part6 = '</div></div>';
				
				$('#corp').html(part1+part2+nom+" "+prenom+part21+part6);
				
				
				if(result.isAmi == "No_user"){
					alert("lien invalide");
					
				}else if(result.isAmi == ""){
					$('#title').append('<input type="submit" id="addContact" class="btn btn-default  btn-xs" value="Ajouter aux contacts">');	
				}else if (result.isAmi){
					
					if(result.isAmi == "WAITING"){
						$('#title').append('<input type="submit" id="cancelAddContact" class="btn btn-default  btn-xs" value="Annuler l\'invitation">');
					}else
					if(result.isAmi == "ALREADY_FRIEND"){
						$('#title').append('<input type="submit" id="deleteContact" class="btn btn-default  btn-xs" value="Supprimer des contacts">');
					}else
					if(result.isAmi == "MYSELF"){
						$('#title').append('<input type="submit" id="myParameter" class="btn btn-default  btn-xs" value="Mes paramètres">');

					}else
					if(result.isAmi == "WAITING_FOR_ME"){
						$('#title').append("Souhaite faire partie de vos contacts <p><input id='accepterContact' type='button' idUrl='"+User+"' value='Accepter' class='btn btn-default  btn-xs'>"+ 
										" <input id='refuserContact' type='button' idUrl='"+User+"' value='Refuser' class='btn btn-default  btn-xs'></p>");

					}

				}

				if(codePage == "Notification"){
					
					$.ajax({
						type : 'POST',
						data : {C:codePage, U:User},
						url : 'Controller/getNotification.php',
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
	
			$('#corp').on('click', '#accepterContact', function(){
					$.ajax({
						type : 'POST',
						data : {U:$(this).attr("idUrl")},
						url : 'Controller/accepterContact.php',
						success:function(reponse){
							return false;
						} 
					});
					
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
				});

				
			}

		});

	}else if(idDocument !=""){
			$.ajax({
			type : 'POST',
			data : {D: idDocument},
			url : 'Controller/getDocument.php',
			success: function(reponse){
				exo = new Exercice();
				exo.afficheExercicePourEleve($.parseJSON(reponse));
				
				// DEBUG CKE
				/*$("#titreExo0CBinput0").attr("checked", "checked");
				$("#titreExo0CBinput2").attr("checked", "checked");				
				$("#titreExo2CBinput1").attr("checked", "checked");
				$("#RtitreExo1").attr("value","A");
				$("#RtitreExo3").attr("value","B");
				alert("debug");*/
				
			}
		});
	}

	$('#corp').on('click', '#addContact', function(){
		$.ajax({
			type : 'POST',
			data : {U: User},
			url : 'Controller/addContact.php',

			success: function(reponse){
				console.log(reponse);
				if(reponse == User){
					$("#addContact").remove();
					$('#title').append('<input type="submit" id="cancelAddContact" class="btn btn-default  btn-xs" value="Annuler l\'invitation">');
				}
			}
		});
	});


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

					$("#title").after("<div id='formParametre' style='display:none;'><label>Info general</label><br>"+
						"<input value="+result.nom+"><input value="+result.prenom+"><br>"+
						"<label>Info Confidentiel</label><br>"+
						"<form class='form-horizontal'><div class='checkbox'><label>"+checkboxMail+"Recevoir les notifications par mail :</label></div></form>"+saveParametre+"</div>");
					
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

});