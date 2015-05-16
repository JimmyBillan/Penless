<?php 
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
/* Header */
include('header.php');
    
/* Body */

include('navbarConnected.php');
echo "<div class='row nomarginright'>";
include('sidebarConnected.php');

		echo "<div id='corp'class='col-lg-9 col-sm-9 col-md-9 col-xs-12'>";
		$root = realpath($_SERVER["DOCUMENT_ROOT"]);
		require_once $root."/Model/UserDB.php";


		echo "</div>";

echo"</div>";  

include('footer.php'); /* scripts communs Connected/NotConnected */

echo' <script type="text/javascript" src="View/js/editor2/lodash.js"></script>
 <script type="text/javascript" src="View/js/editor2/quill.js"></script>
 <script type="text/javascript" src="View/js/editor2/advanced.js"></script>';*/

echo  '<script type="text/javascript" src="View/js/wysihtml/dist/wysihtml5-0.3.0.min.js"></script>
 <script type="text/javascript" src="View/js/wysihtml/parser_rules/advanced.js"></script>';

echo  "<script type='text/javascript' src='View/js/user.js'></script>";
echo  "<script type='text/javascript' src='View/js/partage.js'></script>"; 

echo "</html>";

