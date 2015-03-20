<?php 

/* Header */
include('headerNotConnected.php');
    
/* Body */
include('navbarNotConnected.php');

echo "<div class='row nomarginright'>";

// Sidebar créée dynamiquement
echo "<div id ='sidebar' class='col-sm-3 col-md-2  navbar-fixed-top25 sidebar'>";//<div id ='sidebar' class='col-xs-12 col-sm-3 col-md-2'>";
echo "</div>";

// Corp de la page
echo "<div id='corp' class='fontaccueil col-xs-12 col-sm-9 col-md-10'>";

echo "<div id='presentation' class='col-xs-12 col-md-6 col-sm-6 col-lg-7'>";
include('blockPresentation.php');
echo "</div>";

echo "<div id='signin' class='col-xs-12 col-md-6 col-sm-6 col-lg-5'>";
include('blockSignIn.php');
include('blockMailForNewPassword.php');
echo "</div>";

echo "</div>";
echo "</div>";
//echo "<div id='tabDocument' class='col-xs-12 col-md-4 col-sm-12 col-lg-4 '></div>";
//echo "</div>";
/* Footer */
include('footer.php');
echo  "<script type='text/javascript' src='View/js/pageNotConnected.js'></script>";
echo  "<script type='text/javascript' src='View/js/category.js'></script>";
echo  "<script type='text/javascript' src='View/js/document.js'></script>";
echo  "<script type='text/javascript' src='View/js/viewDocumentServices.js'></script>";

