<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);
	


$Comentarios = utf8_decode(urldecode($arre['Comentarios']));
$id_participantes = urldecode($arre['IDParticipante']);
$id_usuarios = urldecode($arre['IDUsuario']);
$id_llamada = utf8_decode(urldecode($arre['IDLlamada']));
$Codigo = utf8_decode(urldecode($arre['Codigo']));

$p1 = utf8_decode(urldecode($arre['p1']));
$p2 = utf8_decode(urldecode($arre['p2']));
$p3 = utf8_decode(urldecode($arre['p3']));
$p4 = utf8_decode(urldecode($arre['p4']));
$p5 = utf8_decode(urldecode($arre['p5']));

$r1 = utf8_decode(urldecode($arre['r1']));
$r2 = utf8_decode(urldecode($arre['r2']));
$r3 = utf8_decode(urldecode($arre['r3']));
$r4 = utf8_decode(urldecode($arre['r4']));
$r5 = utf8_decode(urldecode($arre['r5']));

$aciertos = utf8_decode(urldecode($arre['aciertos']));


$res = array();




//registrar usuario

$q = mysql_query("
select * from participaciones where codigo = '$Codigo' and id_usuarios = '$id_participantes' and id_llamadas = '$id_llamada' and p1 = ''
") or die(mysql_error());

$num = mysql_num_rows($q);


if($num > 0){
	//el ticket no es repetido en participaciones, insertando participacion
	
	$res['res'] = 'ok';
	$q = mysql_query("
	update participaciones set
	p1 = '$p1',
	p2 = '$p2',
	p3 = '$p3',
	p4 = '$p4',
	p5 = '$p5',
	r1 = '$r1',
	r2 = '$r2',
	r3 = '$r3',
	r4 = '$r4',
	r5 = '$r5',
	aciertos = '$aciertos',
	fecha_fin = now(),
	tiempo = TIMESTAMPDIFF(SECOND,fecha_inicio,now())
	where codigo = '$Codigo' and id_usuarios = '$id_participantes' and id_llamadas = '$id_llamada' and p1 = ''
	") or die(mysql_error());
	
	//$id_insert = mysql_insert_id();
	
	$q = mysql_query("
	select tiempo from participaciones where codigo = '$Codigo' and id_usuarios = '$id_participantes' and id_llamadas = '$id_llamada'
	") or die(mysql_error());
	
	
	list($tiempo) = mysql_fetch_row($q);
	
	$res['tiempo'] = $tiempo;
	$res['idparticipante'] = $id_participantes;
	
}else{
	
	//el ticket es repetido
	$res['res'] = 'error';
	$res['error'] = 'Este código ya se ha registrado anteriormente.';

}


echo json_encode($res);




	
?>