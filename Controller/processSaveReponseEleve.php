<?php
$root = realpath($_SERVER["DOCUMENT_ROOT"]);
require_once $root."/Model/UserDB.php";
session_start();

if(isset($_POST['J'])) {
		
		/*$jsonReponse = $_POST['document'];
		$idDocument = $_SESSION['idDocument'];
		$User       = $_SESSION['id'];
		var_dump($jsonReponse)*/
		/*
		// Expected 
		$reponseJuste = array();
		foreach ($doc as $key => $value) 
		{
			//echo (substr($key, 0, 3));
		
			if(substr($key, 0, 4) == "#exo")
			{
				foreach ($value as $inputExo => $valueinputExo) 
				{
					if(substr($inputExo,0,12) =="reponseJuste")
					{
						$reponseJuste[]=$valueinputExo;
						unset($value[$inputExo]);
						var_dump($value);
					}      

				}

			}
		}
		
		
		$c = new UserDBconnection();
        $c->AddReponse ($user, $jsonReponse);*/
    	echo "success [msg temp processsSaveReponseEleve.php]";
		//var_dump($resultat);

}
else {echo "Post error";}