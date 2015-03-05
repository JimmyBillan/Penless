<?php 

session_start();
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/ContactDB.php";
require_once $root."/Model/UserDB.php";

if(isset($_POST['g']))
{
		
	$doc = $_POST['g'];
	
	$db = new groupDbConnection();

	/*On cherche si le groupe existe et qu'on est bien admin*/
	$cursor = $db->amIAdmin($_SESSION['id'], (string) $doc["idGroupe"]);
	$groupe = array();

	if($cursor){
		echo "le groupe existe \n";

		/*On reconstruit l'array en sécurité, en faille xss (htmlEntities) et injection mongo (string) */
		
		/*On verifie nom du groupe non vide*/
		if(!isset($doc["nom"]))
			echo "nom groupe vide \n";
		else{
			$groupe["nom"] = htmlentities((string) $doc["nom"]);

			/*On recupere chaque utilisateur et leur type*/
			$groupe["arrayUser"] = array();
			$groupe["admin"] = array($_SESSION['id']);

			$dbUser = new UserDbConnection();
			$oktosave = true;

			foreach ($doc["listUser"] as $key => $value) {
				
				$cursorUser = $dbUser->isUserExist(array_keys($value)[0]);
				
				if($cursorUser){
					echo "user existe \n";
					if($value[array_keys($value)[0]] == 'Utilisateur'){
						array_push($groupe["arrayUser"], htmlentities((string)array_keys($value)[0]));}
					elseif ($value[array_keys($value)[0]] == 'Admin'){
						array_push($groupe["admin"], htmlentities((string)array_keys($value)[0]));}
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
		if($oktosave){
			$db->updateGroupe((string) $doc["idGroupe"], $groupe);
		}
		var_dump($groupe);

	}else{
		echo "Le groupe n'existe pas ou je ne suis pas admin\n";
	}
		
}