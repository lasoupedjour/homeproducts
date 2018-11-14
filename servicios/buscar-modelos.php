<?php
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

$query = "SELECT distinct Modelo FROM productos where Subcategoria = '".$arre['Subcategoria']."' order by Modelo asc";
/*
if($arre['nivel'] == 'administrador' || $arre['nivel'] == 'MKT'){
	$query = "SELECT distinct Modelo FROM productos where Subcategoria = '".$arre['Subcategoria']."' order by Modelo asc";
}else{
	$query = "SELECT distinct Modelo FROM productos where Subcategoria = '".$arre['Subcategoria']."' and Pais like '%".$arre['Pais']."%' order by Modelo asc";
}
*/
$q = mysql_query($query) or die(mysql_error());


$modelos = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($modelos, $temp);
}
$res['modelos'] = $modelos;

echo json_encode($res);





?>
