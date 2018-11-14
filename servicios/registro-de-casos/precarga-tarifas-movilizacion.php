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


$query = "SELECT tarifas.id, SubtipoServicio,Valor,NecesitaAutorizacion from centros, tarifas where tarifas.IDGrupoTarifa = centros.IDGrupoTarifa and tarifas.TipoServicio like '%Movilizaci%' and tarifas.TipoTarifa = '".$arre['Subcategoria']."' and centros.id = ".$arre['IDCentroCliente'];

$query = utf8_encode($query);

$q = mysql_query($query) or die(mysql_error());


$subtiposervicio = array();

while ($row = mysql_fetch_array($q))   
{  
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($subtiposervicio, $temp);
}
$res['subtiposervicio'] = $subtiposervicio;

echo json_encode($res);




	
?>