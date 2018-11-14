<?php
include "dbc.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


$json = $_POST['json'];
$arre = json_decode($json, true);


$Nombrepadre = utf8_decode(urldecode($arre['Nombrepadre']));
$Nombrenino = utf8_decode(urldecode($arre['Nombrenino']));
$Estado = utf8_decode(urldecode($arre['Estado']));
$IDMunicipio = utf8_decode(urldecode($arre['IDMunicipio']));
$Telefono = urldecode($arre['Telefono']);
$Email = utf8_decode(urldecode($arre['Email']));

$NoTieneEmail = urldecode($arre['NoTieneEmail']);

$MotivoLlamada = utf8_decode(urldecode($arre['MotivoLlamada']));
$id_usuarios = urldecode($arre['IDUsuario']);
$Comentarios = utf8_decode(urldecode($arre['Comentarios']));
$Codigo = utf8_decode(urldecode($arre['Codigo']));


$res = array();


if($NoTieneEmail == true){
	$Email = 'notiene@notiene.com';
}


//revisar si este email de usuario ya se ha registrado anteriormente
$q = mysql_query("
select * from usuarios where email = '$Email'
") or die(mysql_error());

$num = mysql_num_rows($q);
$num = 0;
if($num == 0 || $NoTieneEmail == true){
//if($num == 0){
	//no se ha registrado este email anteriormente

	$q = mysql_query("
	select * from usuarios where (nombrepadre = '$Nombrepadre')
	") or die(mysql_error());
	$num = mysql_num_rows($q);

	if($num == 0){

		//revisar si el usuario seleccionó Registro Ticket
		if($MotivoLlamada == 'Registro Ticket'){

			//revisar si existe ya este ticket registrado en la base de datos
			$q = mysql_query("
			select * from participaciones where codigo = '$Codigo'
			") or die(mysql_error());

			$num = mysql_num_rows($q);

			if($num == 0){


				$res['res'] = 'ok';
				$res['tipo'] = 'ticket';
				//registrar usuario
				$q = mysql_query("
				insert into usuarios
				(nombrepadre, nombrenino, estado, idmunicipio, telefono, email, medio)
				values
				('$Nombrepadre','$Nombrenino','$Estado','$IDMunicipio','$Telefono','$Email','CallCenter')
				") or die(mysql_error());

				$id_participantes = mysql_insert_id();

				$pwd = genPassword($id_participantes, $Nombrepadre, $Nombrenino);

				$q = mysql_query("
				update usuarios set
				pwd = '$pwd'
				where id = $id_participantes
				") or die(mysql_error());


				$q = mysql_query("
				insert into llamadas
				(id_participantes,id_usuarios,MotivoLlamada,Comentarios,Codigo)
				values
				($id_participantes,$id_usuarios,'$MotivoLlamada','$Comentarios','$Codigo')
				") or die(mysql_error());

				$id_insert = mysql_insert_id();

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

				$temp['id'] = $id_participantes;
				$temp['Nombrepadre'] = utf8_encode($Nombrepadre);
				$temp['Nombrenino'] = utf8_encode($Nombrenino);
				$temp['Estado'] = utf8_encode($Estado);
				$temp['IDMunicipio'] = utf8_encode($IDMunicipio);
				$temp['Telefono'] = utf8_encode($Telefono);
				$temp['Email'] = utf8_encode($Email);
				$res['participante'] = $temp;

				$res['preguntas'] = $preguntas;

				$res['idparticipante'] = $id_participantes;
				$res['codigo'] = $Codigo;
				$res['id_llamada'] = $id_insert;
				$email = $Email;
				include "sendmail.php";

			}else{
				//el ticket es repetido
				$res['res'] = 'error';
				$res['error'] = 'Este ticket ya se ha registrado anteriormente.';
			}

		}else{
			$res['res'] = 'ok';
			$res['tipo'] = 'noticket';
			//registrar usuario

			$pwd = randomPassword();

			$q = mysql_query("
				insert into usuarios
				(nombrepadre, nombrenino, estado, idmunicipio, telefono, email, pwd, medio)
				values
				('$Nombrepadre','$Nombrenino','$Estado','$IDMunicipio','$Telefono','$Email','$pwd','CallCenter')
				") or die(mysql_error());

			$id_participantes = mysql_insert_id();

			$q = mysql_query("
			insert into llamadas
			(id_participantes,id_usuarios,MotivoLlamada,Comentarios,Codigo)
			values
			($id_participantes,$id_usuarios,'$MotivoLlamada','$Comentarios','$Codigo')
			") or die(mysql_error());

			$id_insert = mysql_insert_id();

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

			$temp['id'] = $id_participantes;
			$temp['Nombrepadre'] = utf8_encode($Nombrepadre);
			$temp['Nombrenino'] = utf8_encode($Nombrenino);
			$temp['Estado'] = utf8_encode($Estado);
			$temp['IDMunicipio'] = utf8_encode($IDMunicipio);
			$temp['Telefono'] = utf8_encode($Telefono);
			$temp['Email'] = utf8_encode($Email);
			$res['participante'] = $temp;

			$res['preguntas'] = $preguntas;

			$res['idparticipante'] = $id_participantes;
			$res['codigo'] = $Codigo;
			$res['id_llamada'] = $id_insert;
			$email = $_POST['Email'];
			include "sendmail.php";

		}


	}else if($num > 0){
		$res['res'] = 'error';
		$res['error'] = 'Este participante ya se ha registrado anteriormente.';
	}

}else if($num > 0){
	$res['res'] = 'error';
	$res['error'] = 'Este email ya ha registrado anteriormente.';
}


echo json_encode($res);





?>
