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

$mes = $arre['mes'];
$ano = $arre['ano'];
$IDCentro = $arre['IDCentro'];
/*
$mesnext =
if($mes)*/


$fechaIni = $ano.'-'.$mes.'-'.'01';
$fechaFin = $ano.'-'.$mes.'-'.'31';


$q = mysql_query("
SELECT  reportes.*,
DATE_FORMAT(DATE_ADD(FechaRegistroReporte, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporte,
DATE_FORMAT(DATE_ADD(FechaDiagnostico, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaDiagnostico,
clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno
FROM reportes, clientes, centros, zonas_horarias
where clientes.id = reportes.IDCliente and FechaOrdenServicio >= '$fechaIni' and FechaOrdenServicio <= '$fechaFin' and IDCentro = $IDCentro
and StatusReporte = 'Orden de Servicio'
and RefaccionesRecuperadas<>'' and RefaccionesRecuperadas<>'[]'
and centros.id = reportes.IDCentro
and zonas_horarias.pais = centros.pais
order by FechaOrdenServicio desc;
") or die(mysql_error());

echo("
SELECT  reportes.*,
DATE_FORMAT(DATE_ADD(FechaRegistroReporte, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporte,
DATE_FORMAT(DATE_ADD(FechaDiagnostico, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaDiagnostico,
clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno
FROM reportes, clientes, centros, zonas_horarias
where clientes.id = reportes.IDCliente and FechaOrdenServicio >= '$fechaIni' and FechaOrdenServicio <= '$fechaFin' and IDCentro = $IDCentro
and StatusReporte = 'Orden de Servicio'
and RefaccionesRecuperadas<>'' and RefaccionesRecuperadas<>'[]'
and centros.id = reportes.IDCentro
and zonas_horarias.pais = centros.pais
order by FechaOrdenServicio desc;
");
die();
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

echo json_encode($res);





?>
