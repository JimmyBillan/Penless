/* <Fonction> */
/*Verifie si la valeur est bien une adresse email*/
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(emailAddress);
}
/*</Fonction>*/   
$(document).ready(function(){

    /*######################################################*/
    /* Chargement du tableau public    */
    /*######################################################*/

    $.ajax({
                        type : 'GET',
                        data : {DPublic:"futurValeurPeutetrelenombrededocument"}, /*Definir le nombre de document que l'on veut voir afficher*/
                        url : 'Controller/getDocumentPublicArea.php',
                        success:function(reponse){
                            
                                var result = $.parseJSON(reponse);
                            
                            $("#tabDocument").append("<label><h2>Les derniers documents partagés </h2></label><table class='table  table-hover '><thead><tr><th class='hideMobile'>Nom</th><th class='hideMobile'>Dernière modification</th></tr></thead><tbody id='bodyTabDocument'>");
                            for(key in result){
                                $("#bodyTabDocument").append("<tr id='goToTargetDocument' target='"+result[key].idDocument+"'><td class='clickable2'>"+result[key].nomDocument+"</td><td class='clickable2'>"+result[key].DateModification +"</td></tr>");

                            }
                            $("#tabDocument").append("</tbody></table></div></div></div>");
                            
                            

                        }
                    });

    /*######################################################*/
    /* Function clic ligne tableau document      */
    /*######################################################*/

    $("body").on('click', '#goToTargetDocument', function(){
        console.log($(this).attr("target"));
        window.location ="/?&D="+$(this).attr("target");    
    });

    
/*######################################################*/
/* Click sur Mot de passe oublié       */
/*######################################################*/
$("#mdpOublie").click(function(){

    if($("#formMDPOublie").is(":visible")){
        $('#formMDPOublie').hide(500);
    }else{
        $('#formMDPOublie').show(500);
    }
    
});

/*#######################################################*/
/* Submit du formulaire de saisie mail pour réinitialiser le mot de passe */
/*#######################################################*/
$("#submitMDPOublie").click(function(){
    
    var mail = $('#MailMDPOublie').val();
    var label = $('#labelMailOublie');
    
    if(mail == ''){
        label.html("Merci d'indiquer une adresse mail");
        label.show();
    }else if(!isValidEmailAddress(mail)){
        label.html("Adresse mail invalide");
        label.show();
    }else{
         $.ajax({ 
            type : 'POST',
            data : {mail:mail},
            url  : '../../Controller/processMailForNewPassword.php',

            success: function(responseText){ 
               
                
                if(responseText == "NOK"){
                    label.show(500);
                    label.html('<span class="textErreur">Adresse mail inconnue</span>');
                }
                else {
                    $('#MailMDPOublie').hide();
                    $('#labelMailOublie').hide();
                    $("#submitMDPOublie").hide();
                    label.show(500);
                    label.html('Un mail vient d\'être envoyé à l\'adresse '+mail);
                }
            }

        });
    }
    return false ; // CKE : A quoi ça sert??
});

/*####################################################*/
/* Submit du formulaire de changement de mot de passe */
/*####################################################*/
    
$("#btnsubmitChangePassword").click(function(){

    var pswd1 = $('#pswd1submitChangePassword');
    var pswd2 = $('#pswd2submitChangePassword');
    var compteur = 0;
    if(!isValidEmailAddress($("#mailsubmitChangePassword").val()) || $("#mailsubmitChangePassword").val() ==""){
        // CKE l'adresse mail peut avoir été modifiée et passer ces tests? A quoi servent-ils exactement?
        $("#labelsubmitChangePassword").html("L'adresse mail a été modifiée ! ");
        $("#labelsubmitChangePassword").show();
    }else{
        compteur++;
    }
    if($('#clesubmitChangePassword').val() == ""){
        $("#labelsubmitChangePassword").html("La clé a été modifiée ! ");
        $("#labelsubmitChangePassword").show();  
    }else{
        compteur++;
    }
    if(pswd1.val() =="" || pswd1.val().length < 8 ){ // CKE : ajouter un test expression régulière ?
        $('#labelpswd1submitChangePassword').html("Mot de passe 1 invalide, longueur minimum : 8");
        $('#labelpswd1submitChangePassword').show();
        }else{
            $('#labelpswd1submitChangePassword').hide();
            compteur++;
        } 
    
    if(pswd2.val() =="" || pswd2.val().length < 8 ){
        $('#labelpswd2submitChangePassword').html("Mot de passe 2 invalide, longueur minimum : 8");
        $('#labelpswd2submitChangePassword').show();
        }else{
            $('#labelpswd2submitChangePassword').hide();
            compteur++;
        }

    /*var arrayRetourAjaxForm = {
        1 : ["labelmailsubmitChangePassword", "Adresse mail modifiée"], 
        2 : ["labelpswd1submitChangePassword", "Mot de passe trop court"], 
        3 : ["labelsubmitChangePassword", "Mots de passe différents"]
    }*/
    // CKE : Gestion des codes d'erreur pas intuitive mais plus rapide??
    
    if(pswd1.val() == pswd2.val() && compteur == 4){
        $.ajax({ 
            type : 'POST',
            data : {
                mail:$("#mailsubmitChangePassword").val(),
                cle:$('#clesubmitChangePassword').val(), 
                password:pswd1.val()
            },
            url  : '../../Controller/processNewPassword.php',

            success: function(code){ // CKE A revoir
                
                /*for(var i =0; i<code.length; i++){
                        if(i in arrayRetourAjaxForm){
                            $('#'+arrayRetourAjaxForm[i][0]).html(arrayRetourAjaxForm[i][1]);
                            $('#'+arrayRetourAjaxForm[i][0]).show(100);
                        }
                }*/
                if(code == "OK"){
                    $('#formSetNewPassword').hide(500);
                    $('#message').show();
                   // window.location = 'index.php'; 
                }else if (code =="UNKNOWN_MAIL"){
                $('#message').html("Adresse mail inconnue");
                $('#message').show();
                }else if (code =="INVALID_PASSWORD"){
                $('#message').html("Mot de passe trop court");
                $('#message').show();
                }else if (code =="INVALID_MAIL"){
                $('#message').html("Adresse mail invalide");
                $('#message').show();
                }else{
                $('#message').html("Erreur" + code);
                $('#message').show();
                }
            }
        });
    
    }else{
        $('#labelpswd2submitChangePassword').html("Les mots de passes sont différents");
        $('#labelpswd2submitChangePassword').show();
    }    
});


/*###################################*/
/* Submit du formulaire de connexion */
/*###################################*/
$("#submitConnexion").click(function(){
       
    var mail         = $('#mailConnexion');
    var password     = $('#passwordConnexion') ;
    var login_result = $('#resultatConnexion') ;
      
    // Affichage d'un loading UX ! 
    login_result.html('loading..') ;
    
    // Verification sur les champs du formulaire
    if (mail.val() == ''){ 
        mail.focus();
        login_result.html('<span class="textErreur">Merci d\'indiquer une adresse mail</span>');
        //return false ;
    }
    if(!isValidEmailAddress(mail.val())){
        login_result.html("<span class='textErreur'>Adresse mail invalide</span>!");
        //return false;
    }
    if (password.val() == ''){ 
        password.focus() ;
        login_result.html('<span class="textErreur">Merci d\'indiquer votre mot de passe</span>');
        //return false;
    }
        
    // Post de l'adresse email et du password à connexion.php
    $.ajax({ 
            type : 'POST',
            data : {mail:mail.val(), 
                    password:password.val()},
            url  : '../../Controller/processConnection.php',

            success: function(result){ 
                //login_result.html(result);
                if(result == "CONNECTION"){
                    //login_result.html('<span class="textErreur"></span>');
                    window.location = '/'; 
                }
                else if(result == "WRONG_PASSWORD"){
                    login_result.html('<span class="textErreur">Mot de passe incorrect</span>');
                }
                else if(result == "UNKNOWN_MAIL"){
                    login_result.html('<span class="textErreur">Adresse mail inconnue</span>');
                }
                else if(result == "POST_ERROR"){
                    login_result.html('<span class="textErreur">Erreur POST</span>');
                }
                else
                {
                    login_result.html('<span class="textErreur">Erreur inattendue</span>');
                }
            }
        });
        
        return false;// CKE a quoi ça sert?*/

    });

/*####################################*/
/* Submit du formulaire d'inscription */
/*####################################*/
$('#submitInscription').click(function(){
    var userNom    = $('#nomInscription');
    var userPrenom = $('#prenomInscription');
    //var classe     = $('#classe');
    var mail       = $('#MailInscription');
    var pswd1      = $('#pswdInscription1');
    var pswd2      = $('#pswdInscription2');
        
    var okTogo = 0;
         
    $('#signinError').hide();     
         
    if(mail.val()==''){ 
        mail.focus();
        $('#labelMail').html("Merci d'indiquer une adresse mail")
        $('#labelMail').show(100);
            
    }else if(!isValidEmailAddress(mail.val())){
        $('#labelMail').html("Adresse mail invalide");
        $('#labelMail').show(100);
    }else{
        $('#labelMail').hide(100);
        okTogo++;
    }     
         
    if(userNom.val()==""){
        userNom.focus();
        $('#labelNom').html("Merci d'indiquer un nom");
        $('#labelNom').show(100);
                
    }else{
        $('#labelNom').hide(100);
        okTogo++;
    }
          
    if(userPrenom.val()==""){
        userPrenom.focus();
        $('#labelPrenom').html("Merci d'indiquer un prénom");
        $('#labelPrenom').show(100);
            
    }else{
        $('#labelPrenom').hide(100);
        okTogo++;
    }
    
    if(pswd1.val()==''){
        pswd1.focus();
        $('#labelPassword').html("Merci d'indiquer un mot de passe")
        $('#labelPassword').show(100);    
    }else if(pswd1.val().length < 8){
        $('#labelPassword').html("Le mot de passe est trop court (8 min.) ")
        $('#labelPassword').show(100);
    }else{
        $('#labelPassword').hide(100);
        okTogo++;
    }
     
    if(pswd2.val()==''){ // CKE : On pourrait se contenter du message "Mots de passe différents"
        pswd2.focus();
        $('#labelPassword2').html("Merci de confirmer le mot de passe ")
        $('#labelPassword2').show(100);
            
    }else if(pswd2.val().length < 8){
        $('#labelPassword2').html("Le mot de passe est trop court (8 min.) ")
        $('#labelPassword2').show(100);
            
    }else{
        $('#labelPassword2').hide(100);
        okTogo++;
            
    }
         
    if(pswd1.val() != pswd2.val()){
        $('#labelPassword2').html("Les mots de passe sont différents")
        $('#labelPassword2').show(100);
    }else{okTogo++;}
    
    if( okTogo == 6){
        $('#signinError').html('Inscription en cours ...');
        $('#signinError').show(100);
        $.ajax({ 
            type : 'POST',
            data : {
                mail      :mail.val(),
                userNom   :userNom.val(), 
                userPrenom:userPrenom.val(),
                password  :pswd1.val()},
            url  : '../../Controller/processSignIn.php',
            success: function(result){ 
                
                if (result == "OK"){
                    $('#formInscription').hide(100);
                    $('#textInscriptionReussie').show(100);
                    $('#mailInscrit').html(mail.val());
                    $('#nomInscrit').html(userNom.val());
                    $('#prenomInscrit').html(userPrenom.val());
                }else if(result == "IN_PROGRESS"){
                    $('#signinError').html('Vous êtes déjà en cours d inscription');
                    $('#signinError').show(100);
                        
                }else if(result == "DONE"){
                    $('#signinError').html('Vous êtes déjà inscrit');
                    $('#signinError').show(100);
                        
                }else if(result == "INVALID_PASSWORD") {
                    $('#labelPassword').html('Mot de passe invalide (longueur min 8)');
                    $('#labelPassword').show(100);
                }
                else if(result == "INVALID_MAIL") {
                    $('#labelMail').html('Adresse mail invalide');
                    $('#labelMail').show(100);
                }
                else if(result == "ERROR_POST") {
                    $('#labelMail').html('Erreur POST');
                    $('#labelMail').show(100);
                }
                else {
                    $('#signinError').html(result);
                    $('#signinError').show(100); 
                }
            }

        });
       return false;
     }else{
        return false;
     }
        
    });

}) ;