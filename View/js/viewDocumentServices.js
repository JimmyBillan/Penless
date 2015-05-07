function showLabel(div, retard){
    div.find("[name^='titre']").prop( "readonly", true );
    div.find("[name^='reponse']").prop( "readonly", true ); 
    div.find(".saisie").removeClass("saisie");   
    div.find("[name^='modifier']").show(retard);  
    div.find("[name^='plus']").hide(retard); 
    div.find("[name^='valider']").hide(retard);    
}
function showInput(div, retard){
    div.find("[name^='titre']").prop( "readonly", false );
    div.find("[name^='reponse']").prop( "readonly", false );    
    div.find(".labelTitre, .labelEnonce, .labelReponse").addClass("saisie");  
    div.find("[name^='modifier']").hide(retard);
    div.find("[name^='plus']").show(retard); 
    div.find("[name^='valider']").show(retard);      
}
function showForEleve(div, retard){
    div.find("[name^='titre']").prop( "readonly", true );
    div.find("[name^='reponse-Qcm']").prop( "readonly", true );
    div.find(".saisie").removeClass("saisie");
    div.find("[typeexo='Qcm']").find("[name^='reponse']").removeClass("saisie"); 
    div.find("[typeexo='QuestionSimple']").find("[name^='reponse']").addClass("saisie").val('');
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
        '<div id="TitreDoc">'+// class="col-lg-10 col-md-10 col-sm-9 col-xs-12">'+
        '<input type="text" placeholder="Titre du Document" name="titreDocument" class="labelTitre saisie" value="'+valueTitre +'">';

    if ((mode === "CREATE")||(mode === "UPDATE")) {
        formTitre +=
            '<span type="submit" name="validerTitreDoc" class="glyphiconDoc glyphicon-ok" title="Valider"></span>'+
            '<span type="submit" name="modifierTitreDoc" class="glyphiconDoc glyphicon-edit" title="Modifier" style="display: none;"></span>';
    } else {
        formTitre += '<input type="submit" id="Corriger" class="btn btn-default" value="Corriger">';
    }

    formTitre += '</div>';

    div.append(formTitre); 
}

var addMenus = function(div, mode, jsonDoc) {
    
    var displayStyle = 'style="display : none"';
    var labelPartage = "Partager";
    var labelCategorie = "Catégorie";

    if (mode === "UPDATE") {
        displayStyle = 'style="display : inline-block"';
        labelPartage = jsonDoc.confident;
        if (jsonDoc.categorie) {labelCategorie = CATEGORY.arrayToString(jsonDoc.categorie);}
    }
    
    var menus = 
    '<div id="row" class="top10 col-xs-12">'+
            // Menu Deroulant "Ajouter un élément"
            '<select name="new_element" id="new_element" class="btn btn-default" '+displayStyle+'>'+
                '<option id="vide">Ajouter un élément</option>'+
                '<option id="qcm" value="Qcm">QCM</option>'+
                '<option id="qs" value="QuestionSimple">Question Simple</option>'+ 
                '<option id="editeurHtml" value="editeurHtml"> Editeur </option>'+     /* 2703jimmy */
            '</select>'+
            // Bouton "partager"
            '<input type="button" id="partager" class="btn btn-default" value="'+labelPartage+'" '+displayStyle+'>'+
            // Bouton "Catégorie"
            '<input type="button" id="categorie" class="btn btn-default" value="'+labelCategorie+'" '+displayStyle+'>'+
    '</div>';
    div.append(menus);
}



var addBlockExos = function (div) {
    div.append('<div id="blockQuestion" class="col-xs-12 col-md-12 col-lg-8" style="display: block"></div>');
}

var addFormDocHeader = function (div, mode, jsonDoc) {
    // En-tête du nouveau document  
    var header =
        '<div id="doc" class="droite15" style="display: block">'+
            '<div id="docHeader" class="col-xs-12 col-md-12 col-lg-8 navbar-fixed-enteteCreation">'+                        
                // LabelGeneral : utilisé pour affichage general 
                '<label id="LabelGeneral" style="display : block"></label>'+
            '</div>'+
        '</div>';
    
    div.append(header);

    addFormTitreDoc($("#docHeader"), mode, jsonDoc);

    if ((mode === "CREATE")||(mode === "UPDATE")) {
        addMenus($("#docHeader"), mode, jsonDoc);
        PARTAGE.addPopPartage($("#doc"), mode, jsonDoc);
        // document en mode privé par défaut à la création et à la Modification
        // Un doc en cours de modification n'est donc plus accessible
        CATEGORY.addPopCategorie($("#doc"), jsonDoc);
    }

    addBlockExos($("#doc"));
}


