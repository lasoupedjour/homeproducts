<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

$json = $_POST['json'];
$arre = json_decode($json, true);
	


$res = array();

$res['res'] = 'ok';


$q = mysql_query("
SELECT 
llamadas.id as LlamadaID,
llamadas.MotivoLlamada,
llamadas.Comentarios,
llamadas.EstadoCompra,
llamadas.Fecha as FechaTicket,
llamadas.Tienda,
llamadas.Ticket,
llamadas.Monto,
llamadas.Timestamp as Fecharegistro,
participantes.id as ParticipanteID,
participantes.Nombre,
participantes.Apaterno,
participantes.Amaterno,
participantes.Numero,
participantes.Colonia,
participantes.CP,
participantes.Ciudad,
participantes.Estado,
participantes.Telefono,
participantes.Celular,
participantes.Email,
participantes.Calle,
usuarios.nombre as Operador
FROM usuarios, participantes, llamadas WHERE llamadas.id_usuarios = usuarios.id and llamadas.id_participantes = participantes.id
order by Fecharegistro DESC
") or die(mysql_error());



$llamadas = array();

while ($row = mysql_fetch_array($q))   
{  
	$temp['LlamadaID'] = $row['LlamadaID'];
	$temp['MotivoLlamada'] = utf8_encode($row['MotivoLlamada']);
	$temp['Comentarios'] = utf8_encode($row['Comentarios']);
	$temp['EstadoCompra'] = utf8_encode($row['EstadoCompra']);
	$temp['FechaTicket'] = utf8_encode($row['FechaTicket']);
	$temp['Tienda'] = utf8_encode($row['Tienda']);
	$temp['Ticket'] = utf8_encode($row['Ticket']);
	$temp['Monto'] = utf8_encode($row['Monto']);
	$temp['Fecharegistro'] = utf8_encode($row['Fecharegistro']);
	$temp['ParticipanteID'] = utf8_encode($row['ParticipanteID']);
	$temp['Nombre'] = utf8_encode($row['Nombre']);
	$temp['Apaterno'] = utf8_encode($row['Apaterno']);
	$temp['Amaterno'] = utf8_encode($row['Amaterno']);
	$temp['Numero'] = utf8_encode($row['Numero']);
	$temp['Colonia'] = utf8_encode($row['Colonia']);
	$temp['CP'] = utf8_encode($row['CP']);
	$temp['Ciudad'] = utf8_encode($row['Ciudad']);
	$temp['Estado'] = utf8_encode($row['Estado']);
	$temp['Telefono'] = utf8_encode($row['Telefono']);
	$temp['Celular'] = utf8_encode($row['Celular']);
	$temp['Email'] = utf8_encode($row['Email']);
	$temp['Calle'] = utf8_encode($row['Calle']);
	$temp['Operador'] = utf8_encode($row['Operador']);
	
	
	
	array_push($llamadas, $temp);
}
$res['llamadas'] = $llamadas;

echo json_encode($res);




	
?>