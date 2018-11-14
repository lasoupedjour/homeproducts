<?php


define ("DB_HOST", "localhost"); // set database host
define ("DB_USER", "Oster"); // set database user
define ("DB_PASS","Vcjc3jASBjYPDcND"); // set database password
define ("DB_NAME","Oster_homeproducts"); // set database name

$host = "http://".$_SERVER['HTTP_HOST'];

/*$link = mysqli_connect(DB_HOST, DB_USER, DB_PASS) or die("Couldn't make connection.");
$db = mysqli_select_db(DB_NAME, $link) or die("Couldn't select database");
*/


$mysqli = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$con=mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
/* verificar conexión */
if (mysqli_connect_errno()) {
    printf("Connect failed: %s\n", mysqli_connect_error());
    exit();
}



?>