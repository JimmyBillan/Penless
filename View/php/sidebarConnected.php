
<?php 
session_start();

$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Controller/getNumberNotification.php";

$nBNotification = numberNotification();
if ($nBNotification > 0 ){
    $nBNotification ='<span class="badge">'.$nBNotification.'</span>';
}
?>

<div id ="sidebar" class="col-sm-3 col-md-3 col-lg-2 col-xs-12">

          <ul id="menuMonCompte" class="BAR">
            <li><a href="<?php echo '/?&U='.$_SESSION["id"].'&C=Notification';?>">
                <span class="glyphicon glyphicon-globe" style="margin-right: 5px;font-size: 20px;top: 5px;"></span>
                Mes Notifications</a> 
                <span style="color:red;  font-size: 19px;position: relative;"><?php echo $nBNotification; ?></span>
            </li>
            <li><a href="<?php echo '/?&C=Creation';?>"><span class="glyphicon glyphicon-pencil" style="margin-right: 5px;font-size: 20px;top: 5px;"></span> Créer un Document</a></li>
            <li><a href="MyDocuments.php"><span class="glyphicon glyphicon-folder-open" style="margin-right: 5px;font-size: 20px;top: 5px;"></span> Mes Documents</a></li>
            <li><a href="#"><span class="glyphicon glyphicon-equalizer" style="margin-right: 5px;font-size: 20px;top: 5px;"></span>Mes résultats</a></li>
            <li><a href="#"><span class="glyphicon glyphicon-list" style="margin-right: 5px;font-size: 20px;top: 5px;"></span> Mes devoirs</a></li>
            <li><a href="<?php echo '/?&U='.$_SESSION["id"].'&C=Contact';?>"><span class="glyphicon glyphicon-education" style="margin-right: 5px;font-size: 20px;top: 5px;"></span> Mes Contacts</a></li>
            <!--li id="goToMenuCategory"><a href="#"><label>Tous les exercices</label></a></li-->
            <li><a href="<?php echo '/?&C=TousLesDocuments';?>"> <span class="glyphicon glyphicon-book" style="margin-right: 5px;font-size: 20px;top: 5px;"></span><label>Tous les exercices</label></a></li>
           </ul>
</div>