<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);
	

$id_participantes = urldecode($arre['IDParticipante']);

$res = array();

$q = mysql_query("
select nombrepadre, nombrenino, estado, idmunicipio, telefono, email from usuarios where id = $id_participantes 
") or die(mysql_error());

$num = mysql_num_rows($q);

if($num == 0){
	
	$res['res'] = 'error';
	$res['error'] = 'Este usuario no existe';

}else if($num > 0){
	$res['res'] = 'ok';
	
	list($Nombrepadre, $Nombrenino, $Estado, $IDMunicipio, $Telefono, $Email) = mysql_fetch_row($q);
	
	$temp['id'] = $row['id'];
	$temp['Nombrepadre'] = utf8_encode($Nombrepadre);
	$temp['Nombrenino'] = utf8_encode($Nombrenino);
	$temp['Estado'] = utf8_encode($Estado);
	$temp['IDMunicipio'] = utf8_encode($IDMunicipio);
	$temp['Telefono'] = utf8_encode($Telefono);
	$temp['Email'] = utf8_encode($Email);
	
	//$preguntas = array();
	
	
	$q = mysql_query("
	SELECT codigo, timestamp FROM `participaciones` where id_usuarios = $id_participantes
	") or die(mysql_error());
	while($row = mysql_fetch_array($q)){
		$codigo=utf8_encode($row['codigo']); 
		$timestamp=utf8_encode($row['timestamp']); 
		
		$participaciones[] = array('codigo' => $codigo,'timestamp' => $timestamp);
	}
	$res['participaciones'] = $participaciones;
	
	$q = mysql_query("
	select * from preguntas;
	") or die(mysql_error());
	while($row = mysql_fetch_array($q)){
		$id=utf8_encode($row['id']); 
		$pregunta=utf8_encode($row['pregunta']); 
		$a=utf8_encode($row['a']); 
		$b=utf8_encode($row['b']); 
		$c=utf8_encode($row['c']); 
		$correcta=utf8_encode($row['correcta']);
		//echo $pregunta;
		$preguntas[] = array('id' => $id,'pregunta' => $pregunta,'a' => $a,'b' => $b,'c' => $c,'correcta' => $correcta);
	}
	//print_r($preguntas);
	//echo json_encode($preguntas);
	
	//registrar usuario
	$res['participante'] = $temp;
	$res['preguntas'] = $preguntas;

}


echo json_encode($res);




	
?>