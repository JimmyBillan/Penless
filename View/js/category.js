var CATEGORY = {};
	
CATEGORY.list = {
		"Français" 		: {	"Tous"		  :{},
							"Conjugaison" : {"Tous":{}, "1er groupe":{}, "2ème groupe":{}, "3ème groupe":{}, "présent":{}, "imparfait":{}, "futur":{}, "passé-simple":{}}, 
							"Grammaire"   : {"Tous":{}, "types de phrases":{}, "analyse grammaticale":{}, "accord sujet-verbe":{}, "accord groupe nominal":{}},
							"Orthographe" : {},
							"Vocabulaire" : {}},
		"Mathématiques" : {	"Tous"		  :{},
							"Opérations"  : {"Tous":{}, "Multiplication":{}, "Additions":{}, "Soustractions":{}, "Divisions":{}},
							"Problèmes"   : {},
							"Géométrie"   : {}},
		"Histoire"		: { "Tous"		  :{},
							"Préhistoire" : {}, 
							"Antiquité"   : {}, 
							"Moyen-Age"   : {},
							"Renaissance" : {}, 
							"XVIIIème siècles": {}, 
							"XIXème siècle": {}, 
							"XXème siècle": {}},
		"Géographie"  	: {	"Tous"		  :{},
							"France"      : {"Tous":{}, "Fleuves":{}, "Montagnes":{}, "Villes":{}}, 
							"Monde"       : {}, 
							"Europe"      : {}},
		"Sciences"		: {	"Tous"		  :{},
							"Corps humain": {},
							"Monde animal": {},
							"Monde végétal": {},
							"Environement": {},
							"Physique"    : {}},
		"Langues"		: {	"Anglais"     : {},
							"Espagnol"    : {},
							"Allemand"    : {},
							"Corse"       : {}}

		}

// Mise en forme catégories input > array > string
//----------------------------------------------------------
CATEGORY.arrayToString = function(categorie) {
	var catString = '';
	for (var j=0; j<categorie.length; j++) {
			if (j>0) { catString += '>'};
			catString += categorie[j];
		}
	return catString;
}
CATEGORY.inputToArray = function() {
	var catArray = [];
	$('#popCategorie').find(':input.btn-info').each(function() {
		catArray[catArray.length]= $(this).attr("name");
	});
	return catArray;
}
CATEGORY.tagsToArray = function() {
	var tagsTitre = [];
	var tagsAuteur = [];
	// Mots du titre en minuscules
	var titre = $('[name="titreDocument"]').val().toLowerCase();
	var titreDefaut = /document_[^a-zA-Z]+/;
	if (!titreDefaut.test(titre)) {
		tagsTitre = titre.split(/[\s,]+/);
	}  
	
	// Mots-clés saisis par l'auteur en minuscules
	var allTags = $('#popCategorie').find('input[name="tags"]').val().toLowerCase();
	if (allTags) {tagsAuteur = allTags.split(/[\s,]+/)}
	
	// Concaténation
	return tagsTitre.concat(tagsAuteur);
}

// Sidebar Menu pour la recherche d'exercices par catégorie
//----------------------------------------------------------
CATEGORY.addCategoryMenu = function(catList) {
	var submenu = "";
	for (var cat in catList) {
		submenu += '<li>';		
		if ($.isEmptyObject(catList[cat])) {
			// dernier niveau : click -> accès aux exercices
			submenu += '<a name="searchCat"><label class="labelCategorie">'+ cat +'</label>';
		}
		else {
			// niveau intermédiaire : click -> affichage du sous-menu
			submenu += '<a name="menuCat"><label class="labelCategorie">'+ cat+ '</label>'+
			'<span class="glyphicon glyphicon-chevron-right" style="float:right;">';
		}
		submenu += '</a></li>';
	}
	$('[name="menuCategory"]').append(submenu);
}

CATEGORY.createSidebarCategory = function(div) {
	var sidebar = 
		'<ul class="BAR" name="menuCategory">'+
		// Champs de recherche 
		'<li><a href="#">'+
        '<input name="tagsDoc" class="saisie" type="text" placeholder="Recherche exercice" style="color:grey; width: 90%; font-weight:normal;"></input>'+
        '<span name="searchDoc" class="glyphicon glyphicon-search" style="float:right"></span>'+
        '</a></li>'+
        // Entête du Menu des catégories
		'<li class="active"><a href="#">'+
		'<label  class="labelCategorie" name="menuCat">Catégories</label>' +
		'<span class="glyphicon glyphicon-chevron-right" style="float:right">'+
		'</span></a></li>'+
		'</ul>';
	div.append(sidebar);

	CATEGORY.addCategoryMenu (CATEGORY.list);
}

