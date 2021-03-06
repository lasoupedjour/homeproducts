﻿<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

include "./dbci.php";



$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});


$res = array();
$res['res'] = 'ok';


/*******************SET REPORTE*****************************/

$reporte = array();

$IDCliente = '';

$query = "
select reportes.*, tarifas.SubtipoServicio, tarifas.Valor, DATE_FORMAT(DATE_ADD(FechaRegistroReporte, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(DATE_ADD(FechaCompra, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF
from reportes
LEFT JOIN tarifas on IDTarifas = tarifas.id
LEFT Join centros on centros.id = reportes.idcentro
LEFT JOIN zonas_horarias on zonas_horarias.pais = centros.pais
where reportes.id = ".$arre['id'].";
";


if ($result = $mysqli->query($query)) {
	while ($row = $result->fetch_array()) {
		$IDCliente = $row['IDCliente'];
		$current_charset = 'ISO-8859-15';//or what it is now
		array_walk_recursive($row,function(&$value) use ($current_charset){
			 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
			$value = utf8_encode($value);
		});
		$temp = json_encode($row);
		array_push($reporte, $temp);
	}
	$result->close();
}else{
	print_r (mysqli_error());
}
$res['idreporte'] = $arre['id'];
$res['reporte'] = $reporte[0];


/*******************SET REFACCIONES*****************************/

$refacciones = array();

$query = "
select * from refacciones where IDReporte = ".$arre['id'].";
";

if ($result = $mysqli->query($query)) {
	while ($row = $result->fetch_array()) {

		$current_charset = 'ISO-8859-15';//or what it is now
		array_walk_recursive($row,function(&$value) use ($current_charset){
			 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
			$value = utf8_encode($value);
		});
		$temp = json_encode($row);
		array_push($refacciones , $temp);
	}
	$result->close();
}else{
	print_r (mysqli_error());
}
$res['refacciones'] = $refacciones;



/*******************SET CLIENTE*****************************/

$cliente = array();

$query = "

select *, DATE_FORMAT(FechaRegistro,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroNF from clientes where id = ".$IDCliente.";

";
//echo $query;


if ($result = $mysqli->query($query)) {
	while ($row = $result->fetch_array()) {

		$current_charset = 'ISO-8859-15';//or what it is now
		array_walk_recursive($row,function(&$value) use ($current_charset){
			 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
			$value = utf8_encode($value);
		});
		$temp = json_encode($row);
		array_push($cliente, $temp);
    }
    $result->close();
}else{
	print_r (mysqli_error());
}

$res['cliente'] = $cliente[0];



/*****ENVIAR*******/
echo json_encode($res);
$mysqli->close();




?>
