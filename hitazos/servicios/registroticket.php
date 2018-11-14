<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);
	


$MotivoLlamada = utf8_decode(urldecode($arre['MotivoLlamada']));
$Comentarios = utf8_decode(urldecode($arre['Comentarios']));
$id_participantes = urldecode($arre['IDParticipante']);

$id_usuarios = urldecode($arre['IDUsuario']);


$Codigo = utf8_decode(urldecode($arre['Codigo']));


$res = array();




//registrar usuario

if($MotivoLlamada == 'Registro Ticket'){
	
	
	$q = mysql_query("
	select * from participaciones where codigo = '$Codigo'
	") or die(mysql_error());

	$num = mysql_num_rows($q);
	
	
	if($num == 0){
		//el ticket no es repetido en participaciones, insertando llamada solamente, no participacion
		
		$res['res'] = 'ok';
		$res['tipo'] = 'ticket';
		$q = mysql_query("
		insert into llamadas
		(id_participantes,id_usuarios,MotivoLlamada,Comentarios,Codigo)
		values
		($id_participantes,$id_usuarios,'$MotivoLlamada','$Comentarios','$Codigo')
		") or die(mysql_error());
		
		$id_insert = mysql_insert_id();
		
		$res['idparticipante'] = $id_participantes;
		$res['codigo'] = $Codigo;
		$res['id_llamada'] = $id_insert;
		
	}else{
		
		//el ticket es repetido
		$res['res'] = 'error';
		$res['error'] = 'Este código ya se ha registrado anteriormente.';
	
	}

}else{
	
	$res['res'] = 'ok';
	$res['tipo'] = 'noticket';
	$q = mysql_query("
	insert into llamadas
	(id_participantes,id_usuarios,MotivoLlamada,Comentarios,Codigo)
	values
	($id_participantes,$id_usuarios,'$MotivoLlamada','$Comentarios','$Codigo')
	") or die(mysql_error());

	$res['fecha'] = $Fecha;
	$res['idparticipante'] = $id_participantes;
	
}

echo json_encode($res);




	
?>