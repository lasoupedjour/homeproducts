﻿<?php
include "dbc.php";

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




$res = array();

$res['res'] = 'ok';

if($arre['Categoria']=="MENAJE"){
  $q = mysql_query("
  SELECT distinct Falla FROM fallas where Subcategoria = '".$arre['Subcategoria']."' and Cliente='".$arre['Cliente']."' order by Falla asc
  ") or die(mysql_error());
}else{
  $q = mysql_query("
  SELECT distinct Falla FROM fallas where Subcategoria = '".$arre['Subcategoria']."' order by Falla asc
  ") or die(mysql_error());
}



$fallas = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($fallas, $temp);
}
$res['fallas'] = $fallas;

echo json_encode($res);





?>
