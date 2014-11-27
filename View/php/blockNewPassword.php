<h1 id="message" style="display: none;">Mot de passe modifié avec succes ! </h1>
<form id="formSetNewPassword" class="form-horizontal  col-lg-12 col-sm-12">
	<input type="text" name="mail" id="mailsubmitChangePassword" value="<?php echo $mail; ?>" style="display: none;">
	<input type="text" name="cle" id="clesubmitChangePassword" value="<?php echo $cle; ?>" style="display: none;">
   
    <div class="form-group " >
    <label  id="labelmailsubmitChangePassword" style="display: none;"></label></div></div>

    <div class="form-group " >
            <div class="col-lg-7 col-md-8 col-sm-12">
                <input name="pswd1submitChangePassword" type="password" placeholder="Le mot de passe (Minimum :8)" class="form-control" id="pswd1submitChangePassword" >
                <label  id="labelpswd1submitChangePassword" style="display: none;"></label></div></div>

    <div class="form-group " >
            <div class="col-lg-7 col-md-8 col-sm-12">
                <input name="pswd2submitChangePassword" type="password" placeholder="Le mot de passe (valider)" class="form-control" id="pswd2submitChangePassword" >
                <label  id="labelpswd2submitChangePassword" style="display: none;"></label></div></div>

    <div class="form-group " >
        <div class="col-lg-7 col-md-8 col-sm-12">
            <label  id="labelsubmitChangePassword" style="display: none;"></label>
           <input type="button" class="btn btn-success2" id="btnsubmitChangePassword" value="Valider"></div></div>
        

</form>