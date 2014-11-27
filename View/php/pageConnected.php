<?php 
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
/* Header */
include('header.php');
    
/* Body */

include('navbarConnected.php');
echo "<div class='row nomarginright'>";
include('sidebarConnected.php');
		echo "<div id='corp'class='col-sm-9 col-md-10 col-xs-12'>";
		$root = realpath($_SERVER["DOCUMENT_ROOT"]);
		require_once $root."/Model/UserDB.php";

		if(isset($_POST["U"])&& $_POST["U"] != $_SESSION["id"]){

			$getU = (string) $_POST["U"];
			$resultat = array();

			$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true, "contact" => true);
			$userDbConnection = new UserDbConnection();
			$cursor = $userDbConnection->FindUserWithHisidUrlANDProjection($getU, $projection);

			if($cursor == null)
				$resultat ["isAmi"] ="No_user";
			else{
				$resultat["nom"] = $cursor["nom"];
				$resulta0t["prenom"] = $cursor["prenom"];
					
				$resultat["isAmi"] = $userDbConnection->FindInContactList($_SESSION["id"], $getU);

			}

			echo json_encode($resultat);

		}elseif(isset($_POST["U"]) == $_SESSION["id"]) {
			# code...

			$projection = array("_id" => false, "nom" =>true, "prenom" => true, "idUrl" => true, "contact" => true);
			$userDbConnection = new UserDbConnection();
			$cursor = $userDbConnection->FindUserWithHisidUrlANDProjection($_SESSION["id"], $projection);


			$resultat = array();
			$temp = array();

			$resultat["nom"] = $cursor["nom"];
			$resultat["prenom"] = $cursor["prenom"];
			$temp["etat"] = "FAIL";
			$temp["raison"] = "MYSELF";
			$resultat["isAmi"] = $temp;
			echo json_encode($resultat);
		}
		if(isset($_POST["D"])){
			$getD = (string) $_POST["D"];

			
			$m = new MongoClient();
			$db = $m->penless;
			$collection = $db-> Document;

			$projection = array("_id" => false, "createur" => false);
			$cursor = $collection->find(array("idDocument" => $getD), $projection);

			if($cursor->count()==0)
				echo "aucun document à cette url";
			else{
				foreach ($cursor as $key) {
					# code...
					echo json_encode($key);
				}
			}
				
	
		}
		echo "</div>";
echo"</div>";  

/* Footer */

include('footer.php');
echo  "<script type='text/javascript' src='View/js/get.js'></script>"; // CKE TODO à passer dans le footer?

