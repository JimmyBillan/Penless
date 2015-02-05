$(document).ready(function(){
	$("body").on('click', '#iconsupprimerDoc', function(){
		
		iddoc = $(this).attr("value");
		$.ajax({
		type : 'POST',
		url : '../../Controller/processDeleteDocument.php',
		data: {idDocument : $(this).attr("value")},
		success: function(reponse){
			
			if ( reponse = "delete_succes"){
				$("#"+iddoc).hide();
			}
				
		}

		});
	});

	
});