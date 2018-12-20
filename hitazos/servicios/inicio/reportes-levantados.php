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

if($arre["IDDistribuidor"]>0){
  $query = "SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno, DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
  FROM reportes, clientes
  where clientes.id = reportes.IDCliente
  and reportes.IDDistribuidor = ".$arre["IDDistribuidor"]."
  and reportes.IDCliente = ".$arre['IDCliente']."
  order by FechaRegistroReporte desc LIMIT 5;";
}else{
  $query = "SELECT  reportes.*, clientes.Pais, clientes.RazonSocial, clientes.Nombre, clientes.APaterno, clientes.AMaterno, DATE_FORMAT(FechaRegistroReporte,  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
  FROM reportes, clientes
  where clientes.id = reportes.IDCliente
  and reportes.IDCentro = ".$arre["IDCentro"]."
  and reportes.IDCliente = ".$arre['IDCliente']."
  order by FechaRegistroReporte desc LIMIT 5;";
}


$q = mysql_query($query) or die(mysql_error());

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
