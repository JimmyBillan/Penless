var searchUserAndGoToPage = function(saisie, propositions) {
	if(saisie.val() == ""){
		propositions.hide(300);
	}else{
		propositions.show();
	}

	if(saisie.val() != "") {
        $.ajax({type : 'POST',
				data : { name : saisie.val()},
				url : 'Controller/processRechercheUser.php',

				success: function(reponse){
					
					if(reponse !="[]"){
					var result = $.parseJSON(reponse);
					//console.log(result.length);
					part1 = "<table class='table table-hover bulleUser'> <tbody>";
					part2=""
					part3 ="</tbody></table>";
					
					
						for(var key in result){
							
						part2 = part2+"<tr onclick=\"document.location = '/?&U="+key+"';\" class='clickable'><td>"+result[key].nom+"</td><td>"+result[key].prenom+"</td></tr>";
						}
						propositions.html(part1+part2+part3);
						propositions.show(200);
					}
					
				}
			});
       }
	propositions.hide();
}


$(document).ready(function(){
	$("#recherche").keyup(function(e){
		searchUserAndGoToPage (
			$(this),	// saisie
			$(this).parent().find('#labelRecherche'));		//propositions
	});

	
});

