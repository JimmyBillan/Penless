function showLabel(div, retard){
    div.find("[name^='titre']").prop( "readonly", true );
    div.find("[name^='reponse']").prop( "readonly", true );
    div.find(".form-controlEnonce").addClass("labelEnonce").removeClass("form-controlEnonce");
    div.find(".form-controlReponse").addClass("labelReponse").removeClass("form-controlReponse");    
    div.find("[name^='modifier']").show(retard);  
    div.find("[name^='plus']").hide(retard); 
    div.find("[name^='valider']").hide(retard);    
}
function showInput(div, retard){
    div.find("[name^='titre']").prop( "readonly", false );
    div.find("[name^='reponse']").prop( "readonly", false );
    div.find(".labelEnonce").addClass("form-controlEnonce").removeClass("labelEnonce");
    div.find(".labelReponse").addClass("form-controlReponse").removeClass("labelReponse");    
    div.find("[name^='modifier']").prop( "readonly", true );//hide(retard); // CKE : ne marche pas ??  A TESTER
    div.find("[name^='plus']").show(retard); 
    div.find("[name^='valider']").show(retard);      
}
function showForEleve(div, retard){
    div.find("[name^='titre']").prop( "readonly", true );
    div.find("[name^='reponse-Qcm']").prop( "readonly", true );
    div.find(".form-controlEnonce").addClass("labelEnonce").removeClass("form-controlEnonce");
    div.find("[typeexo='Qcm']").find("[name^='reponse']").addClass("labelReponse").removeClass("form-controlReponse"); 
    div.find("[typeexo='QuestionSimple']").find("[name^='reponse']").addClass("form-controlReponse").removeClass("labelReponse").val('');
    //div.find("[name^='OK']").prop('ckecked',false).checkboxradio("refresh"); // ne marche pas
    //div.find("[name^='OK']").removeAttr('ckecked');
}

// !!! L'attribut "name" se retrouve dans le JSON !!!
/////////////////////////////////////////////////////

// Il existe 3 cas :
// cas "CREATE" -> création du document                  : affichage input + bouton Valider + bouton Supprimer
// cas "UPDATE" -> modification du document par l'auteur : label pré-rempli + bouton Modifier + bouton Supprimer
// cas "READ"   -> affichage du document pour l'élève    : label pré-rempli

var addFormTitreDoc = function (div, mode, jsonDoc) {
    

    var valueTitre = '';
    if (jsonDoc) {valueTitre = jsonDoc["titreDocument"];}    

    var formTitre =
        '<div id="TitreDoc" class="col-lg-10 col-md-10 col-sm-9 col-xs-12">'+
            //'<label name="labelTitreDoc" class="col-xs-12">'+valueTitre +'</label>';
        '<input type="text" placeholder="Titre du Document" name="titreDocument" class="form-controlEnonce" value="'+valueTitre +'">';

    if ((mode === "CREATE")||(mode === "UPDATE")) {
        formTitre +=
            '<span type="submit" name="validerTitreDoc" class="glyphiconSupprimerQuestion glyphicon-chevron-right" title="Valider"></span>'+
            '<span type="submit" name="modifierTitreDoc" class="glyphiconSupprimerQuestion glyphicon-edit" title="Modifier"></span>';
    } else {
        formTitre += '<input type="submit" id="Corriger" class="btn btn-default" value="Corriger">';
    }

    formTitre += '</div>';

    div.append(formTitre); 
}

var addMenus = function(div, mode) {

    if (mode === "UPDATE") {displayStyle = 'style="display : inline-block"';}
    else if (mode === "CREATE") {displayStyle = 'style="display : none"';}

    var menus = 
    '<div id="row" class="top10 col-xs-12">'+
        '<div class="col-lg-12 col-sm-12 col-xs-12 ">'+
            // Menu Deroulant "Ajouter un élément"
            '<select name="new_element" id="new_element" class="btn btn-default" '+displayStyle+'>'+
                '<option id="vide">Ajouter un élément</option>'+
                '<option id="qcm" value="Qcm">QCM</option>'+
                '<option id="qs" value="QuestionSimple">Question Simple</option>'+      
            '</select>'+
            // Bouton "partager"
            '<input type="button" id="partager" class="btn btn-default" value="Partager" '+displayStyle+'>'+
        '</div>'+
    '</div>';
    div.append(menus);
}

