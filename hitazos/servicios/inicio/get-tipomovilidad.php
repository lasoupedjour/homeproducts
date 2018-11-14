<?php
include "../dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});

$q = mysql_query("SELECT SubtipoServicio from tarifas where id = " . $arre["id"]);

$reportes = array();
$subtipo = "";

while ($row = mysql_fetch_array($q))
{
  $subtipo = $row["SubtipoServicio"];
}

echo('{"SubtipoServicio": "' . utf8_encode($subtipo) . '"}');
?>