CATEGORY.toSubCategory = function(category) {
	var subcat = CATEGORY.list; // tableau listant les sous-catégories
	var catFound = false;
	
	// Suppression des catégories "mères" inutiles
	$('[name="menuCat"]').each(function() {
		var cat = $(this).find('label').html();
		
		if ((!catFound) && ($(this).parent().hasClass("active"))) {
				// Pour récupérer le tableau de sous-catégories correspondant à la catégorie sélectionnée
				// on utilise les catégories de niveau supérieur déjà sélectionnées
				subcat = subcat[cat] || subcat;
		}
		if (cat === category) {
			catFound = true;
			subcat = subcat[cat] || subcat;
			// Modification de l'apparence de la catégorie sélectionnée
			$(this).parent().addClass("active");
		} else if (catFound || !($(this).parent().parent().hasClass("active"))) {
			// Suppression des catégories non-sélectionnées
			$(this).parent().remove();
		};
	});
	// Suppression des catégories "filles"
	$('[name="searchCat"]').each(function() {
		$(this).parent().remove();
	});

	// Affichage des sous-catégories
	CATEGORY.addCategoryMenu(subcat);
}

// Affichage table de résultats de recherche de documents
//--------------------------------------------------------
CATEGORY.displayDocTable = function(div, docs) {
	div.empty();
	div.append(
		'<div class="container-fluid">' +
		'<table class="table table-striped table-hover ">'+		
			'<thead>'+
				'<tr>'+
					'<th class="hideMobile">Nom du document</th>'+
					'<th class="hideMobile">Categorie</th>'+
					'<th class="hideMobile">Note</th>'+ 
					'<th class="hideMobile">Date</th>'+
				'</tr>'+
			'</thead>'+
			'<tbody></tbody>'+
		'</table>'+
		'</div>');
	var table = $('tbody');	
	
	//console.log(docs);

	for (var i=0; i<docs.length; i++) {
		var cat = CATEGORY.arrayToString(docs[i].categorie);

		table.append(
			'<tr onclick="document.location=\'/?&D='+docs[i].idDocument+'&C=Affichage\'" class=clickable>'+
			'<td>'+docs[i].titreDocument+'</td>'+
			'<td>'+cat+'</td>'+
			'<td> 5/5 </td>'+ // CKE TODO
			'<td>'+docs[i].DateModification.slice(0,8)+'</td>'+			
			'</tr>'
			);
	}
}

// Menu Pop-up pour la classification d'un exercice par son auteur
//-----------------------------------------------------------------
CATEGORY.addPopCategory1 = function(div) {

	// Catégories (niveau 1)
	for (var category1 in CATEGORY.list) {
		div.append('<input name="'+category1+'" type="button" class="btn btn-default category" value="'+category1+'"></input>');
	}
}

CATEGORY.addPopCategory2 = function(div, category1) {

	// Catégories (niveau 2)
	for (var category2 in CATEGORY.list[category1]) {
		div.append('<input name="'+category2+'" type="button" class="btn btn-default category" value="'+category2+'"></input>');
	}
}

CATEGORY.addPopCategory3 = function(div, category1, category2) {

	// Catégories (niveau 3)
	for (var category3 in CATEGORY.list[category1][category2]) {
		div.append('<input name="'+category3+'" type="button" class="btn btn-default category" value="'+category3+'"></input>');
	}
}

CATEGORY.addPopCategorie = function(div, jsonDoc) {
	console.log("*** addPopCategorie ***");
    // Conteneur
    var popCategorie =
    '<div id="popCategorie" class="col-xs-12 col-md-12 col-lg-8 popMenu" style="display : none">'+
        '<div id="categories" class="droite15 greybox col-xs-12">'+
            '<label>Catégorie du document</label><br>'+
            '<div name="categories1"></div>'+
            '<div name="categories2"></div>'+
            '<div name="categories3"></div>'+
        '</div>'+
    '</div>';
    div.append(popCategorie);

    // Boutons catégories niveau 1
    var innerDiv = $('#categories'); // récupère la div interne
    CATEGORY.addPopCategory1($('[name="categories1"]'));
    
    // En mode UPDATE, on reprend les catégories déjà définies
    if (jsonDoc && jsonDoc.categorie) {
    if (jsonDoc.categorie[0]) {
    	$('[name="'+jsonDoc.categorie[0]+'"]').addClass('btn-info'); // selection
    }
    if (jsonDoc.categorie[1]) {
    	CATEGORY.addPopCategory2($('[name="categories2"]'), jsonDoc.categorie[0]);
    	$('[name="'+jsonDoc.categorie[1]+'"]').addClass('btn-info'); // selection
    }
    if (jsonDoc.categorie[2]) {
    	CATEGORY.addPopCategory3($('[name="categories3"]'), jsonDoc.categorie[0], jsonDoc.categorie[1]);
    	$('[name="'+jsonDoc.categorie[2]+'"]').addClass('btn-info'); // selection
    }
    }

    // Input mots-clés
    // En mode UPDATE, on reprend les mots-clés déjà définis
    innerDiv.append('<label>Mots clés</label>')
    var tagString = "";
	if (jsonDoc && (jsonDoc.tags)) {
    	for (t = 0; t<jsonDoc.tags.length; t++) {
    		if (t > 0) {tagString += ", "}
    		tagString += jsonDoc.tags[t]; 
    	}
	}
    innerDiv.append('<input type="text" class="labelReponse saisie" name="tags"'+
    	' placeholder="Saisir ici les mots clés séparés par une virgule"'+
    	//' title="Les mots du titre seront automatiquement utilisés comme mots-clés"'+
    	' value="'+tagString+'"><br>');
	
    // Bouton Valider
    innerDiv.append ('<button id="validerCategorie" type="button" class="btn btn-default">Valider</button>');

}

