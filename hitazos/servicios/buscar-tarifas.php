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

$tipoTarifa = '';

$q = mysql_query("
SELECT TipoTarifa
from productos
where Modelo = '".$arre['Modelo']."' limit 1;
") or die(mysql_error());

$num = mysql_num_rows($q);

while ($num > 0)
{
	list($tipoTarifa) = mysql_fetch_row($q);
	$num --;
}

if($arre['Modelo']=='OS-17001' || $arre['Modelo']=='OS-17001-1')
  $tipoTarifa = "OLLA PRESION";

$q = mysql_query("
SELECT distinct id, IDGrupoTarifa, TipoTarifa, TipoServicio, SubtipoServicio, Valor, Impuesto, TarifaMensual, ImpuestoTarifaMensual, NecesitaAutorizacion FROM tarifas where TipoTarifa = '$tipoTarifa' and IDGrupoTarifa = ".$arre["IDGrupoTarifa"]."
") or die(mysql_error());


$tarifas = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($tarifas, $temp);
}
$res['tarifas'] = $tarifas;

echo json_encode($res);





?>