var addPopPartage = function(div) {
    var popPartage =
    '<div id="popPartager" class="col-xs-12 col-md-12 col-lg-8" style="display : none">'+
        '<div  class="popPartager droite15 greybox col-xs-12">'+
            '<label>Parametre de confidentialité</label>'+
            '<div class="radio">'+
                '<label>'+
                '<input type="radio" name="optionsRadios" id="optionsRadios1" value="privee" checked> Privé'+
                '</label>'+
            '</div>'+
            '<div class="radio">'+
                '<label>'+
                '<input type="radio" name="optionsRadios" id="optionsRadios2" value="public"> Public'+
                '</label>'+
            '</div>'+
            '<input type="text" class="form-controlEnonce"name="groupecontactpartage" placeholder="Contact/s ou groupe/s"><br>'+
            '<button id="annulerpopPartager" type="button" class="btn btn-default">Annuler</button>'+
            '<button id="validerpopPartager" type="button" class="btn btn-default">Valider</button>'+
            '<div id="textNotifyPopPartager"></div>'+
        '</div>'+
    '</div>';
    div.append(popPartage);
}

var addBlockExos = function (div) {
    div.append('<div id="blockQuestion" class="col-xs-12 col-md-12 col-lg-8" style="display: block"></div>');
}

var addFormDocHeader = function (div, mode, jsonDoc) {
	// En-tête du nouveau document	
	// !!! Attention pas de saut de ligne après return (";"" inséré automatiquement par JS)!!!
	var header =
    '<div class="col-sm-9 col-md-10 col-xs-12">'+ //CKE Supprimer qq niveaux de div ?...
    	'<div id="row" class="droite15">'+
        	'<div id="doc" style="display: block">'+
               	'<div id="entetecreationelement" class="col-xs-12 col-md-12 col-lg-8 navbar-fixed-enteteCreation">'+                		
                '</div>'+
                // LabelGeneral : utilisé pour affichage general // CKE voir quand on s'en sert
                '<label id="LabelGeneral" style="display : block"></label>'+ 
                // Block qui contiendra les exercices/questions
            '</div>'+
        '</div>'+
    '</div>';
    
    $("#corp").append(header);

    addFormTitreDoc($("#entetecreationelement"), mode, jsonDoc);

    if ((mode === "CREATE")||(mode === "UPDATE")) {
        addMenus($("#entetecreationelement"), mode);
        addPopPartage($("#doc"));
    }

    addBlockExos($("#doc"));
}

var addFormQuestion = function (data){
    // data = (div, mode, idExo, typeExo, question)
    // cas création du document : affichage d'un bouton valider
    // cas modification d'un document existant : titre pré-rempli et pas de bouton
    ////console.log("***addFormQuestion***");
    ////console.log(data);
    
    // Calcul idExo
    // Si l'id existe (doc existant), on l'utilise
    // Sino (doc en cours de création ou modification), on récupère l'id de la dernière réponse et on l'incrémente
    //-------------------------------------------------------------------------------------------------------------
    if (!data.idExo) {
        var lastExo = data.div.find('[name^="exo"]:last');
        //var lastExo = data.div.find('[name^="exo"]');
        ////console.log("div last Exo : ")
        ////console.log(lastExo);
        if (lastExo.length===0) {
            data.idExo = "exo1";
        } else {
            var lastExoIndex = lastExo.attr("name").substring(3);
            lastExoIndex++
            data.idExo = "exo"+ lastExoIndex;
        }
        ////console.log("new exo id = "+data.idExo);
    } 

    // Valeur de la question
    //---------------------------
    var valueQuestion = '';
    if (data.question) {valueQuestion = data.question;} 

	var q = 
        '<div name="'+data.idExo+'" typeexo="'+data.typeExo+'"class="droite15 greybox col-xs-12" style="display : block">'+
        '<input name="titreExo" type="text" placeholder="Saisir la question" class="form-controlEnonce col-xs-11" value="'+valueQuestion+'">';

    if ((data.mode === "CREATE")||(data.mode === "UPDATE")) {
        q +=
        '<span name="supprimer" class="glyphiconSupprimerQuestion glyphicon-remove" aria-hidden="true" type="submit" title="Supprimer l\'exercice"></span>'+
        '<span name="modifier" class="glyphiconSupprimerQuestion glyphicon-edit" aria-hidden="true" type="submit" title="Mofifier l\'exercice"></span>'+
        '<input name="plusReponse" class="btn btn-default"  type="submit" value="Ajouter une reponse">'+         
        '<label id="labelErreur"></label>';
        // CKE : pas besoin d'identifier les "supprimer", "modifier", "plusReponse" : on accède directement au div parent
    }
    // CKE : créer un div blockreponses?
    q += '</div>';
    data.div.append(q);
}

