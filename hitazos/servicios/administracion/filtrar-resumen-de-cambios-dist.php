<?php
/*
error_reporting(E_ALL);
ini_set('display_errors', 1);
*/
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

$cds = $arre['cds'];
$ano = $arre['ano'];
$mes = $arre['mes'];
$categoria = $arre['Categoria'];

/*
$mesnext =
if($mes)*/

$fechaIni = $ano.'-'.$mes.'-'.'01';
$fechaFin = $ano.'-'.$mes.'-'.'31';

/*
Query original sin nombre de centro y master
SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno
FROM reportes, clientes
where clientes.id = reportes.IDCliente and
StatusReporte = 'Orden de Servicio'
:filtros
order by FechaOrdenServicio desc;
*/
$query = "
Select * From vista_reporte_cambios
where Distribuidor='" . $arre["CustomerID"] . "'
and StatusCostoLanded='Aprobado'
:filtros
order by FechaOrdenServicio desc;
          ";

$filtroFecha  = "";

if($mes!=0 && $ano!=0){
  $filtroFecha = " and (FechaOrdenServicio >= '$fechaIni' and FechaOrdenServicio <= '$fechaFin')";
}

if ($categoria!=""){
  $filtroCat = " and Categoria='$categoria'";
}

if($filtroFecha!="" && $categoria==""){
  $query = str_replace(":filtros", $filtroFecha, $query);
}elseif($filtroFecha!="" && $categoria!=""){
  $query = str_replace(":filtros", $filtroFecha . $filtroCat, $query);
}elseif($filtroFecha=="" && $categoria!=""){
  $query = str_replace(":filtros", $filtroCat, $query);
}else{
  $query = str_replace(":filtros", "", $query);
}
/*
echo($query);
die();
*/
$q = mysql_query($query) or die(mysql_error());

/*
SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno
FROM reportes
LEFT JOIN clientes on clientes.id = reportes.IDCliente
LEFT JOIN pagos on (reportes.IDCentro = pagos.IDCentro and pagos.Mes = '08' and pagos.Ano = '2018')
where reportes.IDCentro = 1
and StatusReporte = 'Orden de Servicio'
order by FechaOrdenServicio desc
*/

$reportes = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($reportes, $temp);
}
$res['reportes'] = $reportes;

$statuspago = array();
$q = mysql_query("
SELECT  StatusPago from pagos where Mes = '$mes' and Ano = '$ano' order by FechaRegistro desc limit 1
") or die(mysql_error());

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($statuspago, $temp);
}
$res['statuspago'] = $statuspago[0];

echo json_encode($res);





?>
