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
$Codigo = utf8_decode(urldecode($arre['Codigo']));
$id_llamada = utf8_decode(urldecode($arre['IDLlamada']));

$res = array();




//registrar usuario

$q = mysql_query("
select * from participaciones where codigo = '$Codigo' and id_usuarios = '$id_participantes' and id_llamadas = '$id_llamada'
") or die(mysql_error());

$num = mysql_num_rows($q);


if($num == 0){
	//el ticket no es repetido en participaciones, insertando participacion
	
	$res['res'] = 'ok';
	$q = mysql_query("
	insert into participaciones
	(id_usuarios,codigo,id_llamadas, fecha_inicio)
	values
	($id_participantes,'$Codigo','$id_llamada', now())
	") or die(mysql_error());
	
	$id_insert = mysql_insert_id();
	
	$res['idparticipante'] = $id_participantes;
	
	
}else{
	
	//el ticket es repetido
	$res['res'] = 'error';
	$res['error'] = 'Este código ya se ha registrado anteriormente.';

}


echo json_encode($res);




	
?>