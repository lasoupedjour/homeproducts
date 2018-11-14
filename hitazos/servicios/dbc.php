<?php
define ("DB_HOST", "localhost"); // set database host
define ("DB_USER", "root"); // set database user
define ("DB_PASS","root"); // set database password
define ("DB_NAME","oster_homeproducts"); // set database name

$host = "http://".$_SERVER['HTTP_HOST'];

$link = mysql_connect(DB_HOST, DB_USER, DB_PASS) or die("Couldn't make connection.");
$db = mysql_select_db(DB_NAME, $link) or die("Couldn't select database");

function filter($data) {
	$data = trim(htmlentities(strip_tags($data),ENT_QUOTES, "UTF-8"));

	if (get_magic_quotes_gpc())
		$data = stripslashes($data);

	$data = mysql_real_escape_string($data);
	$data = html_entity_decode($data);

	return $data;
}

function genPassword($id, $nombrepadre, $nombrenino){

	$pwd = $id.strtoupper(substr($nombrepadre,0,1)).strtoupper(substr($nombrenino,0,1));
	return $pwd;

}

function randomPassword() {
    $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    $pass = array(); //remember to declare $pass as an array
    $alphaLength = strlen($alphabet) - 1; //put the length -1 in cache
    for ($i = 0; $i < 8; $i++) {
        $n = rand(0, $alphaLength);
        $pass[] = $alphabet[$n];
    }
    return implode($pass); //turn the array into a string
}

?>
