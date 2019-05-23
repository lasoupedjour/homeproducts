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

$query = "
          SELECT  reportes.*, centros.nombre as NombreCentro, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno,
          DATE_FORMAT(DATE_ADD(FechaRegistroReporte, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
          FROM reportes, clientes, centros, zonas_horarias
          where clientes.id = reportes.IDCliente
          and centros.id = reportes.IDCentro
          and StatusReporte = 'Reparacion' and reportes.status=1
          and zonas_horarias.pais = centros.pais
          order by FechaRegistroReporte desc :LIMIT
          ";

if($arre["limit"]=="")
  $query = str_replace(":LIMIT", "", $query);
else
  $query = str_replace(":LIMIT", "LIMIT 5", $query);

$q = mysql_query($query) or die(mysql_error());

$reportes = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});


	$refacciones = json_decode($row['Refacciones']);
	$agregar = false;
	foreach($refacciones as $refaccion){
		$statuscotizacion = $refaccion->StatusCotizacion;
		if($statuscotizacion == 'Cotizada'){
			$agregar = true;
			$row['Refacciones'] = $refaccion;
			$temp = json_encode($row);
			array_push($reportes, $temp);
		}
	}

	/*if($agregar){
		//print_r($statuscotizacion);
		$temp = json_encode($row);
		array_push($reportes, $temp);
	}
	*/
}
$res['reportes'] = $reportes;

echo json_encode($res);





?>
