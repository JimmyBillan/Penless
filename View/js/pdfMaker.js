var pdfMaker = {};
// CONSTANTES
pdfMaker.marginLeft = 20;
pdfMaker.marginUp   = 20;
pdfMaker.lineStep   = 10;
pdfMaker.underline  = 2;
pdfMaker.endPage    = 280;
pdfMaker.pageWidth  = 200;
pdfMaker.fontTitre  = 26;
pdfMaker.fontQuestion = 12;
pdfMaker.fontReponse  = 10;
pdfMaker.lineMargin   = 5;
pdfMaker.CBsize       = 3;
// VARIABLE
pdfMaker.lineY      = 20;

// CONSTANTES POUR fromHTML
pdfMaker.specialElementHandlers = {
	// element with id of "bypass" - jQuery style selector
	'#bypassme': function(element, renderer){
		// true = "handled elsewhere, bypass text extraction"
		return true
	}
}
pdfMaker.margins = {
    top: 80,
    bottom: 60,
    left: 40,
    width: 522}

pdfMaker.checkEndOfPage = function () {
	if (pdfMaker.lineY> pdfMaker.endPage) {
	    pdfMaker.exos.addPage();
	    pdfMaker.lineY = pdfMaker.marginUp;
	}
}

pdfMaker.addTitreDoc = function (titreDoc) {
	pdfMaker.lineY = pdfMaker.marginUp;
	pdfMaker.exos.setFontSize(pdfMaker.fontTitre);
	pdfMaker.exos.text(pdfMaker.marginLeft, pdfMaker.lineY, titreDoc);
	pdfMaker.lineY += pdfMaker.fontTitre; 
	pdfMaker.checkEndOfPage();
}

pdfMaker.addQuestion = function (question) {
	pdfMaker.exos.setFontSize(pdfMaker.fontQuestion);
	pdfMaker.exos.text(pdfMaker.marginLeft, pdfMaker.lineY, question);
	pdfMaker.lineY += pdfMaker.underline;
	pdfMaker.exos.setLineWidth(0.3);
	pdfMaker.exos.line(pdfMaker.marginLeft, pdfMaker.lineY, pdfMaker.pageWidth, pdfMaker.lineY);

	pdfMaker.lineY += pdfMaker.fontReponse; 
	pdfMaker.checkEndOfPage();
}

pdfMaker.addQcmReponse = function (reponse) {
	pdfMaker.exos.setFontSize(pdfMaker.fontReponse);
	pdfMaker.exos.rect(pdfMaker.marginLeft, pdfMaker.lineY -pdfMaker.CBsize, pdfMaker.CBsize, pdfMaker.CBsize);
	pdfMaker.exos.text(pdfMaker.marginLeft + 2*pdfMaker.CBsize, pdfMaker.lineY, reponse);
	pdfMaker.lineY += pdfMaker.fontReponse; 
	pdfMaker.checkEndOfPage();
}

pdfMaker.addLigneReponse = function () {
	pdfMaker.exos.setFontSize(pdfMaker.fontReponse);
	pdfMaker.exos.text(pdfMaker.marginLeft, pdfMaker.lineY, 
		"......................................................................................."+
		"...............................................................................................");
	pdfMaker.lineY += pdfMaker.fontReponse;
	pdfMaker.checkEndOfPage(); 
}

function addBase64FromImageUrl(URL) {
	console.log("addBase64FromImageUrl" + URL);
    /*var extension = imgData.split('.');
	var fileType;
	console.log("extension image " + extension[extension.length-1]);
	switch (extension[extension.length-1]) {
		case 'png' : {fileType = 'PNG'; break;}
		case 'jpg' : {fileType = 'JPEG'; break;}
		default : {fileType='IGNORE'}
	}
	if (fileType!=='IGNORE') {
		pdfMaker.exos.addImage(imgData, 'PNG', pdfMaker.marginLeft, pdfMaker.lineY, 200, 200);
	}*/
	/*var img = new Image();
    img.src = URL;
    img.onload = function () {
	// Redmensionner l'image?
    var canvas = document.createElement("canvas");
    canvas.width = img.width;//.naturalWidth;
    canvas.height = img.height;//this.naturalHeight;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(this, 0, 0);

    //var dataURL = canvas.toDataURL();
    pdfMaker.exos.addImage(dataURL);

    }*/
}

pdfMaker.htmlToPdf = function () {
    
    pdfMaker.titreDoc = $('[name="titreDocument"]').val(); // CKE add trim?

    // On génèrera 1 fichier pdf pour la leçon et 1 pour les exercices 
	
	// 1. EXERCICES
	pdfMaker.exos = new jsPDF();
	pdfMaker.pdfFilename = pdfMaker.titreDoc + "-exo.pdf";
	// Titre
	pdfMaker.addTitreDoc(pdfMaker.titreDoc);

	pdfMaker.nbExo = 0;
	$("#blockQuestion").find('[name^="exo"]').each(function() {	
		if ($(this).attr("typeExo")!=="editeurHtml"){
			pdfMaker.nbExo++;

			// Titre Exo = Question
			pdfMaker.addQuestion($(this).find('[name^="titreExo"]').val());
			// Image si existe 
			if ($(this).find('img')) {
				addBase64FromImageUrl($(this).find('img').attr("src")); 
    			// --> Erreur : "The operation is insecure"
    			// Il est interdit d'accéder aux données provenant d'un autre site
			}
			// Réponses
			switch ($(this).attr("typeExo")) {
				case "QuestionSimple": {
					pdfMaker.addLigneReponse($(this));
					break; 
				}
				case "Qcm" : {
	        		$(this).find('[name^="reponse"]').each(function() {
	                	pdfMaker.addQcmReponse($(this).val());
	                });
	        		break;
	        	}
			}
	    }
	}
	);
		
	pdfMaker.exos.save(pdfMaker.pdfFilename);
	
	// 2. LECON ou TEXTE mis en forme via l'éditeur
    if ($('#editor')) {
    	console.log($('#editor').html());    	
    	pdfMaker.texte = new jsPDF();
    	pdfMaker.pdfFilename = pdfMaker.titreDoc + "-texte.pdf";
    	console.log("Impression leçon "+pdfMaker.pdfFilename);
    	// Le code suivant de récupère que les données statiques
    	// pas le contenu dynamique 
      	pdfMaker.texte.fromHTML($('#editor').html(),                // HTML string or DOM elem ref.
    				 pdfMaker.margins.left, // x coord
    				 pdfMaker.margins.top,  // y coord
    				{'width'          : pdfMaker.margins.width, // max width of content on PDF
    				 'elementHandlers': pdfMaker.specialElementHandlers},
    				function (dispose) {
    	  				// dispose: object with X, Y of the last line add to the PDF
    	  				//          this allow the insertion of new lines after html
    	  				console.log("save");
          				pdfMaker.texte.save(pdfMaker.pdfFilename);
       				},
    				pdfMaker.margins
    	);
	}
}