<?php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


include "dbc.php";

$json = $_POST['json'];
$arre = json_decode($json, true);
	


$res = array();

$res['res'] = 'ok';


$q = mysql_query("
update participaciones
set tiempo = TIMESTAMPDIFF(SECOND,fecha_inicio,fecha_fin)
") or die(mysql_error());


$q = mysql_query("
SELECT * 
FROM  vista_reportes_ok order by vista_reportes_ok.fecha_fin_trivia_juego asc
") or die(mysql_error());



$participaciones = array();
/*
while ($row = mysql_fetch_array($q))   
{  

	
	$temp['idusuarios'] = $row['idusuarios'];
	$temp['nombrepadre'] = $row['nombrepadre'];
	$temp['estadocc'] = $row['estado'];
	$temp['estadoweb'] = $row['nombre'];
	$temp['idmunicipio'] = $row['idmunicipio'];
	$temp['telefono'] = $row['telefono'];
	$temp['medio'] = $row['medio'];
	$temp['fecha_registro_usuario'] = $row['fecha_registro_usuario'];
	$temp['codigo'] = $row['codigo'];
	$temp['puntaje'] = $row['puntaje'];
	$temp['fecha_inicio_trivia_juego'] = $row['fecha_inicio_trivia_juego'];
	$temp['fecha_fin_trivia_juego'] = $row['fecha_fin_trivia_juego'];
	$temp['tiempo'] = $row['tiempo'];
	$temp['fecha_participacion'] = $row['fecha_participacion'];

	
	$temp['p1'] = $row['p1'];
	$temp['p2'] = $row['p2'];
	$temp['p3'] = $row['p3'];
	$temp['p4'] = $row['p4'];
	$temp['p5'] = $row['p5'];
	
	$temp['r1'] = $row['r1'];
	$temp['r2'] = $row['r2'];
	$temp['r3'] = $row['r3'];
	$temp['r4'] = $row['r4'];
	$temp['r5'] = $row['r5'];
	
	$temp['aciertoscc'] = $row['aciertos'];
	
	$temp['operador'] = $row['operador'];
	
	
	
	array_push($participaciones, $temp);
}
*/

while($row = mysql_fetch_assoc($q)){
	$current_charset = 'ISO-8859-15';//or what it is now
	array_walk_recursive($row,function(&$value) use ($current_charset){
		 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
		$value = utf8_encode($value);
	});
	$temp = json_encode($row);
	array_push($participaciones, $temp);
}
//$participaciones = json_encode($participaciones, JSON_FORCE_OBJECT);
//print_r($participaciones);

$res['participaciones'] = $participaciones;

echo json_encode($res);




	
?>