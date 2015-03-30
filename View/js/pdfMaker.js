var pdfMaker = {};
// CONSTANTES
pdfMaker.marginLeft = 20;
pdfMaker.marginUp   = 20;
pdfMaker.lineStep   = 10;
pdfMaker.endPage    = 280;
// VARIABLE
pdfMaker.lineY      = 20;

pdfMaker.htmlToPdf = function () {
    // Le code suivant de récupère que les données statiques
    // pas le contenu dynamique 
    /*var pdf = new jsPDF();
    pdf.fromHTML(source,                // HTML string or DOM elem ref.
  				 pdfMaker.margins.left, // x coord
  				 pdfMaker.margins.top,  // y coord
  				{'width'          : pdfMaker.margins.width, // max width of content on PDF
  				 'elementHandlers': pdfMaker.specialElementHandlers},
  				function (dispose) {
  	  				// dispose: object with X, Y of the last line add to the PDF
  	  				//          this allow the insertion of new lines after html
        			pdf.save('Test.pdf');
     			},
  				pdfMaker.margins
  	);*/

	
	var jsonDoc={};
	// Titre
	jsonDoc["titreDocument"] = $('[name="titreDocument"]').val();
	
	// Exercices
	jsonDoc["nbExo"] = 0;
	$("#blockQuestion").find('[name^="exo"]').each(function() {
		if (jsonDoc["titreDocument"])
		jsonDoc["nbExo"] ++;
		var idExo = "exo" +jsonDoc["nbExo"]; //ou $(this).attr("name"); si on ne veut pas renuméroter
		jsonDoc[idExo] = {};
		jsonDoc[idExo]["typeExo"] = $(this).attr("typeExo");
		if (jsonDoc[idExo]["typeExo"]==="editeurHtml"){//arrayExo.length == 0){// Cas du text editor
			jsonDoc[idExo]["contenu"] = $(this).find('#editor').html();
		} else {
			var arrayExo = $(this).find(" input,select,textarea").serializeArray();
			jQuery.each(arrayExo, function() {
			jsonDoc[idExo][this.name] = this.value || '';
			});
		}
		
	});

	var doc = new jsPDF();
	pdfMaker.lineY = 20;
	doc.setFontSize(22);
	doc.text(pdfMaker.marginLeft, pdfMaker.lineY, jsonDoc["titreDocument"]);

	doc.setFontSize(16);

	$.each(jsonDoc, function(key, val){ // On parcourt le document
	        //console.log(key + " " + val);

	        if (key.substring(0,3) === "exo"){ // à la recherche des questions
	            // Test sur le type de la question : QCM, QS, ... 
	            var idExo = key;
	            var nextCBisOK = false;
	            var typeExo = val["typeExo"];
	            console.log(typeExo);
	            if (typeExo==="editeurHtml"){
	                //doc.fromHTML($('#editor').html());
	            } else {
	            	$.each(val, function(index, value) {
	                
	                if (index.substring(0,8)=== "titreExo"){
	                    doc.text(pdfMaker.marginLeft, pdfMaker.lineY, value);              
	                }
	                if (index.substring(0,7) === "reponse"){
	                	if (typeExo==="Qcm") {
	                		doc.text(pdfMaker.marginLeft, pdfMaker.lineY, "o   " + value); // TODO checkbox
	                	} else {
	                		doc.text(pdfMaker.marginLeft, pdfMaker.lineY, "................................................................");
	                	}
	                }
	                pdfMaker.lineY += pdfMaker.lineStep; 
	                if (pdfMaker.lineY> pdfMaker.endPage) {
	                	doc.addPage();
	                	pdfMaker.lineY = pdfMaker.marginUp;
	                }
	            });
	        }
	        }
	        
	    });
	doc.save('monTest.pdf');
}