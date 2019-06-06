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

if($arre['nivel'] == 'administrador' || $arre['nivel'] == 'MKT' ||  $arre['nivel'] == 'contactcenter'){
	$query = "SELECT  clientes.*, DATE_FORMAT(DATE_ADD(FechaRegistro, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
  FROM clientes, centros, zonas_horarias where centros.id = clientes.IDCentro and zonas_horarias.pais = centros.pais order by FechaRegistro desc LIMIT 5;";
}else{
  if($arre["IDDistribuidor"]==0)
	 $query = "SELECT  clientes.*, DATE_FORMAT(DATE_ADD(FechaRegistro, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
   FROM clientes, centros, zonas_horarias
   where clientes.Pais = '".$arre["Pais"]."' and IDCentro = ".$arre["IDCentro"]." and centros.id = clientes.IDCentro and zonas_horarias.pais = centros.pais order by FechaRegistro desc LIMIT 5;";
  else
    $query = "SELECT  clientes.*, DATE_FORMAT(DATE_ADD(FechaRegistro, INTERVAL zonas_horarias.horas HOUR),  '%d/%m/%Y %H:%i:%s' ) as FechaRegistroReporteNF
    FROM clientes, distribuidores, zonas_horarias
    where clientes.Pais = '".$arre["Pais"]."' and clientes.IDDistribuidor = ".$arre["IDDistribuidor"]."  and distribuidores.id = clientes.IDDistribuidor and zonas_horarias.pais = distribuidores.pais order by FechaRegistro desc LIMIT 5;";
}

$q = mysql_query($query) or die(mysql_error());

$clientes = array();

while ($row = mysql_fetch_array($q))
{
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($clientes, $temp);
}
$res['clientes'] = $clientes;

echo json_encode($res);





?>
