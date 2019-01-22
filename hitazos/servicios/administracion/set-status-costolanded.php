<?php
	/*ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);*/
error_reporting(E_ALL);
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

include "../dbci.php";



$json = $_POST['json'];
$arre = json_decode($json, true);

$current_charset = 'ISO-8859-15';//or what it is now
array_walk_recursive($arre,function(&$value) use ($current_charset){
     $value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
});


$res = array();

$res['res'] = 'ok';

/*Obtenemos el estatus del costolanded*/
$query = "
select AdjuntosReciclaje from reportes Where id='" . $arre['IDReporte'] . "';
";

if ($result = $mysqli->query($query)) {
  while ($row = $result->fetch_array()) {
    $AdjuntosReciclaje = $row["AdjuntosReciclaje"];
  }
}
if($AdjuntosReciclaje==""){//Si no existe información de reciclaje
  $q = mysqli_query($con, "
  update reportes set
  StatusCostoLanded = '".$arre["StatusCambioFisico"]."',
  FechaStatusCostoLanded = now()
  where id = ".$arre["IDReporte"]."
  ");

}else{
  $q = mysqli_query($con, "
  update reportes set
  StatusCostoLanded = '".$arre["StatusCambioFisico"]."',
  FechaStatusCostoLanded = now(),
  SubStatusReporte = 'Cerrado'
  where id = ".$arre["IDReporte"]."
  ");

}

$q = mysqli_query($con, "
SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno, DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF, DATE_FORMAT(FechaCompra,  '%d/%m/%Y %H:%i:%s' ) as FechaCompraNF
FROM reportes, clientes
where clientes.id = reportes.IDCliente
and StatusReporte = 'Orden de Servicio'
and TipoReclamoDiagnostico = 'Cambio'
order by FechaRegistroReporte desc LIMIT 5;
");




$reportes = array();

while ($row = mysqli_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($reportes, $temp);
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
