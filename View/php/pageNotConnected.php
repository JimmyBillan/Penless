<?php 

/* Header */
include('header.php');
    
/* Body */
include('navbarNotConnected.php');
echo "<div class='col-xs-12 col-md-7 col-sm-7 col-lg-7'>";
include('blockSignIn.php');
echo "</div>";
echo "<div class='col-xs-12 col-md-5 col-sm-5 col-lg-5'>";
include('blockMailForNewPassword.php');
include('blockPresentation.php');
echo "</div>";

/* Footer */
include('footer.php');
echo  "<script type='text/javascript' src='View/js/pageNotConnected.js'></script>"; // CKE à passer dans le footer?

