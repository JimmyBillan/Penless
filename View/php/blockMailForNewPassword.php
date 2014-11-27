<form  class="form-horizontal  col-lg-12 col-sm-12" id="formMDPOublie" style="display: none;">
        
        <div class="col-sm-12">
            <h1>Mot de passe oublié</h1>
        </div>
        <div class="form-group " >
            <!--<div class="col-lg-7 col-md-8 col-sm-12"> CKE bof? plutôt prendre toute la place-->
                <label  class="control-label" id="labelMailOublie" style="display: inline;">
                    Saisissez votre adresse email pour réinitialiser le mot de passe
                </label>
                <input name="mail" type="text" placeholder="Email" class="form-control" id="MailMDPOublie" ><!-- CKE : utiliser type email-->
                <label  id="labelMailOublie" style="display: none;"></label>
                <!-- labelMailOublie : Pour afficher un texte type "Adresse vide" ou "Adresse invalide"-->
            <!--</div>-->
        </div>
                
        <div class="form-group ">
            <div class="col-sm-12">
                <input type="submit" id="submitMDPOublie" class="btn btn-default" value="Envoyer !">
            </div>
        </div>
</form>