var addFormReponse = function(data){
    // data = (div, idReponse, mode, reponse, typeExo, CBOK)
    ////console.log("***addFormReponse***");
    ////console.log(data);
    
    // Calcul idReponse : 
    // Si l'id existe (doc existant), on l'utilise
    // Sino (doc en cours de création ou modification), on récupère l'id de la dernière réponse et on l'incrémente
    //-------------------------------------------------------------------------------------------------------------
    if (!data.idReponse) {
        var lastReponse = data.div.find('[name^="reponse"]:last');
        if (lastReponse.length===0) {
            // Première réponse
            data.idReponse = "reponse-1";
        } else {
            // Il existe déjà des réponses pour cet exerciec
            //console.log(lastReponse);
            var lastIndex = lastReponse.attr("name").substring(8);
            lastIndex ++;
            data.idReponse = "reponse-" + (lastIndex);
        }
    }
    //console.log("new id = " + data.idReponse);
    
    // Valeur de la réponse
    //---------------------
    var valueReponse = '';
    if ((data.reponse)&&((data.mode !== "READ")||data.div.attr("typeexo")==="Qcm")) {valueReponse = data.reponse;}
    //console.log("typeExo = " + data.div.attr("typeexo"));

    // Construction du formulaire de réponse
    //--------------------------------------
    var reponse = 
        '<div name="div'+data.idReponse+'" type="CB" class="col-xs-11 checkbox reponseCheckbox">';  // type CB utilisé dans Supprimer réponse

    // Checkbox pour les QCM
	if (data.div.attr("typeexo") === "Qcm") {
        var CBchecked = '';
        if ((data.CBOK)&&(data.mode !== "READ")) {CBchecked = "checked";}        
        reponse += '<input name="OK-'+data.idReponse+'" class="cbQCM" type="checkbox" '+ CBchecked+' >';
    }

    reponse += '<input name="'+data.idReponse+'" type ="text" class="form-controlReponse" value="'+valueReponse+'" placeholder="Saisir la reponse">';
    // Bouton Supprimer
    if ((data.mode === "CREATE")||(data.mode === "UPDATE")) {
        reponse +=   		   
   		   '<span name="supprimerReponse" class="glyphiconSupprimerReponse glyphicon-remove" aria-hidden="true"></span>';
    } else {
        reponse +=
            '<span name="Validation"></span>'+
            '<label name="Correction"></label>';
    }

 	reponse += '</div>';

    data.div.append(reponse);    
}


