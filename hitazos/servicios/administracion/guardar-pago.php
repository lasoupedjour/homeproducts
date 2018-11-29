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


$res = array();



$res['res'] = 'ok';

//$FechaFactura = urldecode($arre['FechaFactura']['year']).'-'.urldecode($arre['FechaFactura']['month']).'-'.urldecode($arre['FechaFactura']['day']);

$IDCentro = 0;
$IDDistribuidor = 0;

if($arre['IDCentro']!="")
	$IDCentro = $arre['IDCentro'];

if($arre['IDDistribuidor']!="")
	$IDDistribuidor = $arre['IDDistribuidor'];
//insertar
if ($stmt = $mysqli->prepare("

insert into pagos(IDCentro, IDDistribuidor, ODS, MontoTotal, StatusPago,Comprobante,FechaRegistro,Mes,Ano)
values
(?,?,?,?,'Enviado','Pago sin realizar',now(),?,?)

")) {
	$stmt->bind_param("ddsdss",
	$IDCentro,
	$IDDistribuidor,
	$arre['Ordenes'],
	$arre['MontoTotal'],
	$arre['Mes'],
	$arre['Ano']
	);
	if($stmt->execute()){

		$pagos = array();

		$query = "
		select * from pagos order by FechaRegistro desc;
		";

		if ($result = $mysqli->query($query)) {
			while ($row = $result->fetch_array()) {

				$current_charset = 'ISO-8859-15';//or what it is now
				array_walk_recursive($row,function(&$value) use ($current_charset){
					 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
					$value = utf8_encode($value);
				});
				$temp = json_encode($row);
				array_push($pagos, $temp);
			}
			$result->close();
		}else{
			print_r (mysqli_error());
		}


		$res['pagos'] = $pagos;

	}else{
		$res['res'] = 'error';
		$res['msg'] = $stmt->error;

	}
}



echo json_encode($res);

$stmt->close();
$mysqli->close();









?>
