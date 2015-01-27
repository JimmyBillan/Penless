<div class="col-sm-9 col-md-10 col-xs-12">
    <div id="row" class="droite15">

        <div compQuestion="0" style="display: block">
                <div id="entetecreationelement" class="col-xs-12 col-md-12 col-lg-8 navbar-fixed-enteteCreation">   
                        
                    <div class="col-lg-10 col-md-10 col-sm-9 col-xs-12">
                        <label title="modifier ?" id="labeltitreDoc"  class="col-xs-12" style="display : none"></label>
                        <label id="labeltitreDocBubble" style="display : none"></label>
                        <input name="titreDoc" type="text" placeholder="Titre du Document" class="form-control" id="titreDoc">
                    </div>
                            
                    <div class="col-lg-3 col-md-4 col-sm-6 col-xs-3">
                        <input type="submit" id="validerTitreDoc" class="btn btn-default" value="Valider">
                    </div>    

                    <div id="row" class="top10 col-xs-12">
                        <div class="col-lg-12 col-sm-12 col-xs-12">
                            <select name="new_element" id="new_element" class="btn btn-default" style="display : none">
                                <option id="vide">Choisir un type d'element</option>
                                <option id="qcm" value="qcm">QCM</option>
                                <option id="textatrou" value="questionSimple">questionSimple</option>
                                <option id="lecon" value="lecon">Leçon</option>              
                            </select>
                             <input type="button" id="partager" class="btn btn-default" value="Partager" style="display : none">
                        </div>
                    </div>
                </div>
                    <label id="LabelGeneral" style="display : block"></label>
                    <div id="popPartager" class="col-xs-12 col-md-12 col-lg-8" style="display : none">
                        <div  class="popPartager droite15 greybox col-xs-12">
                            <label>Parametre de confidentialité</label>
                            <div class="radio">
                              <label>
                                <input type="radio" name="optionsRadios" id="optionsRadios1" value="privee" checked>
                                Privée
                              </label>
                            </div>
                            <div class="radio">
                              <label>
                                <input type="radio" name="optionsRadios" id="optionsRadios2" value="public">
                                Public
                              </label>
                            </div>
                            <input type="text" class="form-controlEnonce"name="groupecontactpartage" placeholder="Contact/s ou groupe/s"><br>
                            <button id="annulerpopPartager" type="button" class="btn btn-default">Annuler</button>
                            <button id="validerpopPartager" type="button" class="btn btn-default">Valider</button>
                            <div id="textNotifyPopPartager"></div>

                        </div>
                    </div>
                    
                    <div id="blockQuestion" class="col-xs-12 col-md-12 col-lg-8"  compQuestion="0" style="display: block"></div>
          </div>
    </div>
  
</div>