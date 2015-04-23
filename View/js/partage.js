var PARTAGE = {};

PARTAGE.addPopPartage = function(div, mode, jsonDoc) {
    
    var popPartage =
    '<div id="popPartager" class="col-xs-12 col-md-12 col-lg-8 popMenu" style="display : none">'+
        '<div  class="droite15 greybox col-xs-12">'+
            '<label>Visibilité du document</label>'+
            '<div class="radio">'+
                '<label>'+
                '<input type="radio" name="optionsVisibilite" id="visibilitePrive" value="Privé"> Privé'+
                '</label>'+
            '</div>'+
            '<div class="radio">'+
                '<label>'+
                '<input type="radio" name="optionsVisibilite" id="visibiliteRestreint" value="Partagé"> Partagé'+
                '</label>'+
            '</div>'+
            '<div class="radio">'+
                '<label>'+
                '<input type="radio" name="optionsVisibilite" id="visibilitePublic" value="Public"> Public'+
                '</label>'+
            '</div>'+
            '<button id="annulerpopPartager" type="button" class="btn btn-default">Annuler</button>'+
            '<button id="validerpopPartager" type="button" class="btn btn-default">Valider</button>'+
            '<div id="textNotifyPopPartager"></div>'+
        '</div>'+
    '</div>';
    div.append(popPartage);

    if (mode === 'CREATE') {
        $('#visibilitePrive').attr('checked', 'checked');
    } else {
        // mode UPDATE
        switch (jsonDoc.confident) {
            case "Privé"  : {$('#visibilitePrive').attr('checked', 'checked'); break;}
            case "Public" : {$('#visibilitePublic').attr('checked', 'checked'); break;}
            case "Partagé" : {
                $('#visibiliteRestreint').attr('checked', 'checked');
                PARTAGE.jsonDoc = jsonDoc;
                PARTAGE.addPopPartageRestreint();
                break;
            }
        }
    }
}

PARTAGE.addPopPartageRestreint = function() {
    var divPartage = 
        '<div id="partageRestreint">'+
        '<div id="sharingContacts" class="form-inline"></div>'+
        '<div class="input-group">'+
        //'<datalist id="listContacts"></datalist>'+ // HTML5 : résultat dépendant du navigateur 
        '<span class="input-group-addon glyphicon glyphicon-plus"></span>'+
        '<input type="text" class="form-control" id="userContact" placeholder="Ajouter un contact">'+
        '</div>'+
        '<ul id="userContactSubList"></ul>'+
        '<div id="sharingGroups" class="form-inline"></div>'+
        '<div class="input-group">'+
        '<span class="input-group-addon glyphicon glyphicon-plus"></span>'+
        '<select id="userGroup" class="form-control" placeholder="Ajouter un contact">'+
        '<option>Ajouter un groupe</option>'+
        '</select>'+
        '</div>'+
        '</div>';

    $('#visibiliteRestreint').parent().after(divPartage);

    $.ajax({type   : 'GET',
            url    : 'Controller/getContact.php',
            success: function(reponse){
                PARTAGE.contacts = $.parseJSON(reponse);

                // Cas Modification du document :
                // On doit afficher les contacts déjà enregistrés en partage 
                // PARTAGE.jsonDoc est le doc reçu de la BD
                if (PARTAGE.jsonDoc.sharingContacts) {
                    // Reformatage contacts : {idUrl : nom}
                    var contacts = {}
                    for (var c=0; c<PARTAGE.contacts.length; c++) {
                        contacts[PARTAGE.contacts[c].idUrl] = PARTAGE.contacts[c].prenom + ' ' + PARTAGE.contacts[c].nom;
                    }
                    
                    for (var i=0; i<PARTAGE.jsonDoc.sharingContacts.length; i++) {
                        PARTAGE.addSharingContact({idUrl : PARTAGE.jsonDoc.sharingContacts[i],
                                                   nom   : contacts[PARTAGE.jsonDoc.sharingContacts[i]]});
                    }
                }
            }
        });

    
    $.ajax({type   : 'GET',
            url    : 'Controller/getlistofmyGroup.php',
            success: function(reponse){
            console.log("GROUPS");
            PARTAGE.groups = $.parseJSON(reponse);
            
            console.log(PARTAGE.groups);
            for (var i=0; i<PARTAGE.groups.length; i++) {
                $('#userGroup').append('<option idGroup="'+PARTAGE.groups[i].idGroupe+'">'+PARTAGE.groups[i].nom+'</option>');
            }
            // Cas Modification du document :
            // On affiche les contacts déjà enregistrés en partage
            if (PARTAGE.jsonDoc.sharingGroups) {
                var groups = {};
                for (var g=0; g<PARTAGE.groups.length; g++) {
                    groups[PARTAGE.groups[g].idGroupe] = PARTAGE.groups[g].nom; 
                }
                
                for (var i=0; i<PARTAGE.jsonDoc.sharingGroups.length; i++) {
                    PARTAGE.addSharingGroup({idGroup : PARTAGE.jsonDoc.sharingGroups[i],
                                             nom     : groups[PARTAGE.jsonDoc.sharingGroups[i]]});
                }
            } 
        }
    });
}

