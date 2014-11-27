<?php

if(isset($_POST['name'])){
	//echo '<table class="table table-striped table-hover bulleUser"> <tbody>';


	$name = explode(" ",(string) strtolower( $_POST['name']));
	//var_dump($name);
	$m = new MongoClient();
	$db = $m->penless;
	$collection = $db-> User;
	$c= array_unique($name); 
	
	
	$resultat = array();


	foreach ($c as $key ) {
		
		if($key != ""){
		$projection = array("_id" => false, "nom" => true, "prenom" => true, "idUrl" => true);
		$cursor = $collection->	find(array('$or'=> array(
									array("nom" => $key), 
									array("prenom" => $key)
									)), $projection);

			
		foreach ($cursor as $key ) {
			if(!array_key_exists($key['idUrl'], $resultat))
				$resultat[$key['idUrl']] = array("nom" => $key["nom"], "prenom" => $key["prenom"]);
			

		}
	}
	}

	echo json_encode($resultat);
}