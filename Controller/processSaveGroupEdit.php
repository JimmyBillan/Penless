<?php 

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/GroupDB.php";
require_once $root."/Model/UserDB.php";

if(isset($_POST['g']) && $_SESSION['id'])
{
		
	$doc = $_POST['g'];
	
	$db = new groupDbConnection();

	/*On cherche si le groupe existe et qu'on est bien admin*/
	$cursor = $db->amIAdmin($_SESSION['id'], (string) $doc["idGroupe"]);
	
	if($cursor){

		/*On reconstruit l'array en sécurité, en faille xss (htmlEntities) et injection mongo (string) */
		$groupe = array();

		/*On verifie nom du groupe non vide*/
		if(!isset($doc["nom"]))
			echo "nom groupe vide \n";
		else{
			$groupe["nom"] = htmlentities((string) $doc["nom"]);

			/*On recupere chaque utilisateur et leur type*/
			$groupe["arrayUser"] = array();
			$groupe["admin"] = array();

			$dbUser = new UserDbConnection();
			$oktosave = true;

			foreach ($doc["listUser"] as $key => $value) {
				
				$cursorUser = $dbUser->isUserExist(array_keys($value)[0]);
				
				if($cursorUser){
					if($value[array_keys($value)[0]] == 'Utilisateur'){
						
						array_push($groupe["arrayUser"], htmlentities((string)array_keys($value)[0]));

					}
					elseif ($value[array_keys($value)[0]] == 'Admin'){
						
						array_push($groupe["admin"], htmlentities((string)array_keys($value)[0]));

					}
					else{
						
						echo "erreur de type user";
						$oktosave = false;

					}
				}else{
					echo "l utilisateur n'existe pas \n ";
					$oktosave = false;
				}
				
			}

		}

		if(count($groupe["admin"]) == 0){
			$oktosave = false;
			echo "No_Admin";
		}

		if($oktosave){
			$db->updateGroupe((string) $doc["idGroupe"], $groupe);
		}
		

	}else{
		echo "Le groupe n'existe pas ou je ne suis pas admin\n";
	}
		
}