<?php

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

$arre['RFC'] = strtoupper($arre['RFC']);


$res = array();



$res['res'] = 'ok';

if($arre['IDDistribuidor'] == null){
  $arre['IDDistribuidor'] = 0;
}


if($arre['NoTieneEmail'] == false){

	if($arre['IDCliente'] == null || $arre['IDCliente'] == ''){

		if ($stmt = $mysqli->prepare("
		select * from clientes
		where Email = ? and Status = 1
		")) {

			$stmt->bind_param("s", $arre['Email'] );
			$stmt->execute();
			$stmt->store_result();

			$num = $stmt->num_rows;
			$num = 0;
			if($num == 0){
				//insertar
				if ($stmt = $mysqli->prepare("
				insert into clientes (IDCentro, IDDistribuidor, OrigenContacto, TipoPersona, RFC, RazonSocial, Nombre, APaterno, AMaterno, Email, NoReferencia, Pais, IDEstado, IDMunicipio, IDLocalidad, CP, Direccion, NoExt, NoInt, CodigoPais, Telefono, Movil)
				values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				")) {
					$stmt->bind_param("ddssssssssssssssssssss",
					$arre['IDCentro'],
          $arre['IDDistribuidor'],
					$arre['OrigenContacto'],
					$arre['TipoPersona'],
					$arre['RFC'],
					$arre['RazonSocial'],
					$arre['Nombre'],
					$arre['APaterno'],
					$arre['AMaterno'],
					$arre['Email'],
					$arre['NoReferencia'],
					$arre['Pais'],
					$arre['IDEstado'],
					$arre['IDMunicipio'],
					$arre['IDLocalidad'],
					$arre['CP'],
					$arre['Direccion'],
					$arre['NoExt'],
					$arre['NoInt'],
					$arre['CodigoPais'],
					$arre['Telefono'],
					$arre['Movil']
					);
					if($stmt->execute()){
						$res['idcliente'] = $stmt->insert_id;

					}else{
						$res['res'] = 'error';
						$res['msg'] = $stmt->error;

					}
				}

			}else{
				//ya existe
				//comprobar si

			}

		}else{
			$res['res'] = 'error';
			$res['msg'] = 'error prepare';

		}

	}else{
	//actualizacion
		if ($stmt = $mysqli->prepare("

		update clientes set
		IDCentro = ?,
		OrigenContacto = ?,
		TipoPersona = ?,
		RFC = ?,
		RazonSocial = ?,
		Nombre = ?,
		APaterno = ?,
		AMaterno = ?,
		Email = ?,
		NoReferencia = ?,
		Pais = ?,
		IDEstado = ?,
		IDMunicipio = ?,
		IDLocalidad = ?,
		CP = ?,
		Direccion = ?,
		NoExt = ?,
		NoInt = ?,
		CodigoPais = ?,
		Telefono = ?,
		Movil = ?
		where id = ?

		")) {
			$stmt->bind_param("dssssssssssssssssssssd",
			$arre['OrigenContacto'],
			$arre['TipoPersona'],
			$arre['RFC'],
			$arre['RazonSocial'],
			$arre['Nombre'],
			$arre['APaterno'],
			$arre['AMaterno'],
			$arre['Email'],
			$arre['NoReferencia'],
			$arre['Pais'],
			$arre['IDEstado'],
			$arre['IDMunicipio'],
			$arre['IDLocalidad'],
			$arre['CP'],
			$arre['Direccion'],
			$arre['NoExt'],
			$arre['NoInt'],
			$arre['CodigoPais'],
			$arre['Telefono'],
			$arre['Movil'],
			$arre['IDCliente']
			);
			if($stmt->execute()){
				$res['idcliente'] = $arre['IDCliente'];

			}else{
				$res['res'] = 'error';
				$res['msg'] = $stmt->error;

			}
		}
	}

}else{
	//no tiene email, comprobar existencia por RFC o Nombre Completo
	$arre['Email'] = 'notiene@notiene.com';

	if($arre['RFC'] != ''){
		$stmt = $mysqli->prepare("
		select * from clientes
		where RFC = ? and Status = 1
		");
		$stmt->bind_param("s", $arre['RFC'] );
	}else{
		$stmt = $mysqli->prepare("
		select * from clientes
		where (Nombre = ? and APaterno = ? and AMaterno = ?) and Status = 1
		");
		$stmt->bind_param("sss", $arre['Nombre'], $arre['APaterno'], $arre['AMaterno'] );
	}

	if ($stmt) {

		$stmt->execute();
		$stmt->store_result();

		$num = $stmt->num_rows;

		if($num == 0){
			//insertar
			if ($stmt = $mysqli->prepare("
			insert into clientes (IDCentro, OrigenContacto, TipoPersona, RFC, RazonSocial, Nombre, APaterno, AMaterno, Email NoReferencia, Pais, IDEstado, IDMunicipio, IDLocalidad, CP, Direccion, NoExt, NoInt, CodigoPais, Telefono, Movil)
			values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
			")) {
				$stmt->bind_param("dsssssssssssssssssssss",
				$arre['IDCentro'],
				$arre['OrigenContacto'],
				$arre['TipoPersona'],
				$arre['RFC'],
				$arre['RazonSocial'],
				$arre['Nombre'],
				$arre['APaterno'],
				$arre['AMaterno'],
				$arre['Email'],
				$arre['NoReferencia'],
				$arre['Pais'],
				$arre['IDEstado'],
				$arre['IDMunicipio'],
				$arre['IDLocalidad'],
				$arre['CP'],
				$arre['Direccion'],
				$arre['NoExt'],
				$arre['NoInt'],
				$arre['CodigoPais'],
				$arre['Telefono'],
				$arre['Movil']
				);
				if($stmt->execute()){
					$res['idcliente'] = $stmt->insert_id;
				}else{
					$res['res'] = 'error';
					$res['msg'] = $stmt->error;

				}
			}

		}else{
			//ya existe
			//comprobar si
			$res['res'] = 'error';
			$res['msg'] = 'Este usuario ya existe.';

		}

	}else{
		$res['res'] = 'error';
		$res['msg'] = 'error prepare';

	}


}

echo json_encode($res);

$stmt->close();
$mysqli->close();









?>
