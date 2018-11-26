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




$res = array();

$res['res'] = 'ok';

if($arre["nivel"] == "administrador" || $arre["nivel"] == "MKT"){
  $query = "SELECT id, Nombre, Ciudad from centros order by Nombre asc";
}else{
  $query = "
            SELECT id, Nombre, Ciudad from centros
            where Pais = '".$arre['Pais']."'
            and
            (IDMaster=". $arre["IDMaster"] ." or id=". $arre["IDMaster"] .") order by Nombre asc";
}

if($arre["IDDistribuidor"]>0){
  $query = "
            SELECT id, Nombre, Ciudad from centros
            where Pais = '".$arre['Pais']."' and IDMaster=0 order by Nombre asc";
}

$q = mysql_query($query) or die(mysql_error());

$centros = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($centros, $temp);
}
$res['centros'] = $centros;

echo json_encode($res);





?>