PARTAGE.addSharingContact = function(contact) {
    // Test si le contact n'existe pas déjà
    isNew = true;
    $('#sharingContacts').find('input').each(function() {
        if ($(this).attr("idUrl") === contact.idUrl) {isNew = false}
    });
    if (isNew) {
        var button  = '<div class="input-group">'+
        '<span name="removeSharing" class="input-group-addon glyphicon glyphicon-remove"></span>'+
        '<input type="button" idUrl="'+contact.idUrl+'" class="btn btn-default" value="'+contact.nom+'"></input>'+
        '</div>';
        // NB : On utilise name="removeSharing" au lieu de id, car il y en a plusieurs instances
        //      Un id doit être unique.
        $("#sharingContacts").append(button);
    }
}

PARTAGE.getSharingContacts = function() {
    var contactArray = [];
    $('#sharingContacts').find('input').each(function() {
        //console.log($(this))
        contactArray[contactArray.length]= $(this).attr("idUrl");
    });
    return contactArray;
}

PARTAGE.addSharingGroup = function(group) {
    // Test si le contact n'existe pas déjà
    isNew = true;
    $('#sharingGroups').find('input').each(function() {
        if ($(this).attr("idGroup") === group.idGroup) {isNew = false}
    });
    if (isNew) {
        var button  = '<div class="input-group">'+
        '<span name="removeSharing" class="input-group-addon glyphicon glyphicon-remove"></span>'+
        '<input type="button" idGroup="' +group.idGroup+'" class="btn btn-default" value="'+group.nom+'"></input>'+
        '</div>';

        $("#sharingGroups").append(button);
    }
}

PARTAGE.getSharingGroups = function() {
    var groupArray = [];
    $('#sharingGroups').find('input').each(function() {
        //console.log($(this))
        groupArray[groupArray.length]= $(this).attr("idGroup");
    });
    return groupArray;
}

PARTAGE.getVisibilityClass = function() {
    return $('input[name=optionsVisibilite]:checked', '#popPartager').val()
}

PARTAGE.addContactSubList = function() {
    var letters = $("#userContact").val().toLowerCase();
    var length = letters.length;
    var sublist = "";
    if(letters.length > 0){
        for (var i = 0; i < PARTAGE.contacts.length; i++) {
            if ((letters === PARTAGE.contacts[i].nom.substring(0,letters.length))|| 
                (letters === PARTAGE.contacts[i].prenom.substring(0,letters.length))) {
                sublist += '<li class="form-control" idUrl="'+ PARTAGE.contacts[i].idUrl+'">'
                            +PARTAGE.contacts[i].prenom+' '+PARTAGE.contacts[i].nom+'</li>';
            }   
        }
    }

    $('#userContactSubList').append(sublist);
}

$(document).ready(function(){

    //BOUTONS "Partager"
    //---------------------------------------------------
    $("body").on('click', "#partager", function(){
        showInput($("#popPartager"));
        $("#popPartager").show();
        $("#textNotifyPopPartager").html("");
    });

    $("body").on('click', '#annulerpopPartager', function(){
        $("#popPartager").hide();
    });

    $("body").on('click', '#validerpopPartager', function(){
        $("#textNotifyPopPartager").html("");   
        var docOK = checkDocument();
        $("#partager").val($('input[name=optionsVisibilite]:checked').val());           
        if (docOK) {
            postDocument();
            $("#textNotifyPopPartager").html('<b>Sauvegarde effectuée</b>');
            $("#popPartager").delay(1000).fadeOut();
        } else {
            $("#textNotifyPopPartager").append("<span style='color:red'><br><b>Il existe une erreur dans vos exercices</b></span>");
        }
    });

    $("body").on('change', '[name^="optionsVisibilite"]', function() {
        
        if ($('#visibiliteRestreint').is(':checked')) {
            PARTAGE.addPopPartageRestreint();
        } else {
            $('#partageRestreint').remove();
        }
    });

    $("body").on('keyup', '#userContact', function() {
        PARTAGE.addContactSubList();
    });

    $("body").on('click', "#userContactSubList li", function() {
        PARTAGE.addSharingContact ({idUrl  : $(this).attr('idUrl'),
                                    nom    : $(this).html()});
        $('#userContact').val('');
        $('#userContactSubList').empty();
    });

    $("body").on('click', "#userGroup option", function(e) {  
        if ($(this).attr('idGroup')) { // On ignore le clic sur "Ajouter un groupe"
        PARTAGE.addSharingGroup ({idGroup : $(this).attr('idGroup'),
                                  nom     : $(this).val()});
        $(this).parent().val('Ajouter un groupe');
        }
    });

    $("body").on('click', '[name="removeSharing"]', function(e) {
        console.log('REMOVE');
        $(this).parent().remove();
    });
});