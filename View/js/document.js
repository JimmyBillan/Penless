function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function(){
	var idDocument = getParameterByName('D');
	var codePage = getParameterByName('C');


if(idDocument !=""){
			$.ajax({
			type : 'POST',
			data : {D: idDocument},
			url : 'Controller/getDocument.php',
			success: function(reponse){
				console.log(reponse);
				if(reponse == "itsprivate"){
					$("#corp").html("<label>Ce document est privée, vous n'avez pas l'autorisation de le lire</label>")
				}else{
				exo = new Exercice();
				exo.afficheExercicePourEleve($.parseJSON(reponse));
				}
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
	
	$("body").on('click', '#goToTargetDocument', function(){
		console.log($(this).attr("target"));
		window.location ="/?&D="+$(this).attr("target");	
	});

});