$(document).ready(function(){
	
	// Si le visiteur n'est pas connecté, la sidebar est vide : on y met le menu "Catégories"
	// Si le visiteur est connecté la sidebar présente le menu "Mon Compte"
	if ($('#sidebar').is(':empty')) {
		CATEGORY.createSidebarCategory($("#sidebar"));
	}

	// BOUTONS du Menu Recherche par Catégories
	//---------------------------------------------------
	$("body").on('click', "[name='searchCat']", function(){
		var category = $(this).children('label').html();
		console.log(category);
		if (category === "Tous") {
			category = $('#sidebar').find('.active:last').find('label').html();
		}
		//console.log(category);
		$.ajax({
				type : 'POST',
				data : {category: category},
				url : 'Controller/getDocumentWithCategory.php',
				success: function(reponse){
					if (reponse) {CATEGORY.displayDocTable($("#corp"), $.parseJSON(reponse));}		
				}
			});
		return false;
		// evite le comportement par défaut :
		// ici evite la propagation du click au niveaux de menu supérieurs
	});

	$("body").on('click', "[name='menuCat']", function(){
		console.log("menuCat " + $(this).find('label').html());
		CATEGORY.toSubCategory($(this).find('label').html());
	});

	// Recherche de document par mots-clés
	//---------------------------------------------------
	var getDocumentWithTags = function(tags) {
		// Passage en minuscules
		var lcTags = tags.toLowerCase();
		// TODO CKE : test sur accents, ç,...??
		// recherche si l'un des mots-clés est une catégorie : TBC CKE
		
		// Recherche des documents correspondants
		$.ajax({
				type : 'POST',
				data : {tags: lcTags},
				url  : 'Controller/getDocumentWithTags.php',
				success: function(reponse){
					if (reponse) {CATEGORY.displayDocTable($("#corp"), $.parseJSON(reponse));}
				}
			});
	}
	$("body").on('click', "[name='searchDoc']", function(){
		getDocumentWithTags($(this).parent().find('input').val());
		return false;
		// évite le comportement par défaut : pas de propagation du click au niveaux supérieurs du menu
	});
	$("body").on('keyup', "[name='tagsDoc']", function(touche){
	    var appui = touche.which || touche.keyCode; // le code est compatible tous navigateurs grâce à ces deux propriétés
		if(appui == 13){ 
			getDocumentWithTags($(this).val());
		}
	});

	// BOUTONS du Menu Ajouter une Catégorie
	//----------------------------------------------------
	$("body").on('click', ".category", function(){
		// Efface les sélections précédentes de ce niveau et du niveau inférieur
		$(this).parent().find(".btn").removeClass('btn-info');
		// Modifie l'apparence de la catégorie sélectionnée
		$(this).addClass('btn-info');
		
		if ($(this).parent().attr("name")==="categories1") {
			// Efface les menus précédents de niveaux inférieurs précédemment sélectionnés
			$('[name="categories2"]').html("");
			$('[name="categories3"]').html("");
		
			// Affiche le menu de catégories 2 demandé
			CATEGORY.addPopCategory2($('[name="categories2"]'), $(this).val());

		} else if ($(this).parent().attr("name")==="categories2") {
			// Efface les menus précédents de niveaux inférieurs précédemment sélectionnés
			$('[name="categories3"]').html("");
		
			// Affiche le menu de catégories 2 demandé
			var category1 = $('[name="categories1"]').find('.btn-info').val();
			CATEGORY.addPopCategory3($('[name="categories3"]'), category1, $(this).val());
		}
	});

	$("body").on('click', "#categorie", function(){		
		$("#popCategorie").show();
		showInput($("#popCategorie"));
	});

	$("body").on('click', '#validerCategorie', function(){
		$("#categorie").val(CATEGORY.arrayToString(CATEGORY.inputToArray()));
		postDocument();
		$("#popCategorie").delay(1000).fadeOut();		
	});

})