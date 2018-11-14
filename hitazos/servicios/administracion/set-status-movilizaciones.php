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


$q = mysqli_query($con, "
update reportes set 
StatusMovilidad = '".$arre["StatusMovilidad"]."',
FechaStatusMovilidad = now()
where id = ".$arre["IDReporte"]."
");


/**************/




$q = mysqli_query($con, "
SELECT  reportes.*, centros.nombre as NombreCentro, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno, tarifas.SubtipoServicio, tarifas.Valor
FROM reportes, clientes, centros, tarifas
where clientes.id = reportes.IDCliente
and centros.id = reportes.IDCentro
and StatusMovilidad <> ''
and reportes.IDTarifas = tarifas.id
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