var afficheDoc = function (div, mode, jsonDoc){
    //console.log("****afficheDoc****");
    //console.log(jsonDoc);
    //console.log(mode)
    addFormDocHeader(div, mode, jsonDoc);

    $.each(jsonDoc, function(key, val){ // On parcourt le document
        //console.log(key + " " + val);

        if (key.substring(0,3) === "exo"){ // à la recherche des questions CKE : virer le # si possible
            // Test sur le type de la question : QCM, QS, ... 
            idExo = key;
            var nextCBisOK = false;
            $.each(val, function(index, value) {
                //console.log("   " + index + " " + value);
                /// Enonce / Question ///
                if (index.substring(0,8)=== "titreExo"){
                    var details = index.split("-");              
                    addFormQuestion({ //div, mode, idExo, typeExo, question
                        div      : $("#blockQuestion"),
                        idExo    : key,
                        typeExo  : jsonDoc[key]["typeExo"],//details[1],
                        mode     : mode,
                        question : value});
                   
                }
                if (index.substring(0,7) === "reponse"){
                    var details = index.split("-");   
                    addFormReponse({
                        div       : $('[name="'+key+'"]'),
                        idReponse : index,
                        mode      : mode,
                        reponse   : value,
                        //typeExo   : details[1],
                        CBOK      : nextCBisOK});
                   nextCBisOK = false;
                }
                
                if (index.substring(0,2) === "OK") {
                    // indique que la prochaine CBinput est une réponse juste
                    nextCBisOK = true;
                }

            });
        }
    });
    
    switch (mode) {
        case "CREATE" : {
            showInput(div, 0); break;}
        case "UPDATE" : {
            showLabel(div, 0); break;} 
        case "READ" : {
            showForEleve(div, 0); break;} 
        }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   CORRECTION EXERCICE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var removeIcon = function(elem) {elem.removeClass("glyphiconVert glyphiconRouge glyphicon-ok glyphicon-remove glyphicon-unchecked");}
var setIconOK = function(elem) {elem.addClass("glyphiconVert glyphicon-ok");}
var setIconKO = function(elem) {elem.addClass("glyphiconRouge glyphicon-remove");}
var setIconCBOK = function(elem, c) {
            if (c) {elem.addClass("glyphiconVert glyphicon-ok");}
            else {elem.addClass("glyphiconVert glyphicon-unchecked");}}
var setIconCBKO = function(elem, c) {
            if (c) {elem.addClass("glyphiconRouge glyphicon-ok");}
            else {elem.addClass("glyphiconRouge glyphicon-unchecked");}}

var afficheCorrectionExo = function(divExo, jsonExo) {
    var reponseIsOK;
    //console.log(divExo);
    //console.log(jsonExo);

    switch (jsonExo.typeExo) {

        case "QuestionSimple": {

            var reponseEleve = divExo.find("[name^='reponse']");
            var correction   = divExo.find("[name='Correction']"); 
            var validation   = divExo.find("[name='Validation']"); 
            reponseIsOK = false;
            var bonneReponse = "";
            ////console.log(reponseEleve[0].value);
            if ((reponseEleve.length === 0)||(reponseEleve.val() === "")) {
                correction.html("Réponse attendue!"); 
            }
            else {
                removeIcon(validation);
                // Il peut y avoir plusieurs réponses valides, donc on parcourt ce set de réponses
                $.each(jsonExo, function(key,val) {
                    if (key.substring(0,7) === "reponse") {
                        bonneReponse = val;
                        if (reponseEleve.val() === bonneReponse) {
                            setIconOK(validation);
                            correction.html("Réponse exacte");
                            reponseIsOK = true;
                        }
                    }
                })
                
                if (!reponseIsOK) {
                    setIconKO(validation);
                    correction.html("La bonne réponse est : <em>"+bonneReponse[0]+"</em>");
                }
            }
            break;
        }
        case "Qcm" : {
        
            reponseIsOK = true;

            var reponseEleve = divExo.find("[name^='divreponse']");

            reponseEleve.each(function(index, elemReponse){
                var idReponse      = $(elemReponse).find("[name^='reponse']").attr("name");
                var reponseChecked = $(elemReponse).find("[name^='OK']").prop("checked");
                var validation     = $(elemReponse).find("[name='Validation']");
                var reponseToCheck = (jsonExo["OK-"+idReponse]==="on");
                removeIcon(validation);
                
                if ((reponseChecked) === reponseToCheck) {
                    // Bonne réponse
                    setIconCBOK(validation, reponseToCheck);
                    if (jsonExo["OK-"+idReponse]) {
                        // On ne met l'icone OK que si la réponse est juste et a été cochée par l'élève
                        // On ne met pas d'icone si la réponse est mauvaise et que l'élève ne l'a pas cochée
                        setIconOK(validation);
                    }
                }
                else{
                    setIconCBKO(validation, reponseToCheck);
                    reponseIsOK = false
                }
            }); 
            break;
        }
        //return reponseIsOK; // Pour future notation 
    };

}

var afficheCorrectionDoc = function(jsonDoc) {
    //console.log("**** afficheCorrection ****");
    //console.log(jsonDoc);
    for (var i = 1; i<= jsonDoc["nbExo"]; i++) {
        // Si les idExo sont non-consécutifs (non-renumérotés), utiliser une boucle $.each à la place de la boucle for(i)
        //console.log("*** Correction exo"+i+" ******");
        afficheCorrectionExo($('[name="exo'+i+'"]'), jsonDoc["exo"+i]);
        }
}