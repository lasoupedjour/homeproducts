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

$AdjuntosComprobantePago = Array();

$AdjuntosComprobantePago = subirAdjuntos($arre['IDReporte'], 'ComprobantePago', $arre['AdjuntosComprobantePagoSize']);

function subirAdjuntos($idreporte, $field){

	$arrebd = Array();

  for($i = 0; $i < $size; $i++){

		if(!empty($_FILES[$field.$i]['name'])){
			$uploadedFile = '';
			if(!empty($_FILES[$field.$i]["type"])){
				$fileName = $idreporte.'_'.time().'_'.$_FILES[$field.$i]['name'];
				$valid_extensions = array("jpeg", "jpg", "png", "pdf");
				$temporary = explode(".", $_FILES[$field.$i]["name"]);
				$file_extension = end($temporary);
				if((($_FILES["hard_file"]["type"] == "image/png") || ($_FILES[$field.$i]["type"] == "image/jpg") || ($_FILES[$field.$i]["type"] == "image/jpeg") || ($_FILES[$field.$i]["type"] == "image/png") || ($_FILES[$field.$i]["type"] == "application/pdf")) && in_array($file_extension, $valid_extensions)){
					$sourcePath = $_FILES[$field.$i]['tmp_name'];
					$targetPath = "uploads-pagos/".$fileName;
					if(move_uploaded_file($sourcePath,$targetPath)){
						$uploadedFile = $fileName;
						array_push($arrebd, $uploadedFile);
					}
				}
			}
		}

	}

	return $arrebd;

}

if ($stmt = $mysqli->prepare("

update pagos set
StatusPago = 'Pagado',
FechaPago = now(),
Comprobante = ?
where id = ?

")) {
	$stmt->bind_param("ss",
		json_encode($AdjuntosComprobantePago),
		$arre['IDReporte']
	);
	if($stmt->execute()){
		$res['res'] = 'ok';
	}else{
		$res['res'] = 'error';
		$res['msg'] = $stmt->error;

	}
}

$stmt->close();
$mysqli->close();

echo json_encode($res);
?>
