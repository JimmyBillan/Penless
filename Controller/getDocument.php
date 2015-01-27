<?php


session_start();

if(isset($_POST["D"])){
	$getD = (string) $_POST["D"];

	
	$m = new MongoClient();
	$db = $m->penless;
	$collection = $db-> Document;

	$projection = array("_id" => false);
	$cursor = $collection->find(array("idDocument" => $getD), $projection);

	if($cursor->count()==0)
		echo "aucun document à cette url";
	else{
		foreach ($cursor as $key) {
			# code...
			if($key["confident"] == "privee" && $_SESSION['id'] != $key["createur"]){
				echo "itsprivate";
			}else{
				echo json_encode($key);
			}
			

		}
	}
		
	
}
