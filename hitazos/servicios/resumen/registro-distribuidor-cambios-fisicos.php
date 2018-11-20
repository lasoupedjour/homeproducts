<?php
// error_reporting(E_ALL);
// ini_set('display_errors', 1);
include "../dbci.php";

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}


$json = $_POST['json'];
$arre = json_decode($json, true);

$CostoLanded = utf8_decode(urldecode($arre['CostoLanded']));
$FechaEntregaCambio = utf8_decode(urldecode($arre['FechaEntregaCambio']));
$IDReporte = utf8_decode(urldecode($arre['IDReporte']));

$FechaEntregaCambio = urldecode($arre['FechaEntregaCambio']['year']).'-'.urldecode($arre['FechaEntregaCambio']['month']).'-'.urldecode($arre['FechaEntregaCambio']['day']);

$res = array();
$res['res'] = 'ok';

if ($stmt = $mysqli->prepare("

update reportes set
CostoLanded = ?,
FechaEntregaCambio = ?,
FechaCostoLanded = now()
where id = ?

")) {
	$stmt->bind_param("dsd",
	$arre['CostoLanded'],
	$FechaEntregaCambio,
	$arre['IDReporte']

	);
	if($stmt->execute()){

		$reporte = array();

		$query = "
		select * from reportes where id = ".$arre['IDReporte'].";
		";

		if ($result = $mysqli->query($query)) {
			while ($row = $result->fetch_array()) {

				$current_charset = 'ISO-8859-15';//or what it is now
				array_walk_recursive($row,function(&$value) use ($current_charset){
					 //$value = iconv('UTF-8//TRANSLIT',$current_charset,$value);
					$value = utf8_encode($value);
				});
				$temp = json_encode($row);
				array_push($reporte, $temp);
			}
			$result->close();
		}else{
			print_r (mysqli_error());
		}


		$res['idreporte'] = $arre['IDReporte'];
		$res['objreporte'] = $reporte[0];

	}else{
		$res['res'] = 'error';
		$res['msg'] = $stmt->error;

	}
}


echo json_encode($res);
?>
