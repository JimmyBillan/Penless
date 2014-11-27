<!-- FORMULAIRE D'INSCRIPTION -->
    <div id="textInscriptionReussie" class="col-lg-12 col-sm-12" style="display: none;">
     <h1> Felicitation Inscription reussie ! </h1> 
      Ton email  : <div id="mailInscrit"> </div>
      Ton Nom    : <div id="nomInscrit"> </div>
      Ton prenom : <div id="prenomInscrit"> </div>
    </div> 
    <form  class="form-horizontal  col-lg-12 col-sm-12" id="formInscription" style="display: block;">
        
        <div class="col-sm-12">
            <h1>Inscription</h1>
        </div>
        <div class="form-group " >
            <div class="col-sm-12">
                <input name="mail" type="text" placeholder="Email" class="form-control" id="MailInscription" autofocus="">
                <label  class="control-label" id="labelMail" style="display: none;"></label>
            </div>
        </div>
        
        <div class="form-group">
            <div class="col-sm-12">
                <input name="nom" type="text" placeholder="Nom" class="form-control" id="nomInscription" >
                <label  class="control-label" id="labelNom" style="display: none;"></label>
            </div>
        </div>
         <div class="form-group">
            <div class="col-sm-12">
                <input name="prenom" type="text" placeholder="Prenom " class="form-control" id="prenomInscription">
                <label  class="control-label" id="labelPrenom" style="display: none;"></label>
            </div>
        </div>
        
        <div class="form-group ">
            <div class="col-sm-12">
                <input name="password" type="password" placeholder="Password (8 minimum )" class="form-control" id="pswdInscription1">
                <label  class="control-label" id="labelPassword" style="display: none;"></label>
            </div>
        </div>

        <div class="form-group ">
            <div class="col-sm-12">
                <input name="password2" type="password" placeholder="Password (valider)" class="form-control" id="pswdInscription2">
                <label class="control-label" id="labelPassword2" style="display: none;"></label>
            </div>
        </div>
        
        <!-- LABEL ERREUR INSCRIPTION -->
        <label id="signinError"  style="display: none;"></label>
        
        <div class="form-group ">
            <div class="col-sm-12">
                <input type="submit" id="submitInscription" class="btn btn-default" value="S'inscrire">
            </div>
        </div>
    </form>



