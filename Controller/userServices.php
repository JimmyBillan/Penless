<?php 
//require_once "Hashids.php";

/*function MailIsValid($mail)
{
    return filter_var($mail, FILTER_VALIDATE_EMAIL);
}*/

/*function PasswordIsValid($password)
{
    return strlen($password)>= 8;    	
}*/
	
function hashPassword ($date, $password) {
    return hash('sha256', "unepincéedesel".$date.$password);
}