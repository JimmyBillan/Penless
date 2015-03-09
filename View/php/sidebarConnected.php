<div id ="sidebar" class="col-sm-3 col-md-3 col-lg-2 col-xs-12">

          <ul class="BAR">
            <li id="titreMenuLatteral" class="active"><a href="#">Sections</a></li>
            <li><a href="<?php echo '/?&U='.$_SESSION["id"].'&C=Notification';?>">Mes Notifications</a></li>
            <li><a href="<?php echo '/?&C=Creation';?>">Créer un Document</a></li>
            <li><a href="MyDocuments.php">Mes Documents</a></li>
            <li><a href="#">Mes Corrections</a></li>
            <li><a href="#">Mes Messages</a></li>
            <li><a href="<?php echo '/?&U='.$_SESSION["id"].'&C=Contact';?>">Mes Contacts</a></li>
            <!--li id="goToMenuCategory"><a href="#"><label>Tous les exercices</label></a></li-->
            <li><a href="<?php echo '/?&C=TousLesDocuments';?>"><label>Tous les exercices</label></a></li>
           </ul>
</div>