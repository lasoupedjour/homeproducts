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


$q = mysqli_query($con, "SELECT * from reportes where id = ".$arre["IDReporte"]);


$reportes = array();
////$FechaRevision = urldecode($arre['FechaRevision']['year']).'-'.urldecode($arre['FechaRevision']['month']).'-'.urldecode($arre['FechaRevision']['day']);



while ($row = mysqli_fetch_array($q))   
{  
	//echo 'aqui';
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		//$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	
	
	$refacciones = json_decode($row['Refacciones']);
	$agregar = false;
	//print_r($refacciones);
	
	foreach($refacciones as $refaccion){
		
		$noparte = $refaccion->NoParte;
		//echo $noparte;
		
		if($noparte == $arre["NoParte"]){
		
			$refaccion->Status = $arre["Status"];
			$refaccion->FechaStatusCotizacion = date('Y-m-d H:i:s');
			
		}
		
	}
	

	
	$q = mysqli_query($con,"update reportes set Refacciones = '".utf8_decode(json_encode($refacciones, JSON_UNESCAPED_UNICODE))."' where id = ".$arre["IDReporte"]);


}


/**************/




$q = mysqli_query($con,"
SELECT  reportes.*, centros.nombre as NombreCentro, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno
FROM reportes, clientes, centros
where clientes.id = reportes.IDCliente
and centros.id = reportes.IDCentro
and StatusReporte = 'Reparacion'
order by FechaRegistroReporte desc LIMIT 5
");


$reportes = array();

while ($row = mysqli_fetch_array($q))   
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
