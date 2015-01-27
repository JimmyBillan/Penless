$(document).ready(function(){
	$("#recherche").keyup(function(e){
		if($("#recherche").val() == ""){
			$("#labelRecherche").hide(300);
		}else{
			$("#labelRecherche").show();
		}

		if($("#recherche").val() != "") {
           	$.ajax({
				type : 'POST',
				data : { name : $('#recherche').val()},
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
						$('#labelRecherche').html(part1+part2+part3);
						$('#labelRecherche').show(200);
					}
					
				}
			});
       }
$("#labelRecherche").hide()
	});
});

