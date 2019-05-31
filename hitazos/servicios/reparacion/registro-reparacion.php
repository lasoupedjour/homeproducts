<?php
	ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
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

//$FechaRevision = urldecode($arre['FechaRevision']['year']).'-'.urldecode($arre['FechaRevision']['month']).'-'.urldecode($arre['FechaRevision']['day']);

$TipoReclamoDiagnostico = $arre["TipoReclamoDiagnostico"];
$StatusReporte = "Reparacion";

if($TipoReclamoDiagnostico=="Instrucciones de uso" || $TipoReclamoDiagnostico=="No aplica garantía"){
	$StatusReporte = "Cerrado";
}

//insertar
if ($stmt = $mysqli->prepare("

update reportes set
NoSerie = ?,
IDCentro= ?,
TipoReclamoDiagnostico = ?,
MotivoCambioDiagnostico = ?,
ObservacionesCDSDiagnostico = ?,
CondicionProductoDiagnostico = ?,
Refacciones = ?,
FechaDiagnostico = now(),
StatusReporte = ?,
RequiereRecoleccion = ?
where id = ?

")) {
	$stmt->bind_param("sdsssssssd",
	$arre['NoSerie'],
	$arre['IDCentro'],
	$arre['TipoReclamoDiagnostico'],
	$arre['MotivoCambioDiagnostico'],
	$arre['ObservacionesCDSDiagnostico'],
	$arre['CondicionProductoDiagnostico'],
	$arre['Refacciones'],
	$StatusReporte,
	$arre['RequiereRecoleccion'],
	$arre['IDReporte']

	);
	if($stmt->execute()){

		// refacciones

		//$refacciones = $arre['Refacciones'];
		////////$refacciones = json_decode($refacciones);
		//$refacciones = $refacciones[0];
		//echo $refacciones->NombreRefaccion;



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

$stmt->close();
$mysqli->close();









?>