/********************************
  classe pour l'editeur d'article
********************************/
var anEditorExist = false;

var editeurArticle = function(idexo, typeexo){
    editeurArticle.htmlEditorWysi = "";
    editeurArticle.q = "";
    editeurArticle._idexo =idexo; 
    editeurArticle._typeexo =typeexo;
    editeurArticle.HTTPGETHTML();
};

editeurArticle.HTTPGETHTML = function(){
      $.ajax({
            url: 'View/php/wysihtml5.html',
            type: 'GET',
            dataType: 'html',
            async : false
        })
        .done(function(data) {
         editeurArticle.SET_htmlEditorWysi(data);
         editeurArticle.APPEND_dataDIV();
        })
}

editeurArticle.SET_htmlEditorWysi = function (data){
    editeurArticle.htmlEditorWysi = data;
}

editeurArticle.APPEND_dataDIV = function(){

    this.q ='<div name="'+editeurArticle._idexo+'" typeexo="'+editeurArticle._typeexo+'"class="droite15 greybox col-xs-12 quill-wrapper" style="display : block">'+ editeurArticle.htmlEditorWysi+'</div>';
}

var editor; 

var addFormQuestion = function (data){
    // data = (div, mode, idExo, typeExo, question)
    
    // Calcul idExo
    // Si l'id existe (doc existant), on l'utilise
    // Sino (doc en cours de création ou modification), on récupère l'id de la dernière réponse et on l'incrémente
    //-------------------------------------------------------------------------------------------------------------
    if (!data.idExo) {
        var lastExo = data.div.find('[name^="exo"]:last');
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
    if(data.typeExo === 'editeurHtml'){

        if(!anEditorExist){/*On verifie qu'un editeur n'est pas déjà crée*/
           
           if ((data.mode === "CREATE")||(data.mode === "UPDATE")) {
            var OediteurArticle = new editeurArticle(data.idExo, data.typeExo);
            data.div.append(editeurArticle.q);

            editor = new wysihtml5.Editor("wysihtml5-textarea", { 
              toolbar:      "wysihtml5-toolbar", 
              parserRules:  wysihtml5ParserRules 
            });

            anEditorExist = true;            
            console.log("creation editeur terminée");
            
            // Cas 'UPDATE', on restitue le texte enregistré
            if (data.question) { 
                console.log("Ajoute contenu à éditer : ");
                console.log(data.question)
                editor.setValue(data.question);
            };        
            }
            else { // mode READ
                if (data.question) {
                var q = '<div id="editor" name="'+data.idExo+'" typeexo="'+data.typeExo+'"class="droite15 greybox col-xs-12" style="display : block">'+
                    data.question+'</div>';
                data.div.append(q);
                }
            }
        }else{
            alert("Un seul editeur html par document.");
        }
    }
    else
    {
                var valueQuestion = '';
                if (data.question) {valueQuestion = data.question;} 

                var q = 
                    '<div name="'+data.idExo+'" typeexo="'+data.typeExo+'"class="droite15 greybox col-xs-12" style="display : block">'+
                    '<input name="titreExo" type="text" placeholder="Saisir la question" class="labelEnonce saisie" value="'+valueQuestion+'">';

                if ((data.mode === "CREATE")||(data.mode === "UPDATE")) {
                    // Les styles d'affichage par défaut sont ceux pour le mode CREATE
                    q +=
                    '<span name="valider"   class="glyphiconQuestion glyphicon-ok"     type="submit" title="Valider l\'exercice" style="display: inline-block;"></span>'+
                    '<span name="modifier"  class="glyphiconQuestion glyphicon-edit"   type="submit" title="Mofifier l\'exercice" style="display: none;"></span>'+
                    '<span name="supprimer" class="glyphiconQuestion glyphicon-remove" type="submit" title="Supprimer l\'exercice"></span>'+
                    '<input name="plusReponse" class="btn btn-default"  type="submit" value="Ajouter une reponse">'+
                    '<input name="plusImage" class="btn btn-default"  type="submit" value="Ajouter une image">'+         
                    '<label name="labelErreur" style="color:red"></label>';
                    // Il n'est pas nécessaire d'identifier les "supprimer", "modifier", "plusReponse" : on accède directement au div parent
                }
                
                q += '</div>';
                data.div.append(q);
    }
    
}

var addFormReponse = function(data){
    // data = (div, idReponse, mode, reponse, CBOK)
    
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
        '<div name="div'+data.idReponse+'" type="CB" class="col-xs-12 checkbox reponseCheckbox">';  // type CB utilisé dans Supprimer réponse

    // Checkbox pour les QCM
    if (data.div.attr("typeexo") === "Qcm") {
        var CBchecked = '';
        if ((data.CBOK)&&(data.mode !== "READ")) {CBchecked = "checked";}        
        reponse += '<input name="OK-'+data.idReponse+'" class="cbQCM" type="checkbox" '+ CBchecked+' >';
    }

    reponse += '<input name="'+data.idReponse+'" type ="text" class="labelReponse saisie" value="'+valueReponse+'" placeholder="Saisir la reponse">';
    // Bouton Supprimer
    if ((data.mode === "CREATE")||(data.mode === "UPDATE")) {
        reponse +=             
           '<span name="supprimerReponse" class="glyphiconReponse glyphicon-remove"></span>';
    } else {
        reponse +=
            '<span name="Validation" class="glyphiconReponse"></span>'+
            '<label name="Correction"></label>';
    }

    reponse += '</div>';

    data.div.append(reponse);    
}


var afficheDoc = function (div, mode, jsonDoc){
    div.empty();
    addFormDocHeader(div, mode, jsonDoc);

    $.each(jsonDoc, function(key, val){ // On parcourt le document
        //console.log(key + " " + val);

        if (key.substring(0,3) === "exo"){ // à la recherche des questions CKE : virer le # si possible
            // Test sur le type de la question : QCM, QS, ... 
            idExo = key;
            var nextCBisOK = false;
            $.each(val, function(index, value) {

                /// Enonce / Question ///
               
                if (index === "contenu"){ 
                    addFormQuestion({
                        div      : $("#blockQuestion"),
                        idExo    : key,
                        typeExo  : jsonDoc[key]["typeExo"],//="editeurHtml"
                        mode     : mode,
                        question : value});
                }
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
//   VERIFICATION EXERCICE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var checkExo = function(divExo) {

    var isOK = true; 
    var question    = divExo.find("[name^='titreExo']");
    var reponses    = divExo.find("[name^='reponse']");
    var labelErreur = divExo.find("[name='labelErreur']");
    labelErreur.html("");

    if (question.val() === "") {
        isOK = false;
        labelErreur.html("Vous devez renseigner ou supprimer la question.").show();
    } else {
    switch (divExo.attr("typeExo")) {

        case "Qcm" : {
            // Il faut au moins 1 réponse juste et 1 réponse fausse 
            var checkedReponses = divExo.find(":checked");
            if ((reponses.length < 2)||((checkedReponses.length === 0)||(checkedReponses.length === reponses.length))) {
                isOK = false;
                labelErreur.html("Vous devez saisir au moins une réponse juste et une réponse fausse.").show();
            }
            if (isOK) {
                reponses.each(function(){
                    if ($(this).val() === "") {
                        isOK = false;
                        labelErreur.html("Vous devez renseigner ou supprimer les réponses vides.").show();
                    }
                });
            }
            break;
        }
        case "QuestionSimple" : {
            // Il faut au moins une réponse non-nulle
            if ((reponses.length === 0)||(reponses.val() === "")) {
                isOK = false;
                labelErreur.html("Vous devez saisir une réponse.").show();
            }
            break;
        }
    }
    }
    return isOK;
}

var checkDocument = function() {
    var docOK = true;
    if (CATEGORY.inputToArray().length === 0) {
        $("#textNotifyPopPartager").html("Vous devez renseigner la catégorie de l'exercice.");
    }
    $("#blockQuestion").find('[name^="exo"]').each(function() {
        var exoOK = checkExo($(this));
        if (!exoOK) {docOK = false}
    });
    return docOK;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   CORRECTION EXERCICE
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var removeIcon = function(elem) {elem.removeClass("glyphiconVert glyphiconRouge glyphicon-ok glyphicon-remove");}// glyphicon-unchecked");}
var setIconOK = function(elem) {elem.addClass("glyphiconVert glyphicon-ok");}
var setIconKO = function(elem) {elem.addClass("glyphiconRouge glyphicon-remove");}
var setIconCBKO = function(elem, shouldBeChecked) {
            if (shouldBeChecked) {elem.addClass("glyphiconRouge glyphicon-ok");}
            else {elem.addClass("glyphiconRouge glyphicon-remove");}}

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
                setIconKO(validation);
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
                    if (reponseToCheck) {
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