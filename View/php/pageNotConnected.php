<?php 

/* Header */
include('headerNotConnected.php');
    
/* Body */
include('navbarNotConnected.php');
echo "<div class='fontaccueil'>";
echo "<div class='col-xs-12 col-md-4 col-sm-6 col-lg-3 '>";
include('blockSignIn.php');
echo "</div>";
echo "<div class='col-xs-12 col-md-4 col-sm-6 col-lg-5 '>";
include('blockMailForNewPassword.php');
include('blockPresentation.php');
echo "</div>";
echo "<div id='tabDocument' class='col-xs-12 col-md-4 col-sm-12 col-lg-4 '></div>";
echo "</div>";
/* Footer */
include('footer.php');
echo  "<script type='text/javascript' src='View/js/pageNotConnected.js'></script>";
//echo  "<script type='text/javascript' src='View/js/get.js'></script>";// CKE à passer dans le footer